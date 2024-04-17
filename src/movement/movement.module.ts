import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovementController } from './movement.controller';
import { MovementService } from './movement.service';
import { Movement, MovementSchema } from './movement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movement.name, schema: MovementSchema },
    ]),
  ],
  controllers: [MovementController],
  providers: [MovementService],
  exports: [MovementService],
})
export class MovementModule {}
