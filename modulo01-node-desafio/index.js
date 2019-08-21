const express = require("express");

const server = express();

server.use(express.json());

const projetos = [];
let numeroDeRequisicoes = 0;

function atualizarLogRequisicoes(req, res, next) {
  numeroDeRequisicoes++;

  console.log(`Numero total de requisições: ${numeroDeRequisicoes}`);

  next();
}

function checarProjetoExistente(req, res, next) {
  const { id } = req.params;
  const projetoExistente = projetos.find(p => p.id == id);

  if (!projetoExistente)
    return res.status(400).json({ error: "Projeto não encontrado" });

  return next();
}

server.use(atualizarLogRequisicoes);

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const projeto = {
    id: id,
    title: title,
    tasks: []
  };

  projetos.push(projeto);

  return res.json(projeto);
});

server.get("/projects", (req, res) => {
  return res.json(projetos);
});

server.put("/projects/:id", checarProjetoExistente, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projetos[id].title = title;

  return res.json(projetos[id]);
});

server.delete("/projects/:id", checarProjetoExistente, (req, res) => {
  const { id } = req.params;

  projetos.splice(id, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checarProjetoExistente, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projetos[id].tasks.push(title);

  return res.json(projetos[id]);
});

server.listen(3000);
