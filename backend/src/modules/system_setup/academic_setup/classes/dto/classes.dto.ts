// D:\schoolapp\backend\src\modules\system_setup\academic_setup\classes\dto\classes.dto.ts

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
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  sectionCode!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sectionName!: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  roomId?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  capacity?: number;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateSectionDto extends CreateSectionDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  id?: number;
}

export class CreateClassDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  schoolId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  classCode!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  className!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(14)
  classNumber!: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  academicLevelId!: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  classRomanNumeral?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minAgeRequired?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAgeRequired?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSectionDto)
  sections?: CreateSectionDto[];
}

export class UpdateClassDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  schoolId!: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  className?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  classRomanNumeral?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  displayOrder?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minAgeRequired?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAgeRequired?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSectionDto)
  sections?: UpdateSectionDto[];

  @IsOptional()
  @IsArray()
  sectionsToDelete?: number[];
}

export class ListClassDto {
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
  @IsIn([1, 2, 3, 4])
  @Type(() => Number)
  status?: number;

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
