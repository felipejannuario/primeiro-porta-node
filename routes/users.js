// routes/users.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ message: "Erro ao listar usuários" });
  }
});

export default router;
