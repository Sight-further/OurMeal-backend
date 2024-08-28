import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";

export class SessionDto {
    @IsOptional()
    _id: ObjectId;

    @IsString()
    @IsNotEmpty()
    sessionId: string;

    @IsString()
    @IsNotEmpty()
    readonly token: string;

    @IsDate()
    @IsNotEmpty()
    readonly createdAt: Date;
}