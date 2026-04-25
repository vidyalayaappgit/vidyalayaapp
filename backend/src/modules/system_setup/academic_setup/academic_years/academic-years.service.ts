import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AcademicYearService } from './academic-year.service';
import { AcademicYearRecord, AcademicYearListResult } from './academic-year.types';

@Injectable()
export class AcademicYearsService {
  private readonly logger = new Logger(AcademicYearsService.name);

  constructor(private readonly coreService: AcademicYearService) {}

  /**
   * Validate response from database operation
   */
  private validateResponse(record: AcademicYearRecord | null, operation: string): void {
    if (!record) {
      throw new HttpException(
        `${operation} operation returned no data`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Check if the database returned an error message
    if (record.message && !record.message.toLowerCase().includes('success')) {
      this.logger.warn(`${operation} operation failed: ${record.message}`);
      throw new HttpException(record.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Create a new academic year (always DRAFT) with optional terms
   */
  async create(data: {
    schoolId: number;
    yearName: string;
    yearCode: string;
    startDate: Date;
    endDate: Date;
    userId: number;
    terms?: any[];
  }): Promise<AcademicYearRecord> {
    this.logger.log(`Creating academic year: ${data.yearName} for school ${data.schoolId}`);
    
    const result = await this.coreService.create(data);
    this.validateResponse(result, 'Create');
    
    return result!;
  }

  /**
   * Update an existing academic year (only DRAFT or CANCELLED) with optional terms
   */
  async update(data: {
    id: number;
    schoolId: number;
    yearName?: string;
    yearCode?: string;
    startDate?: Date;
    endDate?: Date;
    userId: number;
    terms?: any[];
  }): Promise<AcademicYearRecord> {
    this.logger.log(`Updating academic year ID: ${data.id}`);
    
    const result = await this.coreService.update(data);
    this.validateResponse(result, 'Update');
    
    return result!;
  }

  /**
   * Delete an academic year permanently (only DRAFT)
   */
  async delete(data: {
    id: number;
    schoolId: number;
    userId: number;
  }): Promise<AcademicYearRecord> {
    this.logger.log(`Deleting academic year ID: ${data.id}`);
    
    const result = await this.coreService.delete(data);
    this.validateResponse(result, 'Delete');
    
    return result!;
  }

  /**
   * Activate academic year (DRAFT -> ACTIVE)
   */
  async activate(data: {
    id: number;
    schoolId: number;
    userId: number;
  }): Promise<AcademicYearRecord> {
    this.logger.log(`Activating academic year ID: ${data.id}`);
    
    const result = await this.coreService.activate(data);
    this.validateResponse(result, 'Activate');
    
    return result!;
  }

  /**
   * Complete academic year (ACTIVE -> COMPLETED)
   */
  async complete(data: {
    id: number;
    schoolId: number;
    userId: number;
  }): Promise<AcademicYearRecord> {
    this.logger.log(`Completing academic year ID: ${data.id}`);
    
    const result = await this.coreService.complete(data);
    this.validateResponse(result, 'Complete');
    
    return result!;
  }

  /**
   * Cancel academic year (DRAFT or ACTIVE -> CANCELLED)
   */
  async cancel(data: {
    id: number;
    schoolId: number;
    userId: number;
  }): Promise<AcademicYearRecord> {
    this.logger.log(`Cancelling academic year ID: ${data.id}`);
    
    const result = await this.coreService.cancel(data);
    this.validateResponse(result, 'Cancel');
    
    return result!;
  }

  /**
   * View academic years with optional filtering
   */
  async view(data: {
    schoolId?: number;
    id?: number;
    limit?: number;
    offset?: number;
    userId: number;
  }): Promise<AcademicYearListResult> {
    this.logger.debug(`Viewing academic years with filters: ${JSON.stringify(data)}`);
    
    const result = await this.coreService.view(data);
    return result;
  }

  /**
   * Retrieve RBAC/form controls for the Academic Years page.
   */
  async getControls(data: { userId: number; schoolId: number }): Promise<string[]> {
    this.logger.debug(
      `Fetching academic year controls for user:${data.userId}, school:${data.schoolId}`,
    );

    return this.coreService.getControls(data);
  }
}