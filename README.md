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
