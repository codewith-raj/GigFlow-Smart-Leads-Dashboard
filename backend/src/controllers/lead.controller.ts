import { Response, NextFunction } from 'express';
import { leadService } from '../services/lead.service';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { CreateLeadInput, UpdateLeadInput, LeadQueryInput } from '../validations/lead.validation';

export class LeadController {
  async getLeads(
    req: AuthenticatedRequest & { query: LeadQueryInput },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { leads, pagination } = await leadService.getLeads(req.query);
      sendSuccess(res, leads, 'Leads fetched successfully', 200, pagination);
    } catch (error) {
      next(error);
    }
  }

  async getLeadById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params['id'] as string;
      const lead = await leadService.getLeadById(id);
      sendSuccess(res, lead, 'Lead fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async createLead(
    req: AuthenticatedRequest & { body: CreateLeadInput },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const lead = await leadService.createLead(req.body, req.user!.userId);
      sendSuccess(res, lead, 'Lead created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateLead(
    req: AuthenticatedRequest & { body: UpdateLeadInput },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params['id'] as string;
      const lead = await leadService.updateLead(id, req.body);
      sendSuccess(res, lead, 'Lead updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteLead(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params['id'] as string;
      await leadService.deleteLead(id);
      sendSuccess(res, null, 'Lead deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async exportCsv(
    req: AuthenticatedRequest & { query: Omit<LeadQueryInput, 'page' | 'limit'> },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const leads = await leadService.getLeadsForExport(req.query);

      const csvHeaders = ['Name', 'Email', 'Status', 'Source', 'Created At'];
      const csvRows = leads.map((lead) => [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.status}"`,
        `"${lead.source}"`,
        `"${new Date(lead.createdAt).toISOString()}"`,
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map((row) => row.join(',')),
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="leads-${Date.now()}.csv"`);
      res.status(200).send(csvContent);
    } catch (error) {
      next(error);
    }
  }

  async getStats(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const stats = await leadService.getStats();
      sendSuccess(res, stats, 'Stats fetched successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const leadController = new LeadController();
