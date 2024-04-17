import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { MovementService } from '../movement/movement.service';
import { BalanceService } from '../balance/balance.service';

export interface Reason {
  // Date du balance précédent, date du balance qui contient le solde à atteindre
  // On sait qu'un probleme s'est glissé entre ces 2 dates
  startDate: Date;
  endDate: Date;
  // On indique le solde à atteindre et le précédent
  startBalance: number;
  endBalance: number;
  // Voici la somme des amount, on peut maintenant refaire le calcul
  sumAmounts: number;
  // Ecart entre solde trouvé et solde attendu
  // On peut repérer la gravité de l'erreur d'un coup d'oeil
  gap: number;
  // Nombre de movements pris en compte
  // On peut se représenter la charge de travail à réaliser d'un coup d'oeil
  nbMovements: number;
}

@Injectable()
export class ValidationService {
  @Inject(MovementService)
  private readonly movementService: MovementService;

  @Inject(BalanceService)
  private readonly balanceService: BalanceService;
  async validation(fromDate: Date, toDate: Date): Promise<Reason[]> {
    // todo verifier la coherance des parametres
    // todo voir avec le sachant
    //  - si ces parametres sont pertinent
    //  - si il ne faudrait pas ajouter l'id d'un client
    //    => auquel cas utiliser les query parameters en POST
    //  - avoir plus d'infos sur le cas d'usage
    //  - si le movement.id permet ou non de dédoublonner les movements auquel cas, à utiliser pour plus de précision

    // On crée un selecteur en fonction des parametres recus
    // definissant le scope temporel de la validation
    const selector: { date?: { $gte?: Date; $lte?: Date } } = {};
    if (fromDate || toDate) {
      selector.date = {};
      if (fromDate) {
        selector.date.$gte = fromDate;
      }
      if (toDate) {
        selector.date.$lte = toDate;
      }
    }
    let movements = [];
    let balances = [];
    try {
      // On recupère les données à contrôler
      movements = await this.movementService.findAll(selector);
      balances = await this.balanceService.findAll(selector);
    } catch (err) {
      throw new HttpException(
        `data recovery problem. Please verify your parameters. Need YYY-MM-DD format. Actually first: ${fromDate} & second:${toDate}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // On tri les balances par ordre de date croissante
    balances.sort((a, b) => a.date.getTime() - b.date.getTime());
    // On tri les movements par ordre de date decroissante
    // dans l'idée de parcourir le tableau à l'envers pour pouvoir utiliser splice sans probleme d'index.
    movements.sort((a, b) => b.date.getTime() - a.date.getTime());
    let startDate: Date | null = null;
    let startBalance: number | null = null;
    let sumAmounts: number | null = null;
    const reasons: Reason[] = [];
    let count = 0;
    // On parcours les balances par ordre de date croissante
    for (const balance of balances) {
      // skip le premier tour, on veut sommer entre 2 dates de balances
      if (!startDate) {
        startBalance = balance.balance;
        startDate = balance.date;
        continue;
      }
      // On parcours donc les movements par ordre de date croissante
      for (let i = movements.length - 1; i >= 0; i--) {
        const movement = movements[i];
        // On commence par verifier si il faut passer au balance suivant
        if (movement.date > balance.date) {
          // Si c'est le cas, on compare la somme des amounts
          // avec la difference entre le solde courant et le solde précédent
          if (count && balance.balance !== startBalance + sumAmounts) {
            // Si on trouve une anomalie, on pousse une reason dans reasons
            reasons.push({
              startDate,
              endDate: balance.date,
              startBalance,
              endBalance: balance.balance,
              sumAmounts,
              gap: Math.abs(balance.balance - (startBalance + sumAmounts)),
              nbMovements: count,
            });
          }
          // Le test effectué, on réinitialise le calcul et on passe au balance suivant
          count = 0;
          sumAmounts = null;
          break;
        } else {
          // On a pas a passer au balance suivant
          // Si on est bien dans la plage de calcul, on somme le amount
          // Au cas ou des movements sont anterieurs au premier balance
          if (movement.date > startDate) {
            sumAmounts += movement.amount;
            count++;
          }
          // On retire le movement calculé de la mémoire
          // Gain de performance, on aura pas à le reparcourir
          movements.splice(i, 1);
        }
      }
      startBalance = balance.balance;
      startDate = balance.date;
    }
    // On retourne le tableau de reasons
    return reasons;
  }
}
