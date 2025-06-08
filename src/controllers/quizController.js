const quizModel = require('../models/quizModel');

function registrarResultado(req, res) {
  const { acertos, erros, pontuacao, fk_usuario } = req.body;

  if (fk_usuario === undefined || acertos === undefined || erros === undefined || pontuacao === undefined) {
    return res.status(400).json({ mensagem: "Dados incompletos para registrar o resultado." });
  }

  quizModel.salvarResultado(acertos, erros, pontuacao, fk_usuario)
    .then(
      function (resultado) {
        res.status(201).json({
          mensagem: `Resultado do quiz salvo com sucesso! ID do registro: ${resultado.insertId}`,
          idResultado: resultado.insertId
        });
      }
    )
    .catch(
      function (erro) {
        res.status(500).json({ mensagem: "Erro interno ao salvar o resultado do quiz.", detalhe: erro.sqlMessage || erro.message });
      }
    );
}

function buscarEvolucaoPontuacao(req, res) {
  const idUsuario = req.params.idUsuario;
  if (!idUsuario) {
    return res.status(400).json({ mensagem: "ID do usuário não fornecido na URL." });
  }

  quizModel.buscarEvolucaoPorUsuario(idUsuario)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
      } else {
        res.status(204).send();
      }
    })
    .catch(function (erro) {
      res.status(500).json({ mensagem: "Erro interno ao buscar evolução de pontuação.", detalhe: erro.message });
    });
}

function buscarUltimaTentativaStats(req, res) {
  const idUsuario = req.params.idUsuario;

  if (!idUsuario) {
    return res.status(400).json({ mensagem: "ID do usuário não fornecido na URL." });
  }

  quizModel.buscarUltimaTentativa(idUsuario)
    .then(function (resultado) {
      if (resultado.length > 0) {
        res.status(200).json(resultado[0]);
      } else {
        res.status(204).send();
      }
    })
    .catch(function (erro) {
      res.status(500).json({ mensagem: "Erro interno ao buscar última tentativa.", detalhe: erro.message });
    });
}

module.exports = {
  registrarResultado,
  buscarEvolucaoPontuacao,
  buscarUltimaTentativaStats
};