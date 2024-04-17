import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BalanceDocument = HydratedDocument<Balance>;

@Schema()
export class Balance {
  @Prop()
  id: number;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop()
  balance: number;
}

export const BalanceSchema = SchemaFactory.createForClass(Balance);
