import express, { json } from 'express'

const app = express()
app.use(express.json())

const users = []


app.get('/usuarios', (req, res) => {
    
    res.status(200).json(users)
})

app.post('/usuarios', (req, res) => {
    //console.log(req.body)
    users.push(req.body)

    res.status(201).json({ message: "usuario criado com sucesso"})
})

app.listen(3000)