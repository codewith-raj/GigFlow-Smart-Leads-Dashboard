import mongoose from 'mongoose';
import { Lead } from '../models/Lead';
import { AppError } from '../middlewares/errorHandler';
import { ILead, PaginationMeta } from '../types';
import { CreateLeadInput, UpdateLeadInput, LeadQueryInput } from '../validations/lead.validation';

export interface PaginatedLeads {
  leads: ILead[];
  pagination: PaginationMeta;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MongoFilter = Record<string, any>;

export class LeadService {
  async getLeads(query: LeadQueryInput): Promise<PaginatedLeads> {
    const { page, limit, status, source, search, sort } = query;

    const filter: MongoFilter = {};

    if (status) filter['status'] = status;
    if (source) filter['source'] = source;

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter['$or'] = [{ name: searchRegex }, { email: searchRegex }];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const skip = (page - 1) * limit;

    const [leads, totalRecords] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email role')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      leads: leads as ILead[],
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getLeadById(id: string): Promise<ILead> {
    const lead = await Lead.findById(id).populate('createdBy', 'name email role');
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    return lead as ILead;
  }

  async createLead(input: CreateLeadInput, userId: string): Promise<ILead> {
    const lead = await Lead.create({ ...input, createdBy: new mongoose.Types.ObjectId(userId) });
    await lead.populate('createdBy', 'name email role');
    return lead as ILead;
  }

  async updateLead(id: string, input: UpdateLeadInput): Promise<ILead> {
    const lead = await Lead.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email role');

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    return lead as ILead;
  }

  async deleteLead(id: string): Promise<void> {
    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
  }

  async getLeadsForExport(query: Omit<LeadQueryInput, 'page' | 'limit'>): Promise<ILead[]> {
    const filter: MongoFilter = {};

    if (query.status) filter['status'] = query.status;
    if (query.source) filter['source'] = query.source;

    if (query.search?.trim()) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter['$or'] = [{ name: searchRegex }, { email: searchRegex }];
    }

    const leads = await Lead.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: query.sort === 'oldest' ? 1 : -1 })
      .lean();

    return leads as ILead[];
  }

  async getStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    bySource: Record<string, number>;
  }> {
    const [total, byStatus, bySource] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
    ]);

    return {
      total,
      byStatus: Object.fromEntries(
        (byStatus as Array<{ _id: string; count: number }>).map((s) => [s._id, s.count])
      ),
      bySource: Object.fromEntries(
        (bySource as Array<{ _id: string; count: number }>).map((s) => [s._id, s.count])
      ),
    };
  }
}

export const leadService = new LeadService();
