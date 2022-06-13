# Checkers
Checkers Web App rappresenta una versione multiplayer online del gioco da tavolo dama. 

###### Istruzioni per il deployement

Il sistema viene deployato mediante un workflow su DigitalOcean pertanto è possibile utilizzare direttamente l'ultima versione rilasciata dall'indirizzo http://134.209.205.242:8080/.


In alternativa se si desidera eseguire il codice in locale è possibile farlo come descritto in seguito:
- Clonare la repo ed entrare nella relativa cartella mediante comandi

    `git clone https://github.com/LucaSalvigni/Checkers.git`

    `cd Checkers`
- Creare un file .env contenente tutti i secret

- Avviare il sistema mediante comando 
    `docker compose up --build`
- Accedere al sistema dall'indirizzo http://localhost:8080/.

## Report
Questo progetto è stato svolto per i corsi di Sistemi Distribuiti e Laboratoriuo di Sistemi Software dell'università di Bologna, campus di Cesena (IT).
Dai un'occhiata alla [documentazione](https://github.com/LucaSalvigni/Checkers/blob/main/doc/Checkers_final_report.pdf) del progetto.

## Authors
* [Luca Salvigni](https://github.com/LucaSalvigni)
* [Konrad Gomulka](https://github.com/mcnuggetboii)
* [Manuele Pasini](https://github.com/ManuelePasini)