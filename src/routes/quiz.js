const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.post('/registrar', quizController.registrarResultado);

router.get('/evolucao/:idUsuario', quizController.buscarEvolucaoPontuacao);

router.get('/ultimaTentativa/:idUsuario', quizController.buscarUltimaTentativaStats);

module.exports = router;