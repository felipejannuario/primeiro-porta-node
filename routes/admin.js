// routes/admin.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
const ENABLE_ADMIN_REGISTER = process.env.ENABLE_ADMIN_REGISTER === "true";
const ADMIN_SETUP_SECRET = process.env.ADMIN_SETUP_SECRET;

// [POST] /admin/register  -> criar o PRIMEIRO admin
router.post("/register", async (req, res) => {
  try {
    const { email, password, setupSecret } = req.body;

    // 1) Bloqueia se já existe admin e a flag não permite novos cadastros
    const count = await prisma.admin.count();
    if (count > 0 && !ENABLE_ADMIN_REGISTER) {
      return res.status(403).json({ message: "Cadastro de admin desabilitado." });
    }

    // 2) (Opcional) Exigir um código de setup na criação
    if (ADMIN_SETUP_SECRET && setupSecret !== ADMIN_SETUP_SECRET) {
      return res.status(401).json({ message: "Setup secret inválido." });
    }

    // 3) Evitar duplicidade
    const exists = await prisma.admin.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: "E-mail já cadastrado." });

    // 4) Criar admin
    const hash = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: { email, password: hash },
    });

    return res.status(201).json({ message: "Admin criado com sucesso!", admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao criar admin" });
  }
});

// [POST] /admin/login  -> autenticar e receber token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) return res.status(401).json({ message: "Admin não encontrado" });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ message: "Senha inválida" });

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: "1h" });

    return res.json({ message: "Login realizado", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro no login" });
  }
});

export default router;
