import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Mail, User2, Calendar, Tag, Radio } from 'lucide-react';
import { leadsApi } from '@/api/leads.api';
import Loader from '@/components/ui/Loader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { STATUS_COLORS, STATUS_LABELS, SOURCE_COLORS, SOURCE_LABELS } from '@/constants';
import { Lead } from '@/types';

const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 py-4 border-b border-slate-700/30 last:border-0">
    <div className="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-slate-400 flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">{label}</p>
      <div className="text-sm text-slate-200">{value}</div>
    </div>
  </div>
);

const LeadDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.getLeadById(id!),
    enabled: !!id,
  });

  if (isLoading) return <Loader text="Loading lead details..." />;

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-semibold text-slate-300">Lead not found</p>
        <p className="text-sm text-slate-500 mb-6">This lead may have been deleted.</p>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>
      </div>
    );
  }

  const lead: Lead = data.data;
  const creator = typeof lead.createdBy === 'object' ? lead.createdBy : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </Button>

      {/* Lead Card */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border-b border-slate-700/40 p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
              {lead.name[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">{lead.name}</h1>
              <p className="text-slate-400 text-sm">{lead.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  label={STATUS_LABELS[lead.status]}
                  colorClass={STATUS_COLORS[lead.status]}
                />
                <Badge
                  label={SOURCE_LABELS[lead.source]}
                  colorClass={SOURCE_COLORS[lead.source]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6">
          <DetailRow
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            value={
              <a href={`mailto:${lead.email}`} className="text-violet-400 hover:underline">
                {lead.email}
              </a>
            }
          />
          <DetailRow
            icon={<Tag className="w-4 h-4" />}
            label="Status"
            value={<Badge label={STATUS_LABELS[lead.status]} colorClass={STATUS_COLORS[lead.status]} />}
          />
          <DetailRow
            icon={<Radio className="w-4 h-4" />}
            label="Source"
            value={<Badge label={SOURCE_LABELS[lead.source]} colorClass={SOURCE_COLORS[lead.source]} />}
          />
          <DetailRow
            icon={<User2 className="w-4 h-4" />}
            label="Created By"
            value={creator ? `${creator.name} (${creator.role})` : 'Unknown'}
          />
          <DetailRow
            icon={<Calendar className="w-4 h-4" />}
            label="Created At"
            value={new Date(lead.createdAt).toLocaleString('en-IN', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          />
          <DetailRow
            icon={<Calendar className="w-4 h-4" />}
            label="Last Updated"
            value={new Date(lead.updatedAt).toLocaleString('en-IN', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsPage;
