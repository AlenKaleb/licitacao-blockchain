const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const empresas = require("./apis/empresas/empresas.js");
const licitacoes = require("./apis/licitacoes/licitacoes.js");
const ofertas = require("./apis/ofertas/ofertas.js");

// set default views folder
app.set('views', __dirname + "/views");
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// registra a sessão do usuário
app.use(session({
    secret: 'mysecret',
    saveUninitialized: false,
    resave: false
}));

const authRoutes = require('./apis/routes/auth.js');

app.get('/', (req, res) => {
    res.redirect('/api/auth');
});

// * Auth pages * //
app.use("/api/auth", authRoutes);

// * Empresa *//
app.post("/adicionarEmpresa", empresas.adicionarEmpresa);
app.post("/alterarEmpresa", empresas.alterarEmpresa);
app.get("/adicionarEmpresa", empresas.renderAdicionarEmpresa);
app.get("/editarEmpresa", empresas.renderEditarEmpresa);
app.get("/getEmpresa", empresas.getEmpresa);
app.get("/empresas", empresas.renderListarEmpresas);
app.get("/listarEmpresas", empresas.listarEmpresas);


// * Licitação *//
app.post("/adicionarLicitacao", licitacoes.adicionarLicitacao);
app.post("/alterarLicitacao", licitacoes.alterarLicitacao);
app.get("/adicionarLicitacao", licitacoes.renderAdicionarLicitacao);
app.get("/editarLicitacao", licitacoes.renderEditarLicitacao);
app.get("/getLicitacao", licitacoes.getLicitacao);
app.get("/licitacoes", licitacoes.renderListarLicitacoes);
app.get("/listarLicitacoes", licitacoes.listarLicitacoes);

// * Ofertas *//
app.post("/adicionarOferta", ofertas.adicionarOferta);
app.post("/alterarOferta", ofertas.alterarOferta);
app.get("/adicionarOferta", ofertas.renderAdicionarOferta);
app.get("/editarOferta", ofertas.renderEditarOferta);
app.get("/getOferta", ofertas.getOferta);
app.get("/ofertas", ofertas.renderListarOfertas);
app.get("/listarOfertas", ofertas.listarOfertas);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log(`App listening on port ${PORT}`);
})