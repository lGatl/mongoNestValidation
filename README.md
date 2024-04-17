
# Test Technique

Bonjour et bienvenu pour la consultation de ma réponse à ce test technique.

## Approche
- On a une liste d'operations dans laquelle on peut avoir des operations en trop ou manquantes.
- On a tous les mois un point de controle qui nous indique le solde du compte à une date.
- On a besoin d'une api pour verifier si on a les bonnes operations en BDD.
### Controle
- Faire la somme des “amount” entre chaque date de point de contrôle. 
- Comparer cette somme mensuelle à la différence des soldes des points de contrôle avant et après.
### Parametrage
- Il semble primordial de pourvoir indiquer une plage de date (ou au moins une date minimum)pour ne pas remonter toute la base de donnée à chaque fois
- La date de départ semblant la propriété principale, je propose une API **GET /validation/yyyy_mm_dd/yyyy_mm_dd** les dates étant facultatives
- Il semble primordiale de pourvoir récupérer les movements et les balances propre au client.
    le champ client_id ne figurant pas sur l'ennoncé, je considère que la base ne contient que les données d'un seul client.
    Sinon il faudrait un champ client_id sur balances et sur movements et ajouter ce parametre à l'api ou inclure dans le code le controle par client (a voir en fonction des besoins)
## Realisation
- Je connaissais trés peu le framework Nest et puisque vous le mentionnez j'ai profité de ce test pour m'y former un peu et le tester. (Désolé si j'ai loupé certaines bonnes pratiques inférantes au framework)
- J'ai donc mis en place une architecture utilisant mongo et nest dans laquelle j'ai crée les collections movements et balances.
- J'ai crée les api create et findAll sur ces deux collections dont j'avais besoin pour tester la feature.
- J'ai ensuite crée l'api validation demandée.
- Le gros du code se trouve dans les fichiers  **validation/validation.service.ts** et **validation/validation.controller.ts** .
- J'ai beaucoup commenté.
- J'ai laissé des todo qui sont les points que j'aurais aimé aborder avec l'équipe ou avec l'utilisateur.

# Bonne revue

Adrien GATINOIS
