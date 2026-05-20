import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Loader2,
  Zap,
  BarChart3,
  Users,
  Filter,
  Target,
} from 'lucide-react';
import {
  type CoachContext,
  type CoachInsight,
  type CoachReply,
  buildWelcomeReply,
  replyForMessage,
} from './pipelineCoach.helpers';

export type { CoachContext } from './pipelineCoach.helpers';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  reply?: CoachReply;
  text?: string;
}

const quickPrompts = [
  { label: 'Focus today', icon: Target, prompt: 'What should I focus on today?' },
  { label: 'Pipeline', icon: BarChart3, prompt: 'Pipeline breakdown' },
  { label: 'Contacts', icon: Users, prompt: 'Who should I contact?' },
  { label: 'Filters', icon: Filter, prompt: 'Explain my filters' },
  { label: 'Qualified tips', icon: Zap, prompt: 'Tips for qualified leads' },
];

function renderBoldText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-slate-50">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function InsightGrid({ insights }: { insights: CoachInsight[] }) {
  if (!insights.length) return null;
  const toneClass: Record<string, string> = {
    neutral: 'border-slate-700/50 bg-slate-800/50 text-slate-300',
    good: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
    warn: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
    accent: 'border-red-500/25 bg-red-500/10 text-red-300',
  };
  return (
    <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
      {insights.map((item) => (
        <div
          key={item.label}
          className={`rounded-lg border px-2 py-1.5 ${toneClass[item.tone ?? 'neutral']}`}
        >
          <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
          <p className="mt-0.5 text-xs font-semibold tabular-nums">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function AssistantBubble({ reply }: { reply: CoachReply }) {
  const paragraphs = reply.text.split('\n\n');
  return (
    <div className="max-w-[92%] rounded-2xl rounded-tl-md border border-slate-700/50 bg-slate-800/90 px-3.5 py-2.5 text-sm leading-relaxed text-slate-200 shadow-sm sm:max-w-[88%]">
      {paragraphs.map((para, idx) => (
        <p key={idx} className={idx > 0 ? 'mt-2' : ''}>
          {renderBoldText(para)}
        </p>
      ))}
      {reply.insights && <InsightGrid insights={reply.insights} />}
      {reply.tips && reply.tips.length > 0 && (
        <ul className="mt-2.5 space-y-1.5 border-t border-slate-700/40 pt-2.5">
          {reply.tips.map((tip, i) => (
            <li key={i} className="flex gap-2 text-xs leading-relaxed text-slate-400">
              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-red-500/80" aria-hidden />
              <span>{renderBoldText(tip)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const PipelineCoachChat: React.FC<{ context: CoachContext }> = ({ context }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const welcomedRef = useRef(false);

  const initialWelcome = useMemo(() => buildWelcomeReply(context), [context]);

  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', role: 'assistant', reply: initialWelcome },
  ]);

  useEffect(() => {
    if (!context.stats || welcomedRef.current) return;
    welcomedRef.current = true;
    setMessages([{ id: 'welcome', role: 'assistant', reply: buildWelcomeReply(context) }]);
  }, [context.stats, context.totalMatching, context.filters, context.search]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }, [messages, open, typing]);

  const pushAssistant = useCallback((reply: CoachReply) => {
    setMessages((prev) => [
      ...prev,
      { id: `a-${Date.now()}`, role: 'assistant', reply },
    ]);
    setTyping(false);
  }, []);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || typing) return;

      const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setTyping(true);

      const reply = replyForMessage(trimmed, context);
      window.setTimeout(() => pushAssistant(reply), 450 + Math.min(trimmed.length * 8, 400));
    },
    [context, typing, pushAssistant]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 flex touch-manipulation items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-4 py-3 text-white shadow-lg shadow-red-900/35 ring-2 ring-red-400/25 transition hover:from-red-500 hover:to-red-400 active:scale-[0.98] sm:bottom-6 sm:right-6 sm:px-5"
        aria-expanded={open}
        aria-controls="pipeline-coach-panel"
        id="pipeline-coach-fab"
      >
        {open ? (
          <X className="h-5 w-5 shrink-0" aria-hidden />
        ) : (
          <>
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
            <span className="hidden text-sm font-semibold sm:inline">Assistant</span>
          </>
        )}
        <span className="sr-only">{open ? 'Close assistant' : 'Open pipeline assistant'}</span>
      </button>

      {open && (
        <div
          id="pipeline-coach-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pipeline-coach-title"
          className="fixed inset-x-2 bottom-[4.5rem] z-40 flex max-h-[min(78vh,560px)] flex-col overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-950/98 shadow-2xl shadow-black/40 backdrop-blur-xl sm:inset-x-auto sm:right-5 sm:bottom-24 sm:w-[min(100vw-2rem,24rem)] md:max-w-md lg:max-w-[26rem]"
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/50 px-3 py-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 text-red-400 ring-1 ring-red-500/20">
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 id="pipeline-coach-title" className="truncate text-sm font-semibold text-slate-100">
                  GigFlow Assistant
                </h2>
                <p className="flex items-center gap-1.5 text-[10px] text-slate-500 sm:text-[11px]">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                  Live pipeline data
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-y-contain px-3 py-3 sm:px-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {m.role === 'assistant' && (
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-400"
                    aria-hidden
                  >
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                {m.role === 'user' ? (
                  <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-red-600 px-3.5 py-2 text-sm text-white shadow-sm">
                    {m.text}
                  </div>
                ) : m.reply ? (
                  <AssistantBubble reply={m.reply} />
                ) : null}
              </div>
            ))}
            {typing && (
              <div className="flex gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-400">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-700/50 bg-slate-800/80 px-3 py-2.5 text-slate-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-red-400" />
                  <span className="text-xs">Analyzing your pipeline…</span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-800/80 bg-slate-900/40 px-2.5 pb-2.5 pt-2 sm:px-3 sm:pb-3">
            <div className="mb-2 flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {quickPrompts.map(({ label, icon: Icon, prompt }) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => send(prompt)}
                  disabled={typing}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-700/60 bg-slate-800/80 px-2.5 py-1.5 text-[10px] font-medium text-slate-300 transition hover:border-red-500/30 hover:bg-slate-800 hover:text-slate-100 disabled:opacity-50 sm:text-[11px]"
                >
                  <Icon className="h-3 w-3 text-red-400/90" />
                  {label}
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
                placeholder="Ask about leads, filters, priorities…"
                disabled={typing}
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-slate-700/60 bg-slate-950/80 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-red-500/40 focus:outline-none focus:ring-1 focus:ring-red-500/25 disabled:opacity-60"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-500 disabled:opacity-40"
                aria-label="Send message"
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
