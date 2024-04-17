import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movement } from './movement.schema';

@Injectable()
export class MovementService {
  constructor(
    @InjectModel(Movement.name) private MovementModel: Model<Movement>,
  ) {}

  async create(createCatDto: Movement): Promise<Movement> {
    const createdCat = new this.MovementModel(createCatDto);
    return createdCat.save();
  }

  async findAll(selector?: {
    date?: { $gte?: Date; $lte?: Date };
  }): Promise<Movement[]> {
    return this.MovementModel.find(selector).exec();
  }
}
