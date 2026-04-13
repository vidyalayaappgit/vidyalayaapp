import {
IsOptional,
IsString,
IsNumber,
IsBoolean,
IsDateString,
Min,
Max,
MinLength,
MaxLength,
Length,
IsPositive,
Matches,   // ✅ ADD THIS
IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

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
@IsBoolean()
isCurrent?: boolean;
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
@IsBoolean()
isCurrent?: boolean;
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
