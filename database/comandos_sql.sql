/*
comandos para mysql server
*/
CREATE DATABASE runas_sombras;

USE runas_sombras;

CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	email VARCHAR(50),
	senha VARCHAR(50)
);

CREATE TABLE aviso (
	id INT PRIMARY KEY AUTO_INCREMENT,
	titulo VARCHAR(100),
	descricao VARCHAR(150),
	fk_usuario INT,
	FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

CREATE TABLE quiz (
	id INT PRIMARY KEY AUTO_INCREMENT,
    acertos INT,
    erros INT,
    pontuacao INT,
    data_resposta DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_usuario INT,
    FOREIGN KEY (fk_usuario) references usuario(id)
);