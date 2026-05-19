import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { leadsApi } from '@/api/leads.api';
import { Lead } from '@/types';
import { LEAD_SOURCES, LEAD_STATUSES, SOURCE_LABELS, STATUS_LABELS } from '@/constants';

const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  status: z.enum(['new', 'contacted', 'qualified', 'lost']),
  source: z.enum(['website', 'instagram', 'referral']),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null; // if provided → edit mode
}

const statusOptions = LEAD_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }));
const sourceOptions = LEAD_SOURCES.map((s) => ({ value: s, label: SOURCE_LABELS[s] }));

const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose, lead }) => {
  const queryClient = useQueryClient();
  const isEditMode = !!lead;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'new',
      source: 'website',
    },
  });

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
      });
    } else {
      reset({ name: '', email: '', status: 'new', source: 'website' });
    }
  }, [lead, reset]);

  const createMutation = useMutation({
    mutationFn: leadsApi.createLead,
    onSuccess: () => {
      toast.success('Lead created successfully!');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      handleClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create lead');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeadFormValues> }) =>
      leadsApi.updateLead(id, data),
    onSuccess: () => {
      toast.success('Lead updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      handleClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update lead');
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: LeadFormValues) => {
    if (isEditMode && lead) {
      updateMutation.mutate({ id: lead._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Lead' : 'Create New Lead'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="lead-form">
        <Input
          label="Full Name"
          placeholder="e.g. Rahul Sharma"
          error={errors.name?.message}
          id="lead-name"
          {...register('name')}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. rahul@example.com"
          error={errors.email?.message}
          id="lead-email"
          {...register('email')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            options={statusOptions}
            error={errors.status?.message}
            id="lead-status"
            {...register('status')}
          />
          <Select
            label="Source"
            options={sourceOptions}
            error={errors.source?.message}
            id="lead-source"
            {...register('source')}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isPending}
            className="flex-1"
          >
            {isEditMode ? 'Update Lead' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LeadFormModal;
