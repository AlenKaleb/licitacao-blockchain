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
    renderAdicionarEmpresa: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('formEmpresa.html');
        }
    },
    renderEditarEmpresa: function(req, res) {

        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('formEmpresa.html');
        }
    },
    renderListarEmpresas: function(req, res) {
        // verifica se usuario esta logado
        if (!req.session.username) {
            res.redirect('/api/auth');
            res.end();
        } else {
            res.render('listarEmpresas.html');
        }
    },
    adicionarEmpresa: async function(req, res) {

        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
            console.log("*** EmpresasApi -> Adicionar empresas ***");
            console.log(req.body);

            let userAddr = req.session.address;
            const { razaoSocial, cnpj, telefone } = req.body;
            let pass = req.session.password;

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                if (accountUnlocked) {

                    await LicitacaoContract.methods.adicionarEmpresa(razaoSocial, cnpj, telefone)
                        .send({ from: userAddr, gas: 3000000 })
                        .then(function(result) {
                            console.log(result);
                            return res.send({ 'error': false, 'msg': 'Empresa cadastrada com sucesso.'});  
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
    alterarEmpresa: async (req, res) => {
        
        if (!req.session.username) {
            res.redirect('/');
            res.end();
        } else {
        
            let empresaId = req.body.empresaId;
            let razaoSocial = req.body.razaoSocial;
            let cnpj   = req.body.cnpj;
            let telefone   = req.body.telefone;
            let userAddr = req.session.address;
            let pass     = req.session.password;

            console.log("apis -> empresas -> alterarEmpresas: ", userAddr, empresaId, razaoSocial, cnpj, telefone);

            try {
                let accountUnlocked = await web3.eth.personal.unlockAccount(userAddr, pass, null)
                console.log("Account unlocked?", accountUnlocked);
                if (accountUnlocked) {

                    await LicitacaoContract.methods.alterarEmpresa(empresaId, razaoSocial, cnpj, telefone)
                        .send({ from: userAddr, gas: 3000000 })
                        .then(receipt => {
                            console.log(receipt);
                            return res.send({ 'error': false, 'msg': 'Empresa atualizada com sucesso.'}); 
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
    listarEmpresas: async function(req, res) {
        console.log(contractAddress)
        let userAddr = req.session.address;
        console.log("*** Getting empresas ***", userAddr);

        await LicitacaoContract.methods.listarEmpresas()
            .call({ from: userAddr, gas: 3000000 })
            .then(function (empresa) {

                console.log("empresa", empresa);
                if (empresa === null) {
                    return res.send({ error: false, msg: "empresa não encontrada"});
                }

                let empresas = [];
                for (i = 0; i < empresa['0'].length; i++) {
                    empresas.push({ 'id': +empresa['0'][i], 'razaoSocial': empresa['1'][i], 'cnpj': empresa['2'][i], 'telefone': empresa['3'][i], 'addr': empresa['4'][i] });
                }

                console.log("empresas", empresas);

                res.send({ error: false, msg: "empresas resgatados com sucesso", empresas});
                return true;
            })
            .catch(error => {
                console.log("*** EmpresasApi -> listarEmpresas ***error:", error);
                res.send({ error: true, msg: error});
            })
        
    },
    getEmpresa: async function(req, res){

        console.log(contractAddress)
        let userAddr = req.session.address;
        console.log("*** Recuperando empresa ***", userAddr);
        console.log(req);

        await LicitacaoContract.methods.empresaInfo(req.query.id)
            .call({ from: userAddr, gas: 3000000 })
            .then(function (emp) {

                console.log("empresa", emp);
                if (emp === null) {
                    return res.send({ error: false, msg: "empresa não encontrada"});
                }

                let empresa = { 'id': +emp['0'], 'razaoSocial': emp['1'], 'cnpj': emp['2'], 'telefone': emp['3'], 'addr': emp['4'] }

                console.log("empresa", empresa);

                res.send({ error: false, msg: "empresa resgatada com sucesso", empresa});
                return true;
            })
            .catch(error => {
                console.log("*** empresaApi -> getEmpresa ***error:", error);
                res.send({ error: true, msg: error});
            })
    }
}