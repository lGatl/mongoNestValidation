import { Controller, Get, Post, Body } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { Balance } from './balance.schema';

@Controller('balances')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get()
  getBalances() {
    return this.balanceService.findAll();
  }

  @Post()
  createBalance(@Body() body: Balance) {
    return this.balanceService.create(body);
  }
}
