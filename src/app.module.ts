import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MealsController } from './meals/meals.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DataService } from './auth/db/data.service';
import { SchoolController } from './school/school.controller';

@Module({
  imports: [],
  controllers: [AppController, MealsController, AuthController, SchoolController],
  providers: [AppService, AuthService, DataService],
})
export class AppModule {}
