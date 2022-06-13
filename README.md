# Checkers
Checkers Web App rappresenta una versione multiplayer online del gioco da tavolo dama. 

[![GitHub license](https://img.shields.io/github/license/LucaSalvigni/Checkers)](https://github.com/LucaSalvigni/Checkers/blob/main/LICENSE)
![GitHub last commit](https://img.shields.io/github/last-commit/LucaSalvigni/Checkers)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/LucaSalvigni/Checkers/Delivery)

## Report
Questo progetto è stato svolto per i corsi di Sistemi Distribuiti e Laboratorio di Sistemi Software dell'università di Bologna, campus di Cesena (IT).

Dai un'occhiata alla [documentazione](https://github.com/LucaSalvigni/Checkers/blob/main/doc/Checkers_final_report.pdf) del progetto.

## Istruzioni per il deployement
Il sistema viene deployato mediante un workflow su DigitalOcean pertanto è possibile utilizzare direttamente l'ultima versione rilasciata dall'indirizzo http://134.209.205.242:8080/.

In alternativa se si desidera eseguire il codice in locale è possibile farlo come descritto in seguito:
- Clonare la repo ed entrare nella relativa cartella mediante comandi

    `git clone https://github.com/LucaSalvigni/Checkers.git`

    `cd Checkers`
- Creare un file .env contenente tutti i secret

- Avviare il sistema mediante comando 
    `docker compose up --build`
- Accedere al sistema dall'indirizzo http://localhost:8080/.

## Authors
* [Luca Salvigni](https://github.com/LucaSalvigni)
* [Konrad Gomulka](https://github.com/mcnuggetboii)
* [Manuele Pasini](https://github.com/ManuelePasini)
