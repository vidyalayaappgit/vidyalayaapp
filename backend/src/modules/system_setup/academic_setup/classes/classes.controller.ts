// D:\schoolapp\backend\src\modules\system_setup\academic_setup\classes\classes.controller.ts
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
import { ClassService } from './classes.service';
import {
  CreateClassDto,
  UpdateClassDto,
  ListClassDto,
} from './dto/classes.dto';
@Controller(['system_setup/academic_setup/classes', 'academic/classes'])
@UseGuards(JwtAuthGuard)
export class ClassController {
  private readonly logger = new Logger(ClassController.name);

  constructor(private readonly classService: ClassService) {}

  private getUserId(req: Request): number {
    const user = (req as any).user;
    const userId = user?.user_id ?? user?.id;

    if (!userId) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }

    return Number(userId);
  }

  private handleError(context: string, error: unknown, fallbackMessage: string): never {
    if (error instanceof HttpException) {
      this.logger.error(`${context}:`, error.getResponse());
      throw error;
    }

    const err = error as Error;
    this.logger.error(`${context}:`, err);
    throw new HttpException(
      err?.message || fallbackMessage,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get()
  async findAll(@Query() query: ListClassDto, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);

      const result = await this.classService.view({
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.id ? { id: query.id } : {}),
        ...(query.status ? { status: query.status } : {}),
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
      this.handleError('Error fetching classes', error, 'Failed to fetch classes');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);
      const classId = Number(id);

      if (Number.isNaN(classId)) {
        throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
      }

      const result = await this.classService.view({
        id: classId,
        userId,
      });

      if (!result.length) {
        throw new HttpException('Class not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: result[0],
      };
    } catch (error) {
      this.handleError(`Error fetching class ${id}`, error, 'Failed to fetch class');
    }
  }

  @Post()
  async create(@Body() dto: CreateClassDto, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);

      const result = await this.classService.create({
        schoolId: dto.schoolId,
        classData: {
          class_code: dto.classCode,
          class_name: dto.className,
          class_number: dto.classNumber,
          academic_level_id: dto.academicLevelId,
          ...(dto.classRomanNumeral !== undefined
            ? { class_roman_numeral: dto.classRomanNumeral }
            : {}),
          ...(dto.displayOrder !== undefined ? { display_order: dto.displayOrder } : {}),
          ...(dto.minAgeRequired !== undefined ? { min_age_required: dto.minAgeRequired } : {}),
          ...(dto.maxAgeRequired !== undefined ? { max_age_required: dto.maxAgeRequired } : {}),
          ...(dto.description !== undefined ? { description: dto.description } : {}),
        },
        ...(dto.sections
          ? {
              sections: dto.sections.map(s => ({
                section_code: s.sectionCode,
                section_name: s.sectionName,
                ...(s.roomId !== undefined ? { room_id: s.roomId } : {}),
                ...(s.capacity !== undefined ? { capacity: s.capacity } : {}),
                ...(s.startTime !== undefined ? { start_time: s.startTime } : {}),
                ...(s.endTime !== undefined ? { end_time: s.endTime } : {}),
                ...(s.displayOrder !== undefined ? { display_order: s.displayOrder } : {}),
                ...(s.description !== undefined ? { description: s.description } : {}),
              })),
            }
          : {}),
        userId,
      });

      return {
        success: true,
        data: result,
        message: result?.out_message || 'Class created successfully',
      };
    } catch (error) {
      this.handleError('Error creating class', error, 'Failed to create class');
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClassDto,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const classId = Number(id);

      if (Number.isNaN(classId)) {
        throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
      }

      const result = await this.classService.update({
        id: classId,
        schoolId: dto.schoolId,
        classData: {
          ...(dto.className !== undefined ? { class_name: dto.className } : {}),
          ...(dto.classRomanNumeral !== undefined
            ? { class_roman_numeral: dto.classRomanNumeral }
            : {}),
          ...(dto.displayOrder !== undefined ? { display_order: dto.displayOrder } : {}),
          ...(dto.minAgeRequired !== undefined ? { min_age_required: dto.minAgeRequired } : {}),
          ...(dto.maxAgeRequired !== undefined ? { max_age_required: dto.maxAgeRequired } : {}),
          ...(dto.description !== undefined ? { description: dto.description } : {}),
        },
      ...(dto.sections
        ? {
            sections: dto.sections.map(s => ({
              ...(s.id !== undefined ? { id: s.id } : {}),
              section_code: s.sectionCode,
              section_name: s.sectionName,
              ...(s.roomId !== undefined ? { room_id: s.roomId } : {}),
              ...(s.capacity !== undefined ? { capacity: s.capacity } : {}),
              ...(s.startTime !== undefined ? { start_time: s.startTime } : {}),
              ...(s.endTime !== undefined ? { end_time: s.endTime } : {}),
              ...(s.displayOrder !== undefined ? { display_order: s.displayOrder } : {}),
              ...(s.description !== undefined ? { description: s.description } : {}),
            })),
          }
        : {}),
        ...(dto.sectionsToDelete ? { sectionsToDelete: dto.sectionsToDelete } : {}),
        userId,
      });

      return {
        success: true,
        data: result,
        message: result?.out_message || 'Class updated successfully',
      };
    } catch (error) {
      this.handleError(`Error updating class ${id}`, error, 'Failed to update class');
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('schoolId') schoolId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const classId = Number(id);
      const schoolIdNum = Number(schoolId);

      if (Number.isNaN(classId) || Number.isNaN(schoolIdNum)) {
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
      }

      const result = await this.classService.delete({
        id: classId,
        schoolId: schoolIdNum,
        userId,
      });

      return {
        success: true,
        message: result?.out_message || 'Class deleted successfully',
      };
    } catch (error) {
      this.handleError(`Error deleting class ${id}`, error, 'Failed to delete class');
    }
  }

  @Post(':id/activate')
  async activate(
    @Param('id') id: string,
    @Query('schoolId') schoolId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const classId = Number(id);
      const schoolIdNum = Number(schoolId);

      if (Number.isNaN(classId) || Number.isNaN(schoolIdNum)) {
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
      }

      const result = await this.classService.activate({
        id: classId,
        schoolId: schoolIdNum,
        userId,
      });

      return {
        success: true,
        data: result,
        message: result?.out_message || 'Class activated successfully',
      };
    } catch (error) {
      this.handleError(`Error activating class ${id}`, error, 'Failed to activate class');
    }
  }

  @Post(':id/deactivate')
  async deactivate(
    @Param('id') id: string,
    @Query('schoolId') schoolId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const classId = Number(id);
      const schoolIdNum = Number(schoolId);

      if (Number.isNaN(classId) || Number.isNaN(schoolIdNum)) {
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
      }

      const result = await this.classService.deactivate({
        id: classId,
        schoolId: schoolIdNum,
        userId,
      });

      return {
        success: true,
        data: result,
        message: result?.out_message || 'Class deactivated successfully',
      };
    } catch (error) {
      this.handleError(`Error deactivating class ${id}`, error, 'Failed to deactivate class');
    }
  }

  @Post(':id/authorize')
  async authorize(
    @Param('id') id: string,
    @Query('schoolId') schoolId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const classId = Number(id);
      const schoolIdNum = Number(schoolId);

      if (Number.isNaN(classId) || Number.isNaN(schoolIdNum)) {
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
      }

      const result = await this.classService.authorize({
        id: classId,
        schoolId: schoolIdNum,
        userId,
      });

      return {
        success: true,
        data: result,
        message: result?.out_message || 'Class authorized successfully',
      };
    } catch (error) {
      this.handleError(`Error authorizing class ${id}`, error, 'Failed to authorize class');
    }
  }

  @Get('controls')
  async getControls(@Query('schoolId') schoolId: string, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);
      const schoolIdNum = Number(schoolId);

      if (Number.isNaN(schoolIdNum)) {
        throw new HttpException('Invalid schoolId', HttpStatus.BAD_REQUEST);
      }

      const controls = await this.classService.getControls({
        userId,
        schoolId: schoolIdNum,
      });

      return {
        success: true,
        controls,
      };
    } catch (error) {
      this.handleError('Error fetching controls', error, 'Failed to fetch controls');
    }
  }
}
