# notification-service
notification interface between each services and provides real time messages through notifications

# Guide d'installation
Aller sur les repertoire suivant avant de faire npm install
1) backend/
2) frontend/notifservicefrontend/
3) Puis lancer "docker-compose up" dans la racine du repo

# Guide d'utilisation
1) Les serivices: Owner, Payment, Escort et Reservation Services sont implementé dans backend/src/publisher/producer.js
On lance avec: "node producer"

2) Le service de notification est implementé dans backend/src/subscriber/consumer.js
On lance avec: "node consumer"
