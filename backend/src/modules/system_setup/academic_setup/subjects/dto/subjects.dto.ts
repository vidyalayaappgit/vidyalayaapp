import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  Max,
  MaxLength,
  IsPositive,
  IsIn,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

// =====================================================
// Class Mapping DTOs
// =====================================================

export class CreateClassMappingDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  classId!: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  subjectCodeOverride?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  displayName?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  subjectNumber?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  theoryCredits?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  practicalCredits?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  theoryHoursPerWeek?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  practicalHoursPerWeek?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingMarksTheory?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingMarksPractical?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  maxMarksTheory?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  maxMarksPractical?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  minAttendancePercent?: number;

  @IsOptional()
  @IsBoolean()
  isOptional?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  practicalGroupSize?: number;

  @IsOptional()
  @IsBoolean()
  isTaught?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  suggestedTeacherId?: number;
}

export class UpdateClassMappingDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  id?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  classId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  subjectCodeOverride?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  displayName?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  subjectNumber?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  theoryCredits?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  practicalCredits?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  theoryHoursPerWeek?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  practicalHoursPerWeek?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingMarksTheory?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingMarksPractical?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  maxMarksTheory?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  maxMarksPractical?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  minAttendancePercent?: number;

  @IsOptional()
  @IsBoolean()
  isOptional?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  practicalGroupSize?: number;

  @IsOptional()
  @IsBoolean()
  isTaught?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  suggestedTeacherId?: number;
}

// =====================================================
// Subject DTOs
// =====================================================

export class CreateSubjectDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  schoolId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  subjectCode!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  subjectName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  subjectShortName?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Theory', 'Practical', 'Both', 'Elective', 'Core', 'Remedial'])
  subjectType?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  subjectCategoryId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  languageGroupId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  subjectLevel?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  parentSubjectId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultTheoryCredits?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultPracticalCredits?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultPassingMarksTheory?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultPassingMarksPractical?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultMaxMarksTheory?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultMaxMarksPractical?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultMinAttendancePercent?: number;

  @IsOptional()
  @IsBoolean()
  isGradeOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  hasPractical?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  defaultPracticalGroupSize?: number;

  @IsOptional()
  @IsBoolean()
  labRequired?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  labId?: number;

  @IsOptional()
  @IsBoolean()
  isOptional?: boolean;

  @IsOptional()
  @IsBoolean()
  isCoScholastic?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  coScholasticAreaId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  globalDisplayOrder?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateClassMappingDto)
  classMappings?: CreateClassMappingDto[];
}

export class UpdateSubjectDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  schoolId!: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  subjectCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  subjectName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  subjectShortName?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Theory', 'Practical', 'Both', 'Elective', 'Core', 'Remedial'])
  subjectType?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  subjectCategoryId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  languageGroupId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  subjectLevel?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  parentSubjectId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultTheoryCredits?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultPracticalCredits?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultPassingMarksTheory?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultPassingMarksPractical?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultMaxMarksTheory?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultMaxMarksPractical?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultMinAttendancePercent?: number;

  @IsOptional()
  @IsBoolean()
  isGradeOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  hasPractical?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  defaultPracticalGroupSize?: number;

  @IsOptional()
  @IsBoolean()
  labRequired?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  labId?: number;

  @IsOptional()
  @IsBoolean()
  isOptional?: boolean;

  @IsOptional()
  @IsBoolean()
  isCoScholastic?: boolean;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  coScholasticAreaId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  globalDisplayOrder?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateClassMappingDto)
  classMappings?: UpdateClassMappingDto[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @Type(() => Number)
  mappingsToDelete?: number[];
}

export class ListSubjectDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  schoolId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  id?: number;

  @IsOptional()
  @IsNumber()
  @IsIn([1, 2, 3]) // 1=Draft, 2=Active, 3=Inactive
  @Type(() => Number)
  status?: number;

  @IsOptional()
  @IsString()
  subjectType?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  subjectCategoryId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  classId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}

// =====================================================
// Status Master DTOs (without ApiProperty decorators)
// =====================================================

export class StatusOptionDto {
  status_id!: number;
  status_name!: string;
  status_desc!: string;
}

export class GetStatusOptionsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  formId?: number;
}