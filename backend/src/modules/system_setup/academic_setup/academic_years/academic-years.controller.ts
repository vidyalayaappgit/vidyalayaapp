import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { Public } from '@core/decorators/public.decorator';
import { AcademicYearsService } from './academic-years.service';
import {
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
  ListAcademicYearDto,
} from './dto';

@Controller([
  'system_setup/academic_setup/academic_years',
  'academic/years',
  'system-setup/academic-setup/academic-years',
])
@UseGuards(JwtAuthGuard)
export class AcademicYearsController {
  private readonly logger = new Logger(AcademicYearsController.name);

  constructor(private readonly academicYearsService: AcademicYearsService) {}

  // ---------------- GET USER ID ----------------
  private getUserId(req: Request): number {
    const user = (req as any).user;
    const userId = user?.user_id ?? user?.id;

    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }

    return Number(userId);
  }

  // ---------------- HELPER: Get Academic Year Dates ----------------
  private async getAcademicYearDates(id: number): Promise<{ startDate: Date; endDate: Date }> {
    const result = await this.academicYearsService.view({ id, userId: 1 });
    if (!result || result.length === 0) {
      throw new HttpException('Academic year not found', HttpStatus.NOT_FOUND);
    }
    return {
      startDate: new Date(result[0].start_date!),
      endDate: new Date(result[0].end_date!),
    };
  }

  // ---------------- LIST ----------------
  @Get()
  async findAll(@Query() query: ListAcademicYearDto, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);

      const result = await this.academicYearsService.view({
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.id ? { id: query.id } : {}),
        ...(query.limit ? { limit: query.limit } : {}),
        ...(query.offset ? { offset: query.offset } : {}),
        userId,
      });

      return {
        success: true,
        items: result,
        total: result.length,
      };
    } catch (error) {
      this.logger.error('Error fetching academic years:', error);
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch academic years'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ---------------- GET ONE ----------------
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);
      const academicYearId = Number(id);

      if (Number.isNaN(academicYearId)) {
        throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
      }

      const result = await this.academicYearsService.view({
        id: academicYearId,
        userId,
      });

      if (!result.length) {
        throw new HttpException('Academic year not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: result[0],
      };
    } catch (error) {
      this.logger.error(`Error fetching academic year ${id}:`, error);
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch academic year'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ---------------- CREATE (Always DRAFT) with optional terms ----------------
  @Post()
  async create(@Body() dto: CreateAcademicYearDto, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);
      const startDate = new Date(dto.startDate);
      const endDate = new Date(dto.endDate);

      if (startDate >= endDate) {
        throw new HttpException(
          'Start date must be before end date',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validate terms if provided
      if (dto.terms && dto.terms.length > 0) {
        for (const term of dto.terms) {
          const termStart = new Date(term.start_date);
          const termEnd = new Date(term.end_date);
          
          if (termStart >= termEnd) {
            throw new HttpException(
              `Term "${term.term_name}" has invalid date range: end date must be after start date`,
              HttpStatus.BAD_REQUEST,
            );
          }
          
          if (termStart < startDate || termEnd > endDate) {
            throw new HttpException(
              `Term "${term.term_name}" dates must be within academic year range (${dto.startDate} to ${dto.endDate})`,
              HttpStatus.BAD_REQUEST,
            );
          }

          // Check for overlapping terms
          for (const otherTerm of dto.terms) {
            if (term !== otherTerm) {
              const otherStart = new Date(otherTerm.start_date);
              const otherEnd = new Date(otherTerm.end_date);
              if (termStart < otherEnd && termEnd > otherStart) {
                throw new HttpException(
                  `Terms "${term.term_name}" and "${otherTerm.term_name}" have overlapping date ranges`,
                  HttpStatus.BAD_REQUEST,
                );
              }
            }
          }
        }
      }

      // Build create data object
      const createData: {
        schoolId: number;
        yearName: string;
        yearCode: string;
        startDate: Date;
        endDate: Date;
        userId: number;
      } = {
        schoolId: dto.schoolId,
        yearName: dto.yearName,
        yearCode: dto.yearCode,
        startDate,
        endDate,
        userId,
      };

      // Only add terms if they exist
      if (dto.terms && dto.terms.length > 0) {
        (createData as any).terms = dto.terms;
      }

      const result = await this.academicYearsService.create(createData);

      return {
        success: true,
        data: result,
        message: result.message || 'Academic year created with DRAFT status',
      };
    } catch (error) {
      this.logger.error('Error creating academic year:', error);
      throw new HttpException(
        getErrorMessage(error, 'Failed to create academic year'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ---------------- UPDATE (Only DRAFT or CANCELLED) with optional terms ----------------
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAcademicYearDto,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const academicYearId = Number(id);

      if (Number.isNaN(academicYearId)) {
        throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
      }

      // Parse dates if provided
      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (dto.startDate) {
        startDate = new Date(dto.startDate);
      }
      if (dto.endDate) {
        endDate = new Date(dto.endDate);
      }

      // Validate date range if both provided
      if (startDate && endDate && startDate >= endDate) {
        throw new HttpException(
          'Start date must be before end date',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Get current academic year dates for term validation if dates are being updated
      let yearStartDate = startDate;
      let yearEndDate = endDate;
      
      if (!yearStartDate || !yearEndDate) {
        try {
          const currentYear = await this.getAcademicYearDates(academicYearId);
          yearStartDate = yearStartDate || currentYear.startDate;
          yearEndDate = yearEndDate || currentYear.endDate;
        } catch (error) {
          // If can't fetch, proceed without term validation
          this.logger.warn(`Could not fetch academic year dates for validation: ${error}`);
        }
      }

      // Validate terms if provided
      if (dto.terms && dto.terms.length > 0 && yearStartDate && yearEndDate) {
        for (const term of dto.terms) {
          const termStart = new Date(term.start_date);
          const termEnd = new Date(term.end_date);
          
          if (termStart >= termEnd) {
            throw new HttpException(
              `Term "${term.term_name}" has invalid date range: end date must be after start date`,
              HttpStatus.BAD_REQUEST,
            );
          }
          
          if (termStart < yearStartDate || termEnd > yearEndDate) {
            throw new HttpException(
              `Term "${term.term_name}" dates must be within academic year range`,
              HttpStatus.BAD_REQUEST,
            );
          }

          // Check for overlapping terms
          for (const otherTerm of dto.terms) {
            if (term !== otherTerm) {
              const otherStart = new Date(otherTerm.start_date);
              const otherEnd = new Date(otherTerm.end_date);
              if (termStart < otherEnd && termEnd > otherStart) {
                throw new HttpException(
                  `Terms "${term.term_name}" and "${otherTerm.term_name}" have overlapping date ranges`,
                  HttpStatus.BAD_REQUEST,
                );
              }
            }
          }
        }
      }

      // Build update object with only provided values
      const updateData: {
        id: number;
        schoolId: number;
        userId: number;
        yearName?: string;
        yearCode?: string;
        startDate?: Date;
        endDate?: Date;
        terms?: any[];
      } = {
        id: academicYearId,
        schoolId: dto.schoolId,
        userId,
      };

      if (dto.yearName !== undefined) {
        updateData.yearName = dto.yearName;
      }
      if (dto.yearCode !== undefined) {
        updateData.yearCode = dto.yearCode;
      }
      if (startDate) {
        updateData.startDate = startDate;
      }
      if (endDate) {
        updateData.endDate = endDate;
      }
      // Only add terms if they are provided (even empty array means clear all terms)
      if (dto.terms !== undefined) {
        updateData.terms = dto.terms;
      }

      const result = await this.academicYearsService.update(updateData);

      return {
        success: true,
        data: result,
        message: result.message || 'Updated successfully',
      };
    } catch (error) {
      this.logger.error(`Error updating academic year ${id}:`, error);
      throw new HttpException(
        getErrorMessage(error, 'Failed to update academic year'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ---------------- DELETE (Permanent, only DRAFT) ----------------
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('schoolId') schoolId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const academicYearId = Number(id);
      const schoolIdNum = Number(schoolId);

      if (Number.isNaN(academicYearId) || Number.isNaN(schoolIdNum)) {
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
      }

      const result = await this.academicYearsService.delete({
        id: academicYearId,
        schoolId: schoolIdNum,
        userId,
      });

      return {
        success: true,
        message: result.message || 'Deleted permanently',
      };
    } catch (error) {
      this.logger.error(`Error deleting academic year ${id}:`, error);
      throw new HttpException(
        getErrorMessage(error, 'Failed to delete academic year'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ---------------- ACTIVATE (DRAFT -> ACTIVE) ----------------
  @Post(':id/activate')
  async activate(
    @Param('id') id: string,
    @Query('schoolId') schoolId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const academicYearId = Number(id);
      const schoolIdNum = Number(schoolId);

      if (Number.isNaN(academicYearId) || Number.isNaN(schoolIdNum)) {
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
      }

      const result = await this.academicYearsService.activate({
        id: academicYearId,
        schoolId: schoolIdNum,
        userId,
      });

      return {
        success: true,
        data: result,
        message: result.message || 'Academic year activated successfully',
      };
    } catch (error) {
      this.logger.error(`Error activating academic year ${id}:`, error);
      throw new HttpException(
        getErrorMessage(error, 'Failed to activate academic year'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ---------------- COMPLETE (ACTIVE -> COMPLETED) ----------------
  @Post(':id/complete')
  async complete(
    @Param('id') id: string,
    @Query('schoolId') schoolId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const academicYearId = Number(id);
      const schoolIdNum = Number(schoolId);

      if (Number.isNaN(academicYearId) || Number.isNaN(schoolIdNum)) {
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
      }

      const result = await this.academicYearsService.complete({
        id: academicYearId,
        schoolId: schoolIdNum,
        userId,
      });

      return {
        success: true,
        data: result,
        message: result.message || 'Academic year completed successfully',
      };
    } catch (error) {
      this.logger.error(`Error completing academic year ${id}:`, error);
      throw new HttpException(
        getErrorMessage(error, 'Failed to complete academic year'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ---------------- CANCEL (DRAFT or ACTIVE -> CANCELLED) ----------------
  @Post(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Query('schoolId') schoolId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const academicYearId = Number(id);
      const schoolIdNum = Number(schoolId);

      if (Number.isNaN(academicYearId) || Number.isNaN(schoolIdNum)) {
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
      }

      const result = await this.academicYearsService.cancel({
        id: academicYearId,
        schoolId: schoolIdNum,
        userId,
      });

      return {
        success: true,
        data: result,
        message: result.message || 'Academic year cancelled successfully',
      };
    } catch (error) {
      this.logger.error(`Error cancelling academic year ${id}:`, error);
      throw new HttpException(
        getErrorMessage(error, 'Failed to cancel academic year'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ---------------- RBAC CONTROLS ----------------
  @Get('controls')
  async getControls(
    @Query('schoolId') schoolId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const schoolIdNum = Number(schoolId);

      if (Number.isNaN(schoolIdNum)) {
        throw new HttpException('Invalid schoolId', HttpStatus.BAD_REQUEST);
      }

      const controls = await this.academicYearsService.getControls({
        userId,
        schoolId: schoolIdNum,
      });

      return {
        success: true,
        controls,
      };
    } catch (error) {
      this.logger.error('Error fetching controls:', error);
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch controls'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ---------------- TEST ----------------
  @Get('test')
  @Public()
  test() {
    return {
      success: true,
      message: 'Academic Years API working',
    };
  }
}

// ---------------- HELPER ----------------
function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}