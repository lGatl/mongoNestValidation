import { Controller, Get, Post, Body } from '@nestjs/common';
import { MovementService } from './movement.service';
import { Movement } from './movement.schema';

@Controller('movements')
export class MovementController {
  constructor(private readonly movementService: MovementService) {}

  @Get()
  getMovements() {
    return this.movementService.findAll();
  }

  @Post()
  createMovement(@Body() body: Movement) {
    return this.movementService.create(body);
  }
}
