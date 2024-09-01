import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
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
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  school?: string; //근데 SD_SCHUL_CODE는 보통 number 아닌가 //오류나면 number로 바꾸기
}
