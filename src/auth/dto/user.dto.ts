import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';
import { ObjectId } from 'mongodb';

export class UserDto {
  @IsOptional()
  _id: ObjectId;
  
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
  @IsString()
  email: string;

  @IsArray()
  @IsOptional()
  editorAt?: Array<string>;
}
