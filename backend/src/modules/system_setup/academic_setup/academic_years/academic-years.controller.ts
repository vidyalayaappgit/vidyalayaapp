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

  // ---------------- CREATE ----------------
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

      const result = await this.academicYearsService.create({
        schoolId: dto.schoolId,
        yearName: dto.yearName,
        yearCode: dto.yearCode,
        startDate,
        endDate,
        ...(dto.isCurrent !== undefined ? { isCurrent: dto.isCurrent } : {}),
        userId,
      });

      return {
        success: true,
        data: result,
        message: result.message || 'Created successfully',
      };
    } catch (error) {
      this.logger.error('Error creating academic year:', error);
      throw new HttpException(
        getErrorMessage(error, 'Failed to create academic year'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ---------------- UPDATE ----------------
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

      if (dto.startDate && dto.endDate) {
        const start = new Date(dto.startDate);
        const end = new Date(dto.endDate);

        if (start >= end) {
          throw new HttpException(
            'Start date must be before end date',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const result = await this.academicYearsService.update({
        id: academicYearId,
        schoolId: dto.schoolId,
        ...(dto.yearName !== undefined ? { yearName: dto.yearName } : {}),
        ...(dto.yearCode !== undefined ? { yearCode: dto.yearCode } : {}),
        ...(dto.startDate ? { startDate: new Date(dto.startDate) } : {}),
        ...(dto.endDate ? { endDate: new Date(dto.endDate) } : {}),
        ...(dto.isCurrent !== undefined ? { isCurrent: dto.isCurrent } : {}),
        userId,
      });

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

  // ---------------- DELETE ----------------
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
        message: result.message || 'Deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Error deleting academic year ${id}:`, error);
      throw new HttpException(
        getErrorMessage(error, 'Failed to delete academic year'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ---------------- AUTHORIZE ----------------
  @Post(':id/authorize')
  async authorize(
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

      const result = await this.academicYearsService.authorize({
        id: academicYearId,
        schoolId: schoolIdNum,
        userId,
      });

      return {
        success: true,
        data: result,
        message: result.message || 'Authorized successfully',
      };
    } catch (error) {
      this.logger.error(`Error authorizing academic year ${id}:`, error);
      throw new HttpException(
        getErrorMessage(error, 'Failed to authorize academic year'),
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
