import express from "express";
import { PrismaClient } from "@prisma/client";
import authMiddleware from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

router.use(authMiddleware); // Todas as rotas abaixo precisam de token

// Listar usuários
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});

// Criar usuário
router.post("/", async (req, res) => {
  const { name, email, age } = req.body;
  const newUser = await prisma.user.create({
    data: { name, email, age: Number(age) },
  });
  res.status(201).json(newUser);
});

// Editar usuário
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: { name, email, age: age ? Number(age) : undefined },
  });

  res.json(updatedUser);
});

// Deletar usuário
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  res.json({ message: "Usuário deletado com sucesso" });
});

export default router;
