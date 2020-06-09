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
    renderAdicionarOferta: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('formOferta.html');
        }
    },
    renderEditarOferta: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('formOferta.html');
        }
    },
    renderListarOfertas: function(req, res) {
        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('listarOfertas.html');
        }
    },
    adicionarOferta: async function(req, res) {

        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
            console.log("*** OfertasApi -> Adicionar ofertas ***");
            console.log(req.body);

            let userAddr = req.session.address;
            const { licitacaoId, data, valor } = req.body;
            let pass = req.session.password;

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                if (accountUnlocked) {

                    await LicitacaoContract.methods.adicionarOferta(licitacaoId, data, valor)
                        .send({ from: userAddr, gas: 3000000 })
                        .then(function(result) {
                            console.log(result);
                            return res.send({ 'error': false, 'msg': 'Oferta cadastrada com sucesso.'});  
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
    alterarOferta: async (req, res) => {
        
        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
        
            let ofertaId = req.body.ofertaId;
            let licitacaoId = req.body.licitacaoId;
            let data   = req.body.data;
            let valor   = req.body.valor;
            let userAddr = req.session.address;
            let pass     = req.session.password;

            console.log("apis -> ofertas -> alterarOfertas: ", userAddr, ofertaId, licitacaoId, data, valor);

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                console.log("Account unlocked?", accountUnlocked);
                if (accountUnlocked) {

                    await LicitacaoContract.methods.alterarOferta(ofertaId, licitacaoId, data, valor)
                        .send({ from: userAddr, gas: 3000000 })
                        .then(receipt => {
                            console.log(receipt);
                            return res.send({ 'error': false, 'msg': 'Oferta atualizada com sucesso.'}); 
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
    listarOfertas: async function(req, res) {
        console.log(contractAddress)
        let userAddr = req.session.address;
        console.log("*** Getting ofertas ***", userAddr);

        await LicitacaoContract.methods.listarOfertas()
            .call({ from: userAddr, gas: 3000000 })
            .then(function (oferta) {

                console.log("oferta", oferta);
                if (oferta === null) {
                    return res.send({ error: false, msg: "oferta não encontrada"});
                }

                let ofertas = [];
                for (i = 0; i < oferta['0'].length; i++) {
                    ofertas.push({ 'id': +oferta['0'][i], 'licitacaoId': oferta['1'][i], 'data': oferta['2'][i], 'valor': oferta['3'][i], 'addr': oferta['4'][i] });
                }

                console.log("ofertas", ofertas);

                res.send({ error: false, msg: "ofertas resgatados com sucesso", ofertas});
                return true;
            })
            .catch(error => {
                console.log("*** OfertasApi -> listarOfertas ***error:", error);
                res.send({ error: true, msg: error});
            })
        
    },
    getOferta: async function(req, res){

        console.log(contractAddress)
        let userAddr = req.session.address;
        console.log("*** Recuperando oferta ***", userAddr);
        console.log(req);

        await LicitacaoContract.methods.ofertaInfo(req.query.id)
            .call({ from: userAddr, gas: 3000000 })
            .then(function (emp) {

                console.log("oferta", emp);
                if (emp === null) {
                    return res.send({ error: false, msg: "oferta não encontrada"});
                }

                let oferta = { 'id': +emp['0'], 'licitacaoId': emp['1'], 'data': emp['2'], 'valor': emp['3'], 'addr': emp['4'] }

                console.log("oferta", oferta);

                res.send({ error: false, msg: "oferta resgatada com sucesso", oferta});
                return true;
            })
            .catch(error => {
                console.log("*** ofertaApi -> getOferta ***error:", error);
                res.send({ error: true, msg: error});
            })
    }
}