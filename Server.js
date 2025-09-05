import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import usersRoutes from "./routes/users.js";
import adminRoutes from "./routes/admin.js";

config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.use("/usuarios", usersRoutes);
app.use("/admin", adminRoutes); // <-- Aqui você monta todas as rotas de admin

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
