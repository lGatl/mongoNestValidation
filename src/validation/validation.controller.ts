import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ValidationService, Reason } from './validation.service';
import { Response } from 'express';

/**
 * formatDate converti la date en chaine de caractère
 * @param date {Date} date à convertir
 */
const formatDate = (date: Date): string => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};

@Controller('validation')
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}
  @Get(':fromDate?/:toDate?')
  async validation(
    @Param('fromDate') fromDate: Date,
    @Param('toDate') toDate: Date,
    @Res() response: Response,
  ) {
    const reasons = await this.validationService.validation(fromDate, toDate);
    // Si le tableau est vide, le controle est validé
    // Sinon on retourne le tableau
    const body: {
      message: string;
      reasons?: Reason[];
      parameters: { fromDate: Date; toDate: Date };
    } = {
      message: '',
      parameters: { fromDate, toDate },
    };
    if (reasons.length) {
      const { firstStartDate, lastEndDate } = reasons.reduce<{
        [key: string]: Date;
      }>((total, { startDate, endDate }) => {
        if (!total!.firstStartDate || total.firstStartDate < startDate) {
          total.firstStartDate = startDate;
        }
        if (!total!.lastEndDate || total.lastEndDate < endDate) {
          total.lastEndDate = endDate;
        }
        return total;
      }, {});
      body.message = `${reasons.length} Error${reasons.length > 1 ? 's were' : ' was'} found between ${formatDate(
        firstStartDate,
      )} and ${formatDate(lastEndDate)}`;
      body.reasons = reasons;
    } else {
      body.message = 'Accepted';
    }
    return response.status(HttpStatus.OK).send(body);
  }
}
