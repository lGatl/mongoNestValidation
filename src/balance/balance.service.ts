import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Balance } from './balance.schema';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Balance.name) private balanceModel: Model<Balance>,
  ) {}

  async create(balanceParam: Balance): Promise<Balance> {
    const balance = new this.balanceModel(balanceParam);
    return balance.save();
  }

  async findAll(selector?: {
    date?: { $gte?: Date; $lte?: Date };
  }): Promise<Balance[]> {
    return this.balanceModel.find(selector).exec();
  }
}
