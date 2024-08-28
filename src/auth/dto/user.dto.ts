import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  pw: string;

  @IsString()
  @IsOptional()
  token: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

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
