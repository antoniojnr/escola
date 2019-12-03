const express = require('express');
const app = express();
const models = require('../models/index');
const User = models.User;
const Pokemon = models.Pokemon;

/* Exercício:
   1. Padronizar as respostas de todas as requisições
   2. Criar a rota GET para um único usuário (exemplo: GET /users/fulano)
   3. Fazer uma rota de login (POST, corpo: { name, password })
   3.1. A rota de login retorna:
        { error: false, message: "Usuário conectado."} (se credenciais estiverem corretas)
        { error: true, message: "Nome de usuário ou senha incorretos."} (se credenciais estiverem erradas)
*/

/*
  ROTAS

  Criar novo usuário
  Endpoint: POST /users
  Corpo da requisição:
  { name, password }

  Listar usuários
  Endpoint: GET /users

  Obter um usuário
  Endpoint: GET /users/:name
  - :name é o nome do usuário
  Exemplo: [base_url]/users/antonio

  Atualizar
  Endpoint: PUT /users
  Corpo da requisição:
  { name, password }

  Remover
  Endpoint: DELETE /users/:name
  - :name é o nome do usuário
  Exemplo: [base_url]/users/antonio
*/

// Remover usuário
app.delete('/users/:name', function(req, res) {
  User.destroy({
    where: {
      name: req.params.name
    }
  }).then(function(resultado) {
    res.json({
      error: false,
      message: "O usuário foi removido.",
      result: null
    });
  })
});

// Atualizar usuário
app.put('/users', function(req, res) {
  User.update({
    password: req.body.password
  },
  { 
    where: {
      name: req.body.name
    }
  }).then(function(user) {
    res.json({
      error: false,
      message: "O usuário foi atualizado.",
      result: user
    });
  });
});

// Criar novo usuário
app.post('/users', function(req, res) {
  User.create(req.body).then(function(user) {
    res.json({
      error: false,
      message: "O usuário foi criado.",
      result: user
    });
  }).catch(function(error) {
    if (error.errors[0].validatorKey == 'not_unique') {
      res.json({
        error: true,
        // O caractere abaixo é acento grave, não aspa
        message: `O usuário ${error.errors[0].value} já existe.`,
        result: null
      });
    } else if (error.errors[0].validatorKey == 'is_null') {
      res.json({
        error: true,
        // O caractere abaixo é acento grave, não aspa
        message: `O atributo ${error.errors[0].path} não foi definido.`,
        result: null
      });
    } else {
      console.log(error);
      res.json({
        error: true,
        message: "Erro desconhecido.",
        result: null
      });
    }
  });
});

app.get('/users', function(req, res) {
  User.findAll({ attributes: ['id', 'name', 'password'] }).then(function(users) {
    res.json({
      error: false,
      message: null,
      result: users
    });
  });
});

app.get('/users/:name', function(req, res) {
  User.findOne({ 
    where: {
      name: req.params.name
    },
    attributes: ['id', 'name'],
    include: [
      Pokemon
    ]
  }).then(function(user) {
    res.json({
      error: false,
      message: null,
      result: user
    });
  });
});

app.post('/users/login', function(req, res) {
  User.findOne({ 
    where: {
      name: req.body.name
    }
  }).then(function(user) {
    if (user.password === req.body.password) {
      res.json({
        error: false,
        message: "Usuário conectado.",
        result: null
      });
    } else {
      res.json({
        error: false,
        message: "Usuário ou senha incorretos.",
        result: null
      });
    }
  }).catch(function(error) {
    res.json({
      error: true,
      message: "Erro desconhecido",
      result: null
    });
  });
});

app.post('/users/:name/pokemons', function(req, res) {
  User.findOne({ 
    where: {
      name: req.params.name
    }
  }).then(function(user) {
    let novo = { userId: user.id, ...req.body };

    Pokemon.create(novo).then(function(pkm) {
      res.json({
        error: false,
        message: "O pokemon foi adicionado ao usuário.",
        result: pkm
      });
    });
  });
});

module.exports = app;