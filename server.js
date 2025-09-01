// server.js
import express from 'express';
import { saveEmailToMongo } from './mongodb.js';
import { sendCSATEmails } from './csatSender.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/feedback', async (req, res) => {
    try {
        const { nota, sender } = req.query;
        if (!nota || !sender) {
            return res.status(400).send('Parâmetros inválidos');
        }

        await saveEmailToMongo({ 
            sender, 
            nota: Number(nota), 
            date: new Date()
        });

        console.log('Feedback recebido:', { sender, nota });

        res.send(`
            <h2>Obrigado pelo seu feedback! 💛</h2>
            <p>Sua avaliação foi registrada com sucesso.</p>
        `);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao processar o feedback');
    }
});


app.post('/send-csat', async (req, res) => {
    try {
        await sendCSATEmails('csat');
        res.send('CSAT emails enviados!');
    } catch (err) {
        res.status(500).send('Erro ao enviar CSAT emails');
    }
});


app.listen(PORT, () => console.log('Servidor rodando na porta 3000'));
