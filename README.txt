Als eerste zorg ervoor dat NodeJS is geinstaleerd.

Voer dit in de terminal/CMD in:
"npm install yarn -g" of "npm install --global yarn"

Open nu het mapje server in de terminal en run:
"yarn"

doe het zelfde in het mapje client(deze duurt wat langer). 
Dit zorgt er voor dat alle modules die in package.json staan worden geinstaleerd.

BELANGRIJK bij het pushen van onze codes mogen de volgende bestand en map niet worden mee gepushed:
- yarn.lock
- node_modules

BELANGRIJK als de database niet is opgestart met de juiste configuraties(lees database.js) wil de server niet opstarten

Nadat alle modules zijn geinstaleerd kan je in beide terminals het volgende uitvoeren:
"yarn start"