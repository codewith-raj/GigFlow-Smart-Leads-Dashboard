import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import type { LeadStats, LeadFilters } from '@/types';
import { STATUS_LABELS, SOURCE_LABELS } from '@/constants';

export interface CoachContext {
  stats: LeadStats | undefined;
  filters: Partial<LeadFilters>;
  search: string;
  pageMatchCount: number;
  totalMatching: number;
  userName?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const quickPrompts = [
  'What should I focus on today?',
  'How is my pipeline?',
  'Tips for qualified leads',
  'Explain my filters',
];

function buildContextSummary(ctx: CoachContext): string {
  const parts: string[] = [];
  if (ctx.stats) {
    parts.push(`Total leads: ${ctx.stats.total}.`);
    const topStatus = Object.entries(ctx.stats.byStatus).sort((a, b) => b[1] - a[1])[0];
    if (topStatus) parts.push(`Most common status: ${STATUS_LABELS[topStatus[0]] ?? topStatus[0]} (${topStatus[1]}).`);
    const topSource = Object.entries(ctx.stats.bySource).sort((a, b) => b[1] - a[1])[0];
    if (topSource) parts.push(`Top source: ${SOURCE_LABELS[topSource[0]] ?? topSource[0]} (${topSource[1]}).`);
  }
  parts.push(`This table view: ${ctx.pageMatchCount} leads on page, ${ctx.totalMatching} total matching filters.`);
  if (ctx.filters.status) parts.push(`Status filter: ${STATUS_LABELS[ctx.filters.status] ?? ctx.filters.status}.`);
  if (ctx.filters.source) parts.push(`Source filter: ${SOURCE_LABELS[ctx.filters.source] ?? ctx.filters.source}.`);
  if (ctx.search.trim()) parts.push(`Search: "${ctx.search.trim()}".`);
  if (ctx.filters.sort) parts.push(`Sort: ${ctx.filters.sort === 'latest' ? 'newest first' : 'oldest first'}.`);
  return parts.join(' ');
}

function replyForMessage(input: string, ctx: CoachContext): string {
  const q = input.toLowerCase().trim();
  const summary = buildContextSummary(ctx);
  const qualified = ctx.stats?.byStatus?.qualified ?? 0;
  const lost = ctx.stats?.byStatus?.lost ?? 0;
  const newCount = ctx.stats?.byStatus?.new ?? 0;

  if (/focus|today|priorit/i.test(q)) {
    return `Hi${ctx.userName ? ` ${ctx.userName.split(' ')[0]}` : ''}! With ${newCount} new leads, prioritize contacting the newest entries first, then move stalled "contacted" rows toward a decision. ${summary}`;
  }
  if (/pipeline|overview|how is/i.test(q)) {
    return `Pipeline snapshot: ${qualified} qualified vs ${lost} lost — aim to grow qualified while keeping lost reasons documented. ${summary}`;
  }
  if (/qualified|qualif/i.test(q)) {
    return `Qualified leads (${qualified}) deserve fast follow-up: confirm budget, timeline, and decision-maker. If a lead is stuck in "contacted", add a next step date in your CRM habit. ${summary}`;
  }
  if (/filter|search|sort/i.test(q)) {
    return `Filters compose together: status + source + debounced search all narrow the list; pagination is 10 per page. Clear chips reset individual filters. ${summary}`;
  }
  if (/export|csv/i.test(q)) {
    return `Admins can export CSV with the same filters applied to the table — useful for reporting. Sales users can still manage leads but cannot export.`;
  }
  if (/help|what can you/i.test(q)) {
    return `I'm a lightweight pipeline coach (no live AI): ask about focus, pipeline health, filters, or qualified-lead tips. ${summary}`;
  }
  return `Thanks for the note. ${summary} Try the quick prompts below for tailored suggestions.`;
}

const PipelineCoachChat: React.FC<{ context: CoachContext }> = ({ context }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hi! I'm your pipeline coach. Ask anything about your current stats, filters, or what to work on next.",
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
      const answer = replyForMessage(trimmed, context);
      const botMsg: Message = { id: `a-${Date.now()}`, role: 'assistant', text: answer };
      setMessages((prev) => [...prev, userMsg, botMsg]);
      setInput('');
    },
    [context]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 touch-manipulation items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-900/40 ring-2 ring-violet-400/30 transition hover:bg-violet-500 active:scale-95 sm:bottom-6 sm:right-6"
        aria-expanded={open}
        aria-controls="pipeline-coach-panel"
        id="pipeline-coach-fab"
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <MessageCircle className="h-6 w-6" aria-hidden />}
        <span className="sr-only">{open ? 'Close pipeline coach' : 'Open pipeline coach'}</span>
      </button>

      {open && (
        <div
          id="pipeline-coach-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pipeline-coach-title"
          className="fixed inset-x-3 bottom-20 z-40 flex max-h-[min(70vh,520px)] flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/95 shadow-2xl backdrop-blur-md sm:inset-x-auto sm:right-6 sm:bottom-24 sm:w-full sm:max-w-md"
        >
          <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h2 id="pipeline-coach-title" className="text-sm font-semibold text-slate-100">
                  Pipeline coach
                </h2>
                <p className="text-[11px] text-slate-500">Context-aware tips (client-side)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-violet-600 text-white'
                      : 'border border-slate-700/50 bg-slate-800/80 text-slate-200'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-700/50 px-3 pb-3 pt-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => send(p)}
                  className="rounded-full border border-slate-600/60 bg-slate-800/60 px-2.5 py-1 text-[11px] text-slate-300 hover:border-violet-500/40 hover:bg-slate-800"
                >
                  {p}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your pipeline..."
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-600/60 bg-slate-950/50 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                autoComplete="off"
              />
              <button
                type="submit"
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40"
                disabled={!input.trim()}
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PipelineCoachChat;
