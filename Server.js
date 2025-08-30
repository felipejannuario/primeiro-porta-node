import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());  //aqui habilito o http://localhost:3000 ou o servidor que for rodar pra abrir o unico client

const users = [];

app.get('/usuarios', (req, res) => {
    res.send('API está rodando! Use /usuarios para listar os usuários.');
    res.json(users);
});

app.post('/usuarios', (req, res) => {
    users.push(req.body);
    res.status(201).json({ message: "usuário criado com sucesso" });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
