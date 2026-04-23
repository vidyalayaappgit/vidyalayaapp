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
import { SubjectService } from './subjects.service';
import {
  CreateSubjectDto,
  UpdateSubjectDto,
  ListSubjectDto,
  GetStatusOptionsDto,
} from './dto/subjects.dto';
import { StatusMaster } from './subjects.types';

interface RequestUser {
  user_id?: number | string;
  id?: number | string;
}

type AuthenticatedRequest = Request & { user?: RequestUser };

@Controller(['system_setup/academic_setup/subjects', 'academic/subjects'])
@UseGuards(JwtAuthGuard)
export class SubjectController {
  private readonly logger = new Logger(SubjectController.name);

  constructor(private readonly subjectService: SubjectService) {}

  private getUserId(req: Request): number {
    const user = (req as AuthenticatedRequest).user;
    const userId = user?.user_id ?? user?.id;

    if (!userId) {
      throw new HttpException(
        'User not authenticated',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return Number(userId);
  }

  private handleError(
    context: string,
    error: unknown,
    fallbackMessage: string,
  ): never {
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

  // =====================================================
  // GET /subjects - List all subjects
  // =====================================================
  @Get()
  async findAll(@Query() query: ListSubjectDto, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);

      const result = await this.subjectService.view({
        ...(query.schoolId !== undefined ? { schoolId: query.schoolId } : {}),
        ...(query.id !== undefined ? { id: query.id } : {}),
        ...(query.status !== undefined ? { status: query.status } : {}),
        ...(query.subjectType !== undefined
          ? { subjectType: query.subjectType }
          : {}),
        ...(query.subjectCategoryId !== undefined
          ? { subjectCategoryId: query.subjectCategoryId }
          : {}),
        ...(query.classId !== undefined ? { classId: query.classId } : {}),
        ...(query.limit !== undefined ? { limit: query.limit } : {}),
        ...(query.offset !== undefined ? { offset: query.offset } : {}),
        userId,
      });

      return {
        success: true,
        items: result,
        total: result.length,
      };
    } catch (error) {
      this.handleError(
        'Error fetching subjects',
        error,
        'Failed to fetch subjects',
      );
    }
  }

  // =====================================================
  // GET /subjects/controls - Get RBAC controls
  // =====================================================
  @Get('controls')
  async getControls(@Query('schoolId') schoolId: string, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);
      const schoolIdNum = Number(schoolId);

      if (Number.isNaN(schoolIdNum)) {
        throw new HttpException('Invalid schoolId', HttpStatus.BAD_REQUEST);
      }

      const controls = await this.subjectService.getControls({
        userId,
        schoolId: schoolIdNum,
      });

      return {
        success: true,
        controls,
      };
    } catch (error) {
      this.handleError(
        'Error fetching subject controls',
        error,
        'Failed to fetch subject controls',
      );
    }
  }

  // =====================================================
  // GET /subjects/status-options - Get status options from master table
  // =====================================================
  @Get('status-options')
  async getStatusOptions(
    @Query() query: GetStatusOptionsDto
  ): Promise<{ success: boolean; data: StatusMaster[]; message?: string }> {
    try {
      const formIdNumber = query.formId || 8; // Default to 8 for subjects
      const statusOptions = await this.subjectService.getStatusOptions(formIdNumber);
      
      return {
        success: true,
        data: statusOptions,
        message: 'Status options fetched successfully'
      };
    } catch (error) {
      const err = error as Error;
      throw new HttpException(
        err.message || 'Failed to fetch status options',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // =====================================================
  // GET /subjects/status-options/:statusId - Get single status by ID
  // =====================================================
  @Get('status-options/:statusId')
  async getStatusById(
    @Param('statusId') statusId: string
  ): Promise<{ success: boolean; data: StatusMaster | null }> {
    try {
      const status = await this.subjectService.getStatusById(parseInt(statusId, 10));
      return {
        success: !!status,
        data: status
      };
    } catch (error) {
      const err = error as Error;
      throw new HttpException(
        err.message || 'Failed to fetch status',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // =====================================================
  // GET /subjects/:id - Get single subject
  // =====================================================
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);
      const subjectId = Number(id);

      if (Number.isNaN(subjectId)) {
        throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
      }

      const result = await this.subjectService.view({
        id: subjectId,
        userId,
      });

      if (!result.length) {
        throw new HttpException('Subject not found', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: result[0],
      };
    } catch (error) {
      this.handleError(
        `Error fetching subject ${id}`,
        error,
        'Failed to fetch subject',
      );
    }
  }

  // =====================================================
  // POST /subjects - Create new subject
  // =====================================================
  @Post()
  async create(@Body() dto: CreateSubjectDto, @Req() req: Request) {
    try {
      const userId = this.getUserId(req);

      const result = await this.subjectService.create({
        schoolId: dto.schoolId,
        subjectData: {
          subject_code: dto.subjectCode,
          subject_name: dto.subjectName,
          ...(dto.subjectShortName !== undefined
            ? { subject_short_name: dto.subjectShortName }
            : {}),
          ...(dto.subjectType !== undefined
            ? { subject_type: dto.subjectType }
            : {}),
          ...(dto.subjectCategoryId !== undefined
            ? { subject_category_id: dto.subjectCategoryId }
            : {}),
          ...(dto.languageGroupId !== undefined
            ? { language_group_id: dto.languageGroupId }
            : {}),
          ...(dto.subjectLevel !== undefined
            ? { subject_level: dto.subjectLevel }
            : {}),
          ...(dto.parentSubjectId !== undefined
            ? { parent_subject_id: dto.parentSubjectId }
            : {}),
          ...(dto.defaultTheoryCredits !== undefined
            ? { default_theory_credits: dto.defaultTheoryCredits }
            : {}),
          ...(dto.defaultPracticalCredits !== undefined
            ? { default_practical_credits: dto.defaultPracticalCredits }
            : {}),
          ...(dto.defaultPassingMarksTheory !== undefined
            ? { default_passing_marks_theory: dto.defaultPassingMarksTheory }
            : {}),
          ...(dto.defaultPassingMarksPractical !== undefined
            ? {
                default_passing_marks_practical:
                  dto.defaultPassingMarksPractical,
              }
            : {}),
          ...(dto.defaultMaxMarksTheory !== undefined
            ? { default_max_marks_theory: dto.defaultMaxMarksTheory }
            : {}),
          ...(dto.defaultMaxMarksPractical !== undefined
            ? { default_max_marks_practical: dto.defaultMaxMarksPractical }
            : {}),
          ...(dto.defaultMinAttendancePercent !== undefined
            ? {
                default_min_attendance_percent: dto.defaultMinAttendancePercent,
              }
            : {}),
          ...(dto.isGradeOnly !== undefined
            ? { is_grade_only: dto.isGradeOnly }
            : {}),
          ...(dto.hasPractical !== undefined
            ? { has_practical: dto.hasPractical }
            : {}),
          ...(dto.defaultPracticalGroupSize !== undefined
            ? { default_practical_group_size: dto.defaultPracticalGroupSize }
            : {}),
          ...(dto.labRequired !== undefined
            ? { lab_required: dto.labRequired }
            : {}),
          ...(dto.labId !== undefined ? { lab_id: dto.labId } : {}),
          ...(dto.isOptional !== undefined
            ? { is_optional: dto.isOptional }
            : {}),
          ...(dto.isCoScholastic !== undefined
            ? { is_co_scholastic: dto.isCoScholastic }
            : {}),
          ...(dto.coScholasticAreaId !== undefined
            ? { co_scholastic_area_id: dto.coScholasticAreaId }
            : {}),
          ...(dto.globalDisplayOrder !== undefined
            ? { global_display_order: dto.globalDisplayOrder }
            : {}),
          ...(dto.description !== undefined
            ? { description: dto.description }
            : {}),
        },
        ...(dto.classMappings
          ? {
              classMappings: dto.classMappings.map((m) => ({
                class_id: m.classId,
                ...(m.subjectCodeOverride !== undefined
                  ? { subject_code_override: m.subjectCodeOverride }
                  : {}),
                ...(m.displayName !== undefined
                  ? { display_name: m.displayName }
                  : {}),
                ...(m.subjectNumber !== undefined
                  ? { subject_number: m.subjectNumber }
                  : {}),
                ...(m.displayOrder !== undefined
                  ? { display_order: m.displayOrder }
                  : {}),
                ...(m.theoryCredits !== undefined
                  ? { theory_credits: m.theoryCredits }
                  : {}),
                ...(m.practicalCredits !== undefined
                  ? { practical_credits: m.practicalCredits }
                  : {}),
                ...(m.theoryHoursPerWeek !== undefined
                  ? { theory_hours_per_week: m.theoryHoursPerWeek }
                  : {}),
                ...(m.practicalHoursPerWeek !== undefined
                  ? { practical_hours_per_week: m.practicalHoursPerWeek }
                  : {}),
                ...(m.passingMarksTheory !== undefined
                  ? { passing_marks_theory: m.passingMarksTheory }
                  : {}),
                ...(m.passingMarksPractical !== undefined
                  ? { passing_marks_practical: m.passingMarksPractical }
                  : {}),
                ...(m.maxMarksTheory !== undefined
                  ? { max_marks_theory: m.maxMarksTheory }
                  : {}),
                ...(m.maxMarksPractical !== undefined
                  ? { max_marks_practical: m.maxMarksPractical }
                  : {}),
                ...(m.minAttendancePercent !== undefined
                  ? { min_attendance_percent: m.minAttendancePercent }
                  : {}),
                ...(m.isOptional !== undefined
                  ? { is_optional: m.isOptional }
                  : {}),
                ...(m.practicalGroupSize !== undefined
                  ? { practical_group_size: m.practicalGroupSize }
                  : {}),
                ...(m.isTaught !== undefined ? { is_taught: m.isTaught } : {}),
                ...(m.suggestedTeacherId !== undefined
                  ? { suggested_teacher_id: m.suggestedTeacherId }
                  : {}),
              })),
            }
          : {}),
        userId,
      });

      return {
        success: true,
        data: result,
        message: result?.out_message || 'Subject created successfully',
      };
    } catch (error) {
      this.handleError(
        'Error creating subject',
        error,
        'Failed to create subject',
      );
    }
  }

  // =====================================================
  // PUT /subjects/:id - Update subject
  // =====================================================
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSubjectDto,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const subjectId = Number(id);

      if (Number.isNaN(subjectId)) {
        throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
      }

      const result = await this.subjectService.update({
        id: subjectId,
        schoolId: dto.schoolId,
        subjectData: {
          ...(dto.subjectCode !== undefined
            ? { subject_code: dto.subjectCode }
            : {}),
          ...(dto.subjectName !== undefined
            ? { subject_name: dto.subjectName }
            : {}),
          ...(dto.subjectShortName !== undefined
            ? { subject_short_name: dto.subjectShortName }
            : {}),
          ...(dto.subjectType !== undefined
            ? { subject_type: dto.subjectType }
            : {}),
          ...(dto.subjectCategoryId !== undefined
            ? { subject_category_id: dto.subjectCategoryId }
            : {}),
          ...(dto.languageGroupId !== undefined
            ? { language_group_id: dto.languageGroupId }
            : {}),
          ...(dto.subjectLevel !== undefined
            ? { subject_level: dto.subjectLevel }
            : {}),
          ...(dto.parentSubjectId !== undefined
            ? { parent_subject_id: dto.parentSubjectId }
            : {}),
          ...(dto.defaultTheoryCredits !== undefined
            ? { default_theory_credits: dto.defaultTheoryCredits }
            : {}),
          ...(dto.defaultPracticalCredits !== undefined
            ? { default_practical_credits: dto.defaultPracticalCredits }
            : {}),
          ...(dto.defaultPassingMarksTheory !== undefined
            ? { default_passing_marks_theory: dto.defaultPassingMarksTheory }
            : {}),
          ...(dto.defaultPassingMarksPractical !== undefined
            ? {
                default_passing_marks_practical:
                  dto.defaultPassingMarksPractical,
              }
            : {}),
          ...(dto.defaultMaxMarksTheory !== undefined
            ? { default_max_marks_theory: dto.defaultMaxMarksTheory }
            : {}),
          ...(dto.defaultMaxMarksPractical !== undefined
            ? { default_max_marks_practical: dto.defaultMaxMarksPractical }
            : {}),
          ...(dto.defaultMinAttendancePercent !== undefined
            ? {
                default_min_attendance_percent: dto.defaultMinAttendancePercent,
              }
            : {}),
          ...(dto.isGradeOnly !== undefined
            ? { is_grade_only: dto.isGradeOnly }
            : {}),
          ...(dto.hasPractical !== undefined
            ? { has_practical: dto.hasPractical }
            : {}),
          ...(dto.defaultPracticalGroupSize !== undefined
            ? { default_practical_group_size: dto.defaultPracticalGroupSize }
            : {}),
          ...(dto.labRequired !== undefined
            ? { lab_required: dto.labRequired }
            : {}),
          ...(dto.labId !== undefined ? { lab_id: dto.labId } : {}),
          ...(dto.isOptional !== undefined
            ? { is_optional: dto.isOptional }
            : {}),
          ...(dto.isCoScholastic !== undefined
            ? { is_co_scholastic: dto.isCoScholastic }
            : {}),
          ...(dto.coScholasticAreaId !== undefined
            ? { co_scholastic_area_id: dto.coScholasticAreaId }
            : {}),
          ...(dto.globalDisplayOrder !== undefined
            ? { global_display_order: dto.globalDisplayOrder }
            : {}),
          ...(dto.description !== undefined
            ? { description: dto.description }
            : {}),
        },
        ...(dto.classMappings
          ? {
              classMappings: dto.classMappings.map((m) => ({
                ...(m.id !== undefined ? { id: m.id } : {}),
                ...(m.classId !== undefined ? { class_id: m.classId } : {}),
                ...(m.subjectCodeOverride !== undefined
                  ? { subject_code_override: m.subjectCodeOverride }
                  : {}),
                ...(m.displayName !== undefined
                  ? { display_name: m.displayName }
                  : {}),
                ...(m.subjectNumber !== undefined
                  ? { subject_number: m.subjectNumber }
                  : {}),
                ...(m.displayOrder !== undefined
                  ? { display_order: m.displayOrder }
                  : {}),
                ...(m.theoryCredits !== undefined
                  ? { theory_credits: m.theoryCredits }
                  : {}),
                ...(m.practicalCredits !== undefined
                  ? { practical_credits: m.practicalCredits }
                  : {}),
                ...(m.theoryHoursPerWeek !== undefined
                  ? { theory_hours_per_week: m.theoryHoursPerWeek }
                  : {}),
                ...(m.practicalHoursPerWeek !== undefined
                  ? { practical_hours_per_week: m.practicalHoursPerWeek }
                  : {}),
                ...(m.passingMarksTheory !== undefined
                  ? { passing_marks_theory: m.passingMarksTheory }
                  : {}),
                ...(m.passingMarksPractical !== undefined
                  ? { passing_marks_practical: m.passingMarksPractical }
                  : {}),
                ...(m.maxMarksTheory !== undefined
                  ? { max_marks_theory: m.maxMarksTheory }
                  : {}),
                ...(m.maxMarksPractical !== undefined
                  ? { max_marks_practical: m.maxMarksPractical }
                  : {}),
                ...(m.minAttendancePercent !== undefined
                  ? { min_attendance_percent: m.minAttendancePercent }
                  : {}),
                ...(m.isOptional !== undefined
                  ? { is_optional: m.isOptional }
                  : {}),
                ...(m.practicalGroupSize !== undefined
                  ? { practical_group_size: m.practicalGroupSize }
                  : {}),
                ...(m.isTaught !== undefined ? { is_taught: m.isTaught } : {}),
                ...(m.suggestedTeacherId !== undefined
                  ? { suggested_teacher_id: m.suggestedTeacherId }
                  : {}),
              })),
            }
          : {}),
        ...(dto.mappingsToDelete
          ? { mappingsToDelete: dto.mappingsToDelete }
          : {}),
        userId,
      });

      return {
        success: true,
        data: result,
        message: result?.out_message || 'Subject updated successfully',
      };
    } catch (error) {
      this.handleError(
        `Error updating subject ${id}`,
        error,
        'Failed to update subject',
      );
    }
  }

  // =====================================================
  // DELETE /subjects/:id - Delete subject
  // =====================================================
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Query('schoolId') schoolId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const subjectId = Number(id);
      const schoolIdNum = Number(schoolId);

      if (Number.isNaN(subjectId) || Number.isNaN(schoolIdNum)) {
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
      }

      const result = await this.subjectService.delete({
        id: subjectId,
        schoolId: schoolIdNum,
        userId,
      });

      return {
        success: true,
        message: result?.out_message || 'Subject deleted successfully',
      };
    } catch (error) {
      this.handleError(
        `Error deleting subject ${id}`,
        error,
        'Failed to delete subject',
      );
    }
  }

  // =====================================================
  // POST /subjects/:id/activate - Activate subject
  // =====================================================
  @Post(':id/activate')
  async activate(
    @Param('id') id: string,
    @Query('schoolId') schoolId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const subjectId = Number(id);
      const schoolIdNum = Number(schoolId);

      if (Number.isNaN(subjectId) || Number.isNaN(schoolIdNum)) {
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
      }

      const result = await this.subjectService.activate({
        id: subjectId,
        schoolId: schoolIdNum,
        userId,
      });

      return {
        success: true,
        data: result,
        message: result?.out_message || 'Subject activated successfully',
      };
    } catch (error) {
      this.handleError(
        `Error activating subject ${id}`,
        error,
        'Failed to activate subject',
      );
    }
  }

  // =====================================================
  // POST /subjects/:id/deactivate - Deactivate subject
  // =====================================================
  @Post(':id/deactivate')
  async deactivate(
    @Param('id') id: string,
    @Query('schoolId') schoolId: string,
    @Req() req: Request,
  ) {
    try {
      const userId = this.getUserId(req);
      const subjectId = Number(id);
      const schoolIdNum = Number(schoolId);

      if (Number.isNaN(subjectId) || Number.isNaN(schoolIdNum)) {
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
      }

      const result = await this.subjectService.deactivate({
        id: subjectId,
        schoolId: schoolIdNum,
        userId,
      });

      return {
        success: true,
        data: result,
        message: result?.out_message || 'Subject deactivated successfully',
      };
    } catch (error) {
      this.handleError(
        `Error deactivating subject ${id}`,
        error,
        'Failed to deactivate subject',
      );
    }
  }
}