const path = require('path');
const Web3 = require("web3");

const licitacao_abi = require(path.resolve("../dapp/build/contracts/LicitacaoContract.json"));
const httpEndpoint = 'http://localhost:8540';

let contractAddress = require('../../utils/parityRequests').contractAddress;


const OPTIONS = {
    defaultBlock: "latest",
    transactionConfirmationBlocks: 1,
    transactionBlockTimeout: 5
};

let web3 = new Web3(httpEndpoint, null, OPTIONS);

let LicitacaoContract = new web3.eth.Contract(licitacao_abi.abi, contractAddress);


module.exports = {
    renderAdicionarLicitacao: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('formLicitacao.html');
        }
    },
    renderEditarLicitacao: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('formLicitacao.html');
        }
    },
    renderListarLicitacoes: function(req, res) {
        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('listarLicitacoes.html');
        }
    },
    adicionarLicitacao: async function(req, res) {

        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
            console.log("*** LicitacoesApi -> Adicionar licitacoes ***");
            console.log(req.body);

            // let razaoSocial = req.body.razaoSocial;
            // let cnpj   = req.body.cnpj;
            // let telefone   = req.body.telefone;
            // let userAddr = req.session.address;
            // let pass     = req.session.password;

            let userAddr = req.session.address;
            const { titulo, codigo, dataInicio, dataFim, status } = req.body;
            let pass = req.session.password;

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                if (accountUnlocked) {

                    await LicitacaoContract.methods.adicionarLicitacao(titulo, codigo, dataInicio, dataFim, status)
                        .send({ from: userAddr, gas: 3000000 })
                        .then(function(result) {
                            console.log(result);
                            return res.send({ 'error': false, 'msg': 'Licitacao cadastrada com sucesso.'});  
                        })
                        .catch(function(err) {
                            console.log(err);
                            return res.send({ 'error': true, 'msg': 'Erro ao comunicar com o contrato.'});
                        })
                } 
            } catch (err) {
                return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.'});
            }
        }
    },
    alterarLicitacao: async (req, res) => {
        
        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
        
            let licitacaoId = req.body.licitacaoId;
            let titulo = req.body.titulo;
            let codigo   = req.body.codigo;
            let dataInicio   = req.body.dataInicio;
            let dataFim   = req.body.dataFim;
            let status   = req.body.status;
            let userAddr = req.session.address;
            let pass     = req.session.password;

            console.log("apis -> licitacoes -> alterarLicitacoes: ", userAddr, licitacaoId, titulo, dataInicio, dataFim, status);

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                console.log("Account unlocked?", accountUnlocked);
                if (accountUnlocked) {

                    await LicitacaoContract.methods.alterarLicitacao(licitacaoId, razaoSocial, cnpj, telefone)
                        .send({ from: userAddr, gas: 3000000 })
                        .then(receipt => {
                            console.log(receipt);
                            return res.send({ 'error': false, 'msg': 'Licitacao atualizada com sucesso.'}); 
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.json({ 'error': true, msg: "erro ao se comunicar com o contrato"});
                        })
                }
            } catch (error) {
                return res.send({ 'error': true, 'msg': 'Erro ao desbloquear sua conta. Por favor, tente novamente mais tarde.'});
            }
        }
    },
    listarLicitacoes: async function(req, res) {
        console.log(contractAddress)
        let userAddr = req.session.address;
        console.log("*** Getting licitacoes ***", userAddr);

        await LicitacaoContract.methods.listarLicitacoes()
            .call({ from: userAddr, gas: 3000000 })
            .then(function (licitacao) {

                console.log("licitacao", licitacao);
                if (licitacao === null) {
                    return res.send({ error: false, msg: "licitacao não encontrada"});
                }

                let licitacoes = [];
                for (i = 0; i < licitacao['0'].length; i++) {
                    licitacoes.push({ 'id': +licitacao['0'][i], 'codigo': licitacao['1'][i], 'titulo': licitacao['2'][i], 'dataInicio': licitacao['3'][i], 'dataFim': licitacao['4'][i], 'status': licitacao['5'][i], 'addr': licitacao['6'][i] });
                }

                console.log("licitacoes", licitacoes);

                res.send({ error: false, msg: "licitacoes resgatados com sucesso", licitacoes});
                return true;
            })
            .catch(error => {
                console.log("*** LicitacoesApi -> listarLicitacoes ***error:", error);
                res.send({ error: true, msg: error});
            })
        
    },
    getLicitacao: async function(req, res){

        console.log(contractAddress)
        let userAddr = req.session.address;
        console.log("*** Recuperando licitacao ***", userAddr);
        console.log(req);

        await LicitacaoContract.methods.licitacaoInfo(req.query.id)
            .call({ from: userAddr, gas: 3000000 })
            .then(function (lic) {

                console.log("licitacao", lic);
                if (lic === null) {
                    return res.send({ error: false, msg: "licitacao não encontrada"});
                }

                let licitacao = { 'id': +lic['0'], 'codigo': lic['1'], 'titulo': lic['2'], 'dataInicio': lic['3'], 'dataFim': lic['4'], 'status': lic['5'], 'addr': lic['6'] }

                console.log("licitacao", licitacao);

                res.send({ error: false, msg: "licitacao resgatada com sucesso", licitacao});
                return true;
            })
            .catch(error => {
                console.log("*** licitacaoApi -> getLicitacao ***error:", error);
                res.send({ error: true, msg: error});
            })
    }
}