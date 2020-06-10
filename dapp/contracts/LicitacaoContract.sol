pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract LicitacaoContract {

    event empresaRegistered(uint _empresaId, string _msg);

    event empresaUpdated(uint _empresaId, string _msg);

    event licitacaoRegistered(uint _licitacaoId, string _msg);

    event licitacaoUpdated(uint _licitacaoId, string _msg);

    event ofertaRegistered(uint _licitacaoId, string _msg);

    event ofertaUpdated(uint _licitacaoId, string _msg);

    struct Empresa {
        uint id;
        string razaoSocial;
        uint cnpj;
        string telefone;
        address owner;
    }

    struct Licitacao {
        uint id;
        string titulo;
        uint codigo;
        string dataInicio;
        string dataFim;
        string status;
        address owner;
    }

    struct Oferta {
        uint id;
        uint empresaId;
        uint licitacaoId;
        string data;
        uint valor;
        address owner;
    }

    mapping (uint => Empresa) empresas;
    uint[] public empresasIds;

    mapping (uint => Licitacao) licitacoes;
    uint[] public licitacoesIds;

    mapping (uint => Oferta) ofertas;
    uint[] public ofertasIds;

    uint256 private empresaId = 0;
    uint256 private licitacaoId = 0;
    uint256 private ofertaId = 0;

    function adicionarEmpresa(string memory _razaoSocial, uint _cnpj, string memory _telefone) public {

        require(bytes(_razaoSocial).length >= 1, "Razao social é obrigatório");
        require(_cnpj > 0, "Informe um cnpj");
        require(bytes(_telefone).length >= 11 , "Informe um telefone celular com (DDD)");

        empresas[empresaId] = Empresa(empresaId, _razaoSocial, _cnpj, _telefone, msg.sender);
        empresasIds.push(empresaId);
        empresaId++;
        emit empresaRegistered(empresaId - 1, "Empresa cadastrada com sucesso");
    }

    function alterarEmpresa(uint _id, string memory _razaoSocial, uint _cnpj, string memory _telefone) public {

        require(bytes(_razaoSocial).length >= 1, "Razao social é obrigatório");
        require(_cnpj > 0, "Informe um cnpj");
        require(bytes(_telefone).length >= 11 , "Informe um telefone celular com (DDD)");
        
        Empresa storage emp = empresas[_id];

        emp.razaoSocial = _razaoSocial;
        emp.cnpj = _cnpj;
        emp.telefone = _telefone;

        emit empresaUpdated(_id, "Empresa atualizada com successo");
    }

    function empresaInfo(uint _id) public view
        returns(
            uint,
            string memory,
            uint,
            string memory,
            address
        ) {

            Empresa memory empresa = empresas[_id];

            return (
                empresa.id,
                empresa.razaoSocial,
                empresa.cnpj,
                empresa.telefone,
                empresa.owner
            );
    }

    function listarEmpresas() public view returns(uint[] memory, string[] memory, uint[] memory, string[] memory, address[] memory) {

        uint[] memory ids = empresasIds;

        uint[] memory idsEmpresas = new uint[](ids.length);
        string[] memory razoesSociais = new string[](ids.length);
        uint[] memory cnpjs = new uint[](ids.length);
        string[] memory telefones = new string[](ids.length);
        address[] memory owners = new address[](ids.length);

        for (uint i = 0; i < ids.length; i++) {
            (idsEmpresas[i], razoesSociais[i], cnpjs[i], telefones[i], owners[i]) = empresaInfo(i);
        }

        return (idsEmpresas, razoesSociais, cnpjs, telefones, owners);
    }

    function adicionarLicitacao(
        string memory _titulo, uint _codigo, string memory _dataInicio, string memory _dataFim, string memory _status
        ) public {

        require(bytes(_titulo).length >= 1, "O titulo é obrigatório");
        require(_codigo > 0, "Codigo inválido");
        require(bytes(_dataInicio).length == 10, "Informe uma data de inicio 10/08/2020");
        require(bytes(_dataFim).length == 10, "Informe uma data de termino 20/08/2020");
        require(bytes(_status).length >= 1 , "Informe um status válido");

        licitacoes[licitacaoId] = Licitacao(licitacaoId, _titulo, _codigo, _dataInicio, _dataFim, _status, msg.sender);
        licitacoesIds.push(licitacaoId);
        licitacaoId++;
        
        emit licitacaoRegistered(licitacaoId - 1, "Licitação cadastrada com sucesso");
    }

    function alterarLicitacao(
        uint _id, string memory _titulo, uint _codigo, string memory _dataInicio, string memory _dataFim, string memory _status
        ) public {

        require(bytes(_titulo).length >= 1, "O titulo é obrigatório");
        require(_codigo > 0, "Codigo inválido");
        require(bytes(_dataInicio).length == 10, "Informe uma data de inicio 10/08/2020");
        require(bytes(_dataFim).length == 10, "Informe uma data de termino 20/08/2020");
        require(bytes(_status).length >= 1 , "Informe um status válido");

        Licitacao storage licitacao = licitacoes[_id];

        licitacao.titulo = _titulo;
        licitacao.codigo = _codigo;
        licitacao.dataInicio = _dataInicio;
        licitacao.dataFim = _dataFim;
        licitacao.status = _status;

        emit licitacaoUpdated(_id, "Licitação atualizada com successo");
    }

    function licitacaoInfo(uint _id) public view
        returns(
            uint,
            string memory,
            uint,
            string memory,
            string memory,
            string memory,
            address
        ) {

            Licitacao memory licitacao = licitacoes[_id];

            return (
                licitacao.id,
                licitacao.titulo,
                licitacao.codigo,
                licitacao.dataInicio,
                licitacao.dataFim,
                licitacao.status,
                licitacao.owner
            );
    }

    function listarLicitacoes() public view returns(
        uint[] memory, string[] memory, uint[] memory, string[] memory, string[] memory, string[] memory, address[] memory
        ) {

        uint[] memory ids = licitacoesIds;

        uint[] memory idsLicitacoes = new uint[](ids.length);
        string[] memory titulos = new string[](ids.length);
        uint[] memory codigos = new uint[](ids.length);
        string[] memory datasInicio = new string[](ids.length);
        string[] memory datasFim = new string[](ids.length);
        string[] memory status = new string[](ids.length);
        address[] memory owners = new address[](ids.length);

        for (uint i = 0; i < ids.length; i++) {
            (idsLicitacoes[i], titulos[i], codigos[i], datasInicio[i], datasFim[i], status[i], owners[i]) = licitacaoInfo(i);
        }

        return (idsLicitacoes, titulos, codigos, datasInicio, datasFim, status, owners);
    }

    function adicionarOferta(uint _empresaId, uint _licitacaoId, string memory _data, uint _valor) public {

        require(_licitacaoId >= 0, "Licitação é obrigatório");
        require(_empresaId >= 0, "Empresa é obrigatório");
        require(_valor > 0, "Informe uma valor válido");
        require(bytes(_data).length == 10, "Informe uma data 05/08/2020");
        
        ofertas[ofertaId] = Oferta(ofertaId, _empresaId, _licitacaoId, _data, _valor, msg.sender);
        ofertasIds.push(ofertaId);
        ofertaId++;
        emit ofertaRegistered(ofertaId - 1, "Oferta cadastrada com sucesso");
    }

    function alterarOferta(uint _id, uint _empresaId, uint _licitacaoId, string memory _data, uint _valor) public {

        require(_licitacaoId >= 0, "Licitação é obrigatório");
        require(_empresaId >= 0, "Empresa é obrigatório");
        require(_valor > 0, "Informe uma valor válido");
        require(bytes(_data).length == 10, "Informe uma data 05/08/2020");
        
        Oferta storage oferta = ofertas[_id];

        oferta.empresaId = _empresaId;
        oferta.licitacaoId = _licitacaoId;
        oferta.data = _data;
        oferta.valor = _valor;

        emit ofertaUpdated(_id, "Oferta atualizada com successo");
    }

    function ofertaInfo(uint _id) public view
        returns(
            uint,
            Empresa memory,
            Licitacao memory,
            string memory,
            uint,
            address
        ) {

            Oferta memory oferta = ofertas[_id];

            return (
                oferta.id,
                empresas[oferta.empresaId],
                licitacoes[oferta.licitacaoId],
                oferta.data,
                oferta.valor,
                oferta.owner
            );
    }

    function listarOfertas() public view returns(
        uint[] memory, Empresa[] memory, Licitacao[] memory, string[] memory, uint[] memory, address[] memory) {

        uint[] memory ids = ofertasIds;

        uint[] memory idsOfertas = new uint[](ids.length);
        Licitacao[] memory licit = new Licitacao[](ids.length);
        Empresa[] memory emp = new Empresa[](ids.length);
        string[] memory datas = new string[](ids.length);
        uint[] memory valores = new uint[](ids.length);
        address[] memory owners = new address[](ids.length);

        for (uint i = 0; i < ids.length; i++) {
            (idsOfertas[i], emp[i], licit[i], datas[i], valores[i], owners[i]) = ofertaInfo(i);
        }

        return (idsOfertas, emp, licit, datas, valores, owners);
    }

}