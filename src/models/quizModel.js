var database = require("../database/config");

function salvarResultado(acertos, erros, pontuacao, fk_usuario) {
  var instrucaoSql = `
        INSERT INTO quiz (acertos, erros, pontuacao, fk_usuario, data_resposta) 
        VALUES (${acertos}, ${erros}, ${pontuacao}, ${fk_usuario}, NOW()); 
    `;
  return database.executar(instrucaoSql);
}

function buscarEvolucaoPorUsuario(idUsuario) {
  var instrucaoSql = `
        SELECT 
            pontuacao, 
            DATE_FORMAT(data_resposta, '%d/%m/%Y %H:%i') as momentoFormatado 
        FROM quiz 
        WHERE fk_usuario = ${idUsuario} 
        ORDER BY data_resposta ASC;
    `;
  return database.executar(instrucaoSql);
}

function buscarUltimaTentativa(idUsuario) {
  var instrucaoSql = `
        SELECT 
            acertos, 
            erros 
        FROM quiz 
        WHERE fk_usuario = ${idUsuario} 
        ORDER BY data_resposta DESC 
        LIMIT 1;
    `;
  return database.executar(instrucaoSql);
}

module.exports = {
  salvarResultado,
  buscarEvolucaoPorUsuario,
  buscarUltimaTentativa
};