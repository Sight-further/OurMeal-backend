import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MealsController } from './meals/meals.controller';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [],
  controllers: [AppController, MealsController, AuthController],
  providers: [AppService],
})
export class AppModule {}
