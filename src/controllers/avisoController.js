var avisoModel = require("../models/avisoModel");

function listar(req, res) {
    avisoModel.listar().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function listarPorUsuario(req, res) {
    var idUsuario = req.params.idUsuario;

    avisoModel.listarPorUsuario(idUsuario)
        .then(
            function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum resultado encontrado!");
                }
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "Houve um erro ao buscar os avisos: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function pesquisarDescricao(req, res) {
    var descricao = req.params.descricao;

    avisoModel.pesquisarDescricao(descricao)
        .then(
            function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum resultado encontrado!");
                }
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function publicar(req, res) {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var idUsuario = req.params.idUsuario;

    if (titulo == undefined) {
        res.status(400).send("O título está indefinido!");
    } else if (descricao == undefined) {
        res.status(400).send("A descrição está indefinido!");
    } else if (idUsuario == undefined) {
        res.status(403).send("O id do usuário está indefinido!");
    } else {
        avisoModel.publicar(titulo, descricao, idUsuario)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            )
            .catch(
                function (erro) {
                    console.log(erro);
                    console.log("Houve um erro ao realizar o post: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function editar(req, res) {
    var novaDescricao = req.body.descricao;
    var idAviso = req.params.idAviso;
    var idUsuarioRequisitante = req.body.idUsuarioLogado; 

    if (!idUsuarioRequisitante) {
        return res.status(401).json({ mensagem: "Usuário não autenticado para esta ação." });
    }
    if (novaDescricao == undefined) {
        return res.status(400).json({ mensagem: "A nova descrição está indefinida!" });
    }
    if (idAviso == undefined) {
        return res.status(400).json({ mensagem: "O ID do aviso está indefinido!" });
    }

    avisoModel.buscarPorId(idAviso)
        .then(function (resultadoBusca) {
            if (resultadoBusca.length == 0) {
                return res.status(404).json({ mensagem: "Aviso não encontrado para edição." });
            }

            const aviso = resultadoBusca[0];
            if (aviso.fk_usuario != parseInt(idUsuarioRequisitante)) {
                return res.status(403).json({ mensagem: "Ação não permitida. Você não é o autor deste post." });
            }

            avisoModel.editar(novaDescricao, idAviso)
                .then(function (resultadoEdicao) {
                    res.json({ mensagem: "Post atualizado com sucesso!", resultadoEdicao });
                })
                .catch(function (erro) {
                    res.status(500).json({ mensagem: "Erro ao editar o post", detalhe: erro.sqlMessage });
                });
        })
        .catch(function (erro) {
            res.status(500).json({ mensagem: "Erro ao verificar o post para edição", detalhe: erro.sqlMessage });
        });
}

function deletar(req, res) {
    var idAviso = req.params.idAviso;
    var idUsuarioRequisitante = req.body.idUsuarioLogado; 

    if (!idUsuarioRequisitante) {
        return res.status(401).json({ mensagem: "Usuário não autenticado para esta ação." });
    }
    if (idAviso == undefined) {
        return res.status(400).json({ mensagem: "O ID do aviso está indefinido!" });
    }

    avisoModel.buscarPorId(idAviso)
        .then(function (resultadoBusca) {
            if (resultadoBusca.length == 0) {
                return res.status(404).json({ mensagem: "Aviso não encontrado para deleção." });
            }

            const aviso = resultadoBusca[0];
            if (aviso.fk_usuario != parseInt(idUsuarioRequisitante)) {
                return res.status(403).json({ mensagem: "Ação não permitida. Você não é o autor deste post." });
            }

            avisoModel.deletar(idAviso)
                .then(function (resultadoDelecao) {
                    res.json({ mensagem: "Post deletado com sucesso!", resultadoDelecao });
                })
                .catch(function (erro) {
                    res.status(500).json({ mensagem: "Erro ao deletar o post", detalhe: erro.sqlMessage });
                });
        })
        .catch(function (erro) {
            res.status(500).json({ mensagem: "Erro ao verificar o post para deleção", detalhe: erro.sqlMessage });
        });
}

function obterContagemPostsPorUsuario(req, res) {
    console.log("CONTROLLER: Executando avisoController.obterContagemPostsPorUsuario()");
    avisoModel.contarPostsPorUsuario()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum post encontrado para contagem por usuário.");
            }
        })
        .catch(function (erro) {
            console.error("Erro ao obter contagem de posts por usuário:", erro);
            res.status(500).json({ mensagem: "Erro ao obter contagem de posts.", detalhe: erro.message });
        });
}

module.exports = {
    listar,
    listarPorUsuario,
    pesquisarDescricao,
    publicar,
    editar,
    deletar,
    obterContagemPostsPorUsuario
}