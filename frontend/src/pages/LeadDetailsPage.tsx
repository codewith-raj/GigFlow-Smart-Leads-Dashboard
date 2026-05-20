import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, User2, Calendar, Tag, Radio, Edit2, Trash2 } from 'lucide-react';
import { leadsApi } from '@/api/leads.api';
import { useAuthStore } from '@/store/authStore';
import Loader from '@/components/ui/Loader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import QueryErrorState from '@/components/ui/QueryErrorState';
import LeadFormModal from '@/components/forms/LeadFormModal';
import ConfirmDeleteModal from '@/components/forms/ConfirmDeleteModal';
import { STATUS_COLORS, STATUS_LABELS, SOURCE_COLORS, SOURCE_LABELS } from '@/constants';
import { Lead } from '@/types';

const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 border-b border-slate-700/30 py-4 last:border-0">
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-700/40 bg-slate-800/60 text-slate-400">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <div className="text-sm text-slate-200">{value}</div>
    </div>
  </div>
);

const LeadDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: (leadId: string) => leadsApi.deleteLead(leadId),
    onSuccess: () => {
      toast.success('Lead deleted');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      navigate('/dashboard');
    },
    onError: () => toast.error('Failed to delete lead'),
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.getLeadById(id!),
    enabled: !!id,
  });

  if (isLoading) return <Loader text="Loading lead details..." />;

  if (isError || !data?.data) {
    return (
      <div className="mx-auto max-w-lg">
        <QueryErrorState
          title="Lead not found"
          message="This lead may have been deleted or the link is invalid."
          onRetry={() => refetch()}
        />
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  const lead: Lead = data.data;
  const creator = typeof lead.createdBy === 'object' ? lead.createdBy : null;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-0 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate('/dashboard')}
        >
          Back to pipeline
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="min-h-11 flex-1 touch-manipulation sm:flex-none"
            leftIcon={<Edit2 className="h-4 w-4" />}
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
          {isAdmin && (
            <Button
              variant="danger"
              size="sm"
              className="min-h-11 flex-1 touch-manipulation sm:flex-none"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={() => setDeleting(true)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="panel-elevated overflow-hidden rounded-2xl border border-slate-700/40">
        <div className="border-b border-slate-700/40 bg-gradient-to-r from-red-600/15 via-slate-900/40 to-slate-900/20 p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-xl font-bold text-white shadow-lg shadow-red-900/25 sm:h-16 sm:w-16 sm:text-2xl">
              {lead.name[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">{lead.name}</h1>
              <p className="mt-1 truncate text-sm text-slate-400 sm:text-base">{lead.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge label={STATUS_LABELS[lead.status]} colorClass={STATUS_COLORS[lead.status]} />
                <Badge label={SOURCE_LABELS[lead.source]} colorClass={SOURCE_COLORS[lead.source]} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <DetailRow
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={
              <a href={`mailto:${lead.email}`} className="text-red-400 hover:underline">
                {lead.email}
              </a>
            }
          />
          <DetailRow
            icon={<Tag className="h-4 w-4" />}
            label="Status"
            value={<Badge label={STATUS_LABELS[lead.status]} colorClass={STATUS_COLORS[lead.status]} />}
          />
          <DetailRow
            icon={<Radio className="h-4 w-4" />}
            label="Source"
            value={<Badge label={SOURCE_LABELS[lead.source]} colorClass={SOURCE_COLORS[lead.source]} />}
          />
          <DetailRow
            icon={<User2 className="h-4 w-4" />}
            label="Created by"
            value={creator ? `${creator.name} (${creator.role})` : 'Unknown'}
          />
          <DetailRow
            icon={<Calendar className="h-4 w-4" />}
            label="Created at"
            value={new Date(lead.createdAt).toLocaleString('en-IN', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          />
          <DetailRow
            icon={<Calendar className="h-4 w-4" />}
            label="Last updated"
            value={new Date(lead.updatedAt).toLocaleString('en-IN', {
              dateStyle: 'long',
              timeStyle: 'short',
            })}
          />
        </div>
      </div>

      <LeadFormModal isOpen={editing} onClose={() => setEditing(false)} lead={lead} />

      <ConfirmDeleteModal
        isOpen={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={() => deleteMutation.mutate(lead._id)}
        isLoading={deleteMutation.isPending}
        leadName={lead.name}
      />
    </div>
  );
};

export default LeadDetailsPage;
