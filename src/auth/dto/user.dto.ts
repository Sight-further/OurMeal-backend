import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  pw: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNumber()
  @IsNotEmpty()
  perm: number;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  school?: string;
}
