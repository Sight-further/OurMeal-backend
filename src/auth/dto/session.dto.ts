import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class SessionDto {
    @IsOptional()
    _id?: ObjectId;

    @IsString()
    @IsNotEmpty()
    sessionId: string;

    @IsString()
    @IsNotEmpty()
    token: string;

    @IsDate()
    @IsNotEmpty()
    createdAt: Date;
}
