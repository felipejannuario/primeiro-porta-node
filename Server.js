import express from 'express';

const app = express();
app.use(express.json());

const users = [];

app.get('/', (req, res) => {
    res.send('API está rodando! Use /usuarios para listar os usuários.');
});

app.post('/usuarios', (req, res) => {
    users.push(req.body);
    res.status(201).json({ message: "usuário criado com sucesso" });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
