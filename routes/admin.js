import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", (req, res) => {
  const { email, password, setupSecret } = req.body;

  if(process.env.ENABLE_ADMIN_REGISTER === "false") {
    return res.status(403).json({ message: "Cadastro de admin desativado" });
  }

  if(setupSecret !== process.env.ADMIN_SETUP_SECRET) {
    return res.status(401).json({ message: "Código de setup inválido" });
  }

  // Aqui você salvaria no banco, mas vamos simplificar
  return res.status(201).json({ message: "Admin criado com sucesso" });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Valida contra o seu JWT_SECRET só como exemplo
  if(email === "admin@site.com" && password === process.env.JWT_SECRET){
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  }

  return res.status(401).json({ message: "Credenciais inválidas" });
});

export default router;
