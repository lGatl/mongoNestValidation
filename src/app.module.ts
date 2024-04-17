import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MovementModule } from './movement/movement.module';
import { BalanceModule } from './balance/balance.module';
import { ValidationModule } from './validation/validation.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest'),
    MovementModule,
    BalanceModule,
    ValidationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
