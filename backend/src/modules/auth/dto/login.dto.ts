import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  groupCode!: string;

  @IsString()
  @IsNotEmpty()
  userCode!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password!: string;
}