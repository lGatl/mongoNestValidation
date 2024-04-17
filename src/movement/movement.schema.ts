import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovementDocument = HydratedDocument<Movement>;

@Schema()
export class Movement {
  @Prop()
  id: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop()
  label: string;

  @Prop({ required: true })
  amount: number;
}

export const MovementSchema = SchemaFactory.createForClass(Movement);
