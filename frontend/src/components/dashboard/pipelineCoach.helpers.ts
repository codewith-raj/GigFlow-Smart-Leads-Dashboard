import type { Lead, LeadStats, LeadFilters, PaginationMeta, UserRole } from '@/types';
import { LEAD_SOURCES, LEAD_STATUSES, SOURCE_LABELS, STATUS_LABELS } from '@/constants';

export interface CoachContext {
  stats: LeadStats | undefined;
  filters: Partial<LeadFilters>;
  search: string;
  pageMatchCount: number;
  totalMatching: number;
  userName?: string;
  userRole?: UserRole;
  leads?: Lead[];
  pagination?: PaginationMeta;
}

export interface CoachInsight {
  label: string;
  value: string;
  tone?: 'neutral' | 'good' | 'warn' | 'accent';
}

export interface CoachReply {
  text: string;
  insights?: CoachInsight[];
  tips?: string[];
}

function pct(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function firstName(name?: string): string {
  return name?.trim().split(/\s+/)[0] ?? 'there';
}

export function buildLiveInsights(ctx: CoachContext): CoachInsight[] {
  const total = ctx.stats?.total ?? 0;
  const qualified = ctx.stats?.byStatus?.qualified ?? 0;
  const newCount = ctx.stats?.byStatus?.new ?? 0;
  const contacted = ctx.stats?.byStatus?.contacted ?? 0;
  const lost = ctx.stats?.byStatus?.lost ?? 0;
  const conv = pct(qualified, total);

  const topSource = LEAD_SOURCES.map((s) => ({
    key: s,
    count: ctx.stats?.bySource?.[s] ?? 0,
  })).sort((a, b) => b.count - a.count)[0];

  const insights: CoachInsight[] = [
    { label: 'Total pipeline', value: String(total), tone: 'accent' },
    { label: 'Qualified', value: `${qualified} (${conv}%)`, tone: 'good' },
    { label: 'New', value: String(newCount), tone: newCount > 0 ? 'warn' : 'neutral' },
    { label: 'Contacted', value: String(contacted), tone: 'neutral' },
    { label: 'Lost', value: String(lost), tone: lost > 0 ? 'warn' : 'neutral' },
  ];

  if (topSource && topSource.count > 0) {
    insights.push({
      label: 'Top source',
      value: `${SOURCE_LABELS[topSource.key]} (${topSource.count})`,
      tone: 'neutral',
    });
  }

  if (ctx.totalMatching !== total) {
    insights.push({
      label: 'Filtered view',
      value: `${ctx.totalMatching} of ${total}`,
      tone: 'accent',
    });
  }

  return insights.slice(0, 6);
}

export function buildWelcomeReply(ctx: CoachContext): CoachReply {
  const name = firstName(ctx.userName);
  const total = ctx.stats?.total ?? 0;
  const newCount = ctx.stats?.byStatus?.new ?? 0;
  const qualified = ctx.stats?.byStatus?.qualified ?? 0;

  let opener =
    total === 0
      ? `Hi ${name} — your pipeline is empty. I can walk you through adding your first lead and setting up filters.`
      : `Hi ${name} — I'm synced with your live dashboard. You have **${total}** leads with **${qualified}** qualified.`;

  if (newCount > 0 && total > 0) {
    opener += ` I'd start with your **${newCount}** new lead${newCount > 1 ? 's' : ''} today.`;
  }

  const tips: string[] = [
    'Ask “What should I focus on?” for a prioritized action list.',
    'Ask “Pipeline breakdown” for status and source details.',
    'Ask “Who should I contact?” to see leads on this page.',
  ];

  if (ctx.userRole === 'admin') {
    tips.push('Admins can export CSV — ask “How do I export?”');
  }

  return {
    text: opener,
    insights: buildLiveInsights(ctx),
    tips,
  };
}

function statusBreakdown(ctx: CoachContext): string {
  const total = ctx.stats?.total ?? 0;
  if (total === 0) return 'No leads in the database yet.';

  return LEAD_STATUSES.map((s) => {
    const n = ctx.stats?.byStatus?.[s] ?? 0;
    return `• **${STATUS_LABELS[s]}**: ${n} (${pct(n, total)}%)`;
  }).join('\n');
}

function sourceBreakdown(ctx: CoachContext): string {
  const total = ctx.stats?.total ?? 0;
  if (total === 0) return '';

  const lines = LEAD_SOURCES.map((s) => {
    const n = ctx.stats?.bySource?.[s] ?? 0;
    return `• **${SOURCE_LABELS[s]}**: ${n} (${pct(n, total)}%)`;
  }).join('\n');
  return `\n**By source**\n${lines}`;
}

function filterSummary(ctx: CoachContext): string {
  const parts: string[] = [];
  if (ctx.filters.status) parts.push(`Status → ${STATUS_LABELS[ctx.filters.status]}`);
  if (ctx.filters.source) parts.push(`Source → ${SOURCE_LABELS[ctx.filters.source]}`);
  if (ctx.search.trim()) parts.push(`Search → “${ctx.search.trim()}”`);
  if (ctx.filters.sort) {
    parts.push(ctx.filters.sort === 'latest' ? 'Sort → newest first' : 'Sort → oldest first');
  }
  if (ctx.pagination) {
    parts.push(
      `Page ${ctx.pagination.currentPage} of ${ctx.pagination.totalPages} (${ctx.pageMatchCount} shown)`
    );
  }
  return parts.length ? parts.join(' · ') : 'No filters active — viewing full pipeline.';
}

export function replyForMessage(input: string, ctx: CoachContext): CoachReply {
  const q = input.toLowerCase().trim();
  const total = ctx.stats?.total ?? 0;
  const qualified = ctx.stats?.byStatus?.qualified ?? 0;
  const newCount = ctx.stats?.byStatus?.new ?? 0;
  const contacted = ctx.stats?.byStatus?.contacted ?? 0;
  const lost = ctx.stats?.byStatus?.lost ?? 0;
  const conv = pct(qualified, total);
  const name = firstName(ctx.userName);

  if (/focus|today|priorit|what should/i.test(q)) {
    const tips: string[] = [];
    if (newCount > 0) tips.push(`Contact all **${newCount}** new leads within 24–48 hours.`);
    if (contacted > 0) {
      tips.push(`Review **${contacted}** contacted leads — confirm next step or move to qualified/lost.`);
    }
    if (qualified > 0) tips.push(`Follow up on **${qualified}** qualified leads (budget, timeline, decision-maker).`);
    if (lost > 0 && total > 0) tips.push(`Document why **${lost}** leads were lost to improve future outreach.`);
    if (tips.length === 0) tips.push('Add leads or adjust filters to see actionable items.');

    return {
      text: `Here's a practical plan for today, ${name}:`,
      insights: buildLiveInsights(ctx),
      tips,
    };
  }

  if (/pipeline|breakdown|overview|how is|health/i.test(q)) {
    return {
      text: `**Pipeline health** — ${conv}% qualified rate across ${total} leads.\n\n**By status**\n${statusBreakdown(ctx)}${sourceBreakdown(ctx)}`,
      insights: buildLiveInsights(ctx),
      tips: ['Strong pipelines keep contacted leads moving weekly.', 'Compare sources to double down on what converts.'],
    };
  }

  if (/contact|who should|follow up|call/i.test(q)) {
    const slice = (ctx.leads ?? []).slice(0, 5);
    if (slice.length === 0) {
      return {
        text: 'No leads on the current page. Clear filters or go to page 1 to see contacts.',
        tips: ['Use search to find a lead by name or email.', 'Sort by “Latest first” to see newest opportunities.'],
      };
    }
    const lines = slice.map(
      (l) =>
        `• **${l.name}** — ${STATUS_LABELS[l.status]}, ${SOURCE_LABELS[l.source]} (${l.email})`
    );
    return {
      text: `**Suggested follow-ups** from your current table view:`,
      tips: lines,
      insights: [
        { label: 'On this page', value: String(ctx.pageMatchCount), tone: 'neutral' },
        { label: 'Total matching', value: String(ctx.totalMatching), tone: 'accent' },
      ],
    };
  }

  if (/qualified|qualif|convert/i.test(q)) {
    return {
      text: `You have **${qualified}** qualified leads (${conv}% of pipeline).`,
      insights: buildLiveInsights(ctx),
      tips: [
        'Confirm budget range and expected close date.',
        'Identify the decision-maker and champion.',
        'Schedule a concrete next step (demo, proposal, contract).',
        'Move stalled “contacted” leads to qualified or lost — avoid limbo.',
      ],
    };
  }

  if (/new lead|add lead|create/i.test(q)) {
    return {
      text: 'Use **Add lead** (top of dashboard) to capture name, email, status, and source.',
      tips: [
        'Start new prospects as **New**, then update after first touch.',
        'Pick the correct **source** for reporting (website, Instagram, referral).',
        'Sales users can create and edit; admins can also delete and export.',
      ],
    };
  }

  if (/filter|search|sort|chip/i.test(q)) {
    return {
      text: `**Active view:** ${filterSummary(ctx)}\n\nFilters stack together — status + source + search all apply at once. Pagination shows 10 leads per page.`,
      tips: [
        'Click filter chips to remove one constraint.',
        'Search is debounced (~500ms) for smoother typing.',
        'Use “Clear filters” to reset everything.',
      ],
    };
  }

  if (/export|csv|report/i.test(q)) {
    if (ctx.userRole !== 'admin') {
      return {
        text: 'CSV export is available to **admin** accounts only. Your sales role can still manage leads in the table.',
        tips: ['Ask an admin for periodic exports if you need offline reports.'],
      };
    }
    return {
      text: '**Export CSV** uses your current filters (status, source, search, sort) — great for weekly reporting.',
      tips: [
        'Apply filters first, then export to get a focused file.',
        'Export does not include pagination — all matching records export.',
      ],
    };
  }

  if (/lost|churn|drop/i.test(q)) {
    return {
      text: `**${lost}** lost leads (${pct(lost, total)}% of pipeline).`,
      tips: [
        'Tag common loss reasons (price, timing, competitor) in your notes.',
        'Re-engage only when circumstances change — avoid spamming.',
        'Compare lost rate by source to refine marketing spend.',
      ],
      insights: buildLiveInsights(ctx),
    };
  }

  if (/source|channel|instagram|website|referral/i.test(q)) {
    return {
      text: `**Lead sources** drive where to invest effort:${sourceBreakdown(ctx)}`,
      insights: buildLiveInsights(ctx),
      tips: ['If one source dominates, ensure follow-up SLA matches volume.'],
    };
  }

  if (/help|what can|commands/i.test(q)) {
    return {
      text: `I'm your **GigFlow pipeline helper** — I read your live stats, filters, and current table.`,
      tips: [
        '“What should I focus on today?”',
        '“Pipeline breakdown”',
        '“Who should I contact?”',
        '“Explain my filters”',
        '“Tips for qualified leads”',
        '“How do I export?” (admins)',
      ],
    };
  }

  return {
    text: `I can help with priorities, pipeline metrics, follow-ups, and filters. ${total > 0 ? `Right now you have **${total}** leads and **${qualified}** qualified.` : 'Add your first lead to get started.'}`,
    insights: buildLiveInsights(ctx),
    tips: ['Try a quick prompt below or ask in your own words.'],
  };
}
