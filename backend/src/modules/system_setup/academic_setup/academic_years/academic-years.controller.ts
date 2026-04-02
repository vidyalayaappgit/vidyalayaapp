// academic-years.controller.ts

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
import { AcademicYearsService } from './academic-years.service';
import {
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
  ListAcademicYearDto,
} from './dto';
import { JwtAuthGuard } from '@core/guards/jwt-auth.guard';
import { Public } from '@core/decorators/public.decorator'; // ✅ Import Public decorator

@Controller([
  'system_setup/academic_setup/academic_years',
  'academic/years',
  'system-setup/academic-setup/academic-years',
])
@UseGuards(JwtAuthGuard)
export class AcademicYearsController {
  private readonly logger = new Logger(AcademicYearsController.name);

  constructor(private readonly academicYearsService: AcademicYearsService) {}

  /**
   * Extract user ID from JWT token in request
   */
  private getUserId(req: Request): number {
    const user = (req as any).user;
    
    // ✅ Fix: Check both user.id and user.user_id (from your JWT strategy)
    const userId = user?.user_id || user?.id;
    
    if (!userId) {
      this.logger.warn('User not authenticated - no user ID found');
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }
    
    return userId;
  }

  /**
   * GET /api/system_setup/academic_setup/academic_years
   * Get all academic years with pagination and filters
   */
  @Get()
  async findAll(@Query() query: ListAcademicYearDto, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);

      const result = await this.academicYearsService.view({
        ...(query.schoolId !== undefined ? { schoolId: query.schoolId } : {}),
        ...(query.id !== undefined ? { id: query.id } : {}),
        ...(query.status !== undefined ? { statusFilter: query.status } : {}),
        ...(query.includeInactive !== undefined
          ? { includeInactive: query.includeInactive }
          : {}),
        ...(query.limit !== undefined ? { limit: query.limit } : {}),
        ...(query.offset !== undefined ? { offset: query.offset } : {}),
        userId,
      });

      return {
        success: true,
        items: result,
        total: result.length,
        ...(query.limit && { limit: query.limit }),
        ...(query.offset && { offset: query.offset }),
      };
    } catch (error) {
      this.logger.error('Error fetching academic years:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch academic years'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/system_setup/academic_setup/academic_years/test
   * Test endpoint to verify API is working (public)
   */
  @Get('test')
  @Public() // ✅ Make this endpoint public for testing
  test() {
    return {
      success: true,
      message: 'Academic Years API is working!',
      timestamp: new Date().toISOString(),
      endpoints: {
        list: '/api/system_setup/academic_setup/academic_years',
        detail: '/api/system_setup/academic_setup/academic_years/:id',
        create: '/api/system_setup/academic_setup/academic_years (POST)',
        update: '/api/system_setup/academic_setup/academic_years/:id (PUT)',
        delete: '/api/system_setup/academic_setup/academic_years/:id (DELETE)',
        authorize: '/api/system_setup/academic_setup/academic_years/:id/authorize (POST)',
        test: '/api/system_setup/academic_setup/academic_years/test',
      },
    };
  }

  /**
   * GET /api/system_setup/academic_setup/academic_years/:id
   * Get a single academic year by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);
      const academicYearId = parseInt(id, 10);

      if (isNaN(academicYearId)) {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }

      const result = await this.academicYearsService.view({
        id: academicYearId,
        userId,
      });

      if (!result || result.length === 0) {
        throw new HttpException('Academic year not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: result[0],
      };
    } catch (error) {
      this.logger.error(`Error fetching academic year ID ${id}:`, error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        getErrorMessage(error, 'Failed to fetch academic year'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/system_setup/academic_setup/academic_years
   * Create a new academic year
   */
  @Post()
  async create(@Body() createDto: CreateAcademicYearDto, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);

      // Validate date range
      const startDate = new Date(createDto.startDate);
      const endDate = new Date(createDto.endDate);
      
      if (startDate >= endDate) {
        throw new HttpException(
          'Start date must be before end date',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.academicYearsService.create({
        schoolId: createDto.schoolId,
        yearName: createDto.yearName,
        yearCode: createDto.yearCode,
        startDate,
        endDate,
        ...(createDto.isCurrent !== undefined ? { isCurrent: createDto.isCurrent } : {}),
        userId,
      });

      return {
        success: true,
        data: result,
        message: result.message || 'Academic year created successfully',
      };
    } catch (error) {
      this.logger.error('Error creating academic year:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        getErrorMessage(error, 'Failed to create academic year'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * PUT /api/system_setup/academic_setup/academic_years/:id
   * Update an existing academic year
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAcademicYearDto,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const academicYearId = parseInt(id, 10);

      if (isNaN(academicYearId)) {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }

      // Validate date range if both dates are provided
      if (updateDto.startDate && updateDto.endDate) {
        const startDate = new Date(updateDto.startDate);
        const endDate = new Date(updateDto.endDate);
        
        if (startDate >= endDate) {
          throw new HttpException(
            'Start date must be before end date',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const result = await this.academicYearsService.update({
        id: academicYearId,
        schoolId: updateDto.schoolId,
        ...(updateDto.yearName !== undefined ? { yearName: updateDto.yearName } : {}),
        ...(updateDto.yearCode !== undefined ? { yearCode: updateDto.yearCode } : {}),
        ...(updateDto.startDate !== undefined
          ? { startDate: new Date(updateDto.startDate) }
          : {}),
        ...(updateDto.endDate !== undefined
          ? { endDate: new Date(updateDto.endDate) }
          : {}),
        ...(updateDto.isCurrent !== undefined ? { isCurrent: updateDto.isCurrent } : {}),
        userId,
      });

      return {
        success: true,
        data: result,
        message: result.message || 'Academic year updated successfully',
      };
    } catch (error) {
      this.logger.error(`Error updating academic year ID ${id}:`, error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        getErrorMessage(error, 'Failed to update academic year'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * DELETE /api/system_setup/academic_setup/academic_years/:id
   * Delete an academic year
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @Query('schoolId') schoolId: string, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);
      const academicYearId = parseInt(id, 10);
      const schoolIdNum = parseInt(schoolId, 10);

      if (isNaN(academicYearId)) {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }

      if (isNaN(schoolIdNum)) {
        throw new HttpException('Invalid school ID format', HttpStatus.BAD_REQUEST);
      }

      const result = await this.academicYearsService.delete({
        id: academicYearId,
        schoolId: schoolIdNum,
        userId,
      });

      return {
        success: true,
        message: result.message || 'Academic year deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Error deleting academic year ID ${id}:`, error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        getErrorMessage(error, 'Failed to delete academic year'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/system_setup/academic_setup/academic_years/:id/authorize
   * Authorize (activate) an academic year
   */
  @Post(':id/authorize')
  async authorize(@Param('id') id: string, @Query('schoolId') schoolId: string, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);
      const academicYearId = parseInt(id, 10);
      const schoolIdNum = parseInt(schoolId, 10);

      if (isNaN(academicYearId)) {
        throw new HttpException('Invalid ID format', HttpStatus.BAD_REQUEST);
      }

      if (isNaN(schoolIdNum)) {
        throw new HttpException('Invalid school ID format', HttpStatus.BAD_REQUEST);
      }

      const result = await this.academicYearsService.authorize({
        id: academicYearId,
        schoolId: schoolIdNum,
        userId,
      });

      return {
        success: true,
        data: result,
        message: result.message || 'Academic year authorized successfully',
      };
    } catch (error) {
      this.logger.error(`Error authorizing academic year ID ${id}:`, error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        getErrorMessage(error, 'Failed to authorize academic year'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

/**
 * Helper function to extract error message
 */
function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}
