import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors());

// Buscar todos os usuários
app.get("/usuarios", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
});

// Criar usuário(s)
app.post("/usuarios", async (req, res) => {
  const body = req.body;

  try {
    if (Array.isArray(body)) {
      const newUsers = await prisma.user.createMany({
        data: body.map(user => ({
          name: user.name,
          email: user.email,
          age: Number(user.age),
        })),
        skipDuplicates: true,
      });
      res.status(201).json({
        message: "Usuários criados com sucesso",
        count: newUsers.count,
      });
    } else {
      const newUser = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          age: Number(body.age),
        },
      });
      res.status(201).json({
        message: "Usuário criado com sucesso",
        user: newUser,
      });
    }
  } catch (error) {
    console.error("Erro detalhado:", error);
    res.status(500).json({
      message: "Erro ao criar usuário",
      error: error.message
    });
  }
});

// Editar usuário
app.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        age: age ? Number(age) : undefined,
      },
    });

    res.json({
      message: "Usuário atualizado com sucesso",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erro ao editar usuário:", error);
    res.status(500).json({
      message: "Erro ao editar usuário",
      error: error.message,
    });
  }
});

// Deletar usuário
app.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({
      message: "Usuário deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({
      message: "Erro ao deletar usuário",
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
