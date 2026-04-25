import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
  MinLength,
  MaxLength,
  Length,
  IsPositive,
  Matches,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  // IsObject - removed, not used
} from 'class-validator';
import { Type } from 'class-transformer';

export class AcademicTermDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  term_name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  term_code!: string;

  @IsNumber()
  @IsPositive()
  term_order!: number;

  @IsDateString()
  @IsNotEmpty()
  start_date!: string;

  @IsDateString()
  @IsNotEmpty()
  end_date!: string;
}

export class CreateAcademicYearDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  schoolId!: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  yearName!: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  @Matches(/^\d{4}$/, { message: 'Year code must be 4 digits' })
  yearCode!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AcademicTermDto)
  terms?: AcademicTermDto[];
}

export class UpdateAcademicYearDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  schoolId!: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  yearName?: string;

  @IsOptional()
  @IsString()
  @Length(4, 4)
  yearCode?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AcademicTermDto)
  terms?: AcademicTermDto[];
}

export class ListAcademicYearDto {
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