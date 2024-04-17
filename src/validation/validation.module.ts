import { Module } from '@nestjs/common';
import { ValidationController } from './validation.controller';
import { ValidationService } from './validation.service';
import { MovementModule } from '../movement/movement.module';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [MovementModule, BalanceModule],
  controllers: [ValidationController],
  providers: [ValidationService],
})
export class ValidationModule {}
