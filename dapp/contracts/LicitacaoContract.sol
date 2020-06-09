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

        empresas[empresaId] = Empresa(empresaId, _razaoSocial, _cnpj, _telefone, msg.sender);
        empresasIds.push(empresaId);
        empresaId++;
        emit empresaRegistered(empresaId - 1, "Empresa cadastrada com sucesso");
    }

    function alterarEmpresa(uint _id, string memory _razaoSocial, uint _cnpj, string memory _telefone) public {

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

        licitacoes[licitacaoId] = Licitacao(licitacaoId, _titulo, _codigo, _dataInicio, _dataFim, _status, msg.sender);
        licitacoesIds.push(licitacaoId);
        licitacaoId++;
        
        emit licitacaoRegistered(licitacaoId - 1, "Licitação cadastrada com sucesso");
    }

    function alterarLicitacao(
        uint _id, string memory _titulo, uint _codigo, string memory _dataInicio, string memory _dataFim, string memory _status
        ) public {

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

    function adicionarOferta(uint _licitacaoId, string memory _data, uint _valor) public {

        ofertas[ofertaId] = Oferta(ofertaId, _licitacaoId, _data, _valor, msg.sender);
        ofertasIds.push(ofertaId);
        ofertaId++;
        emit ofertaRegistered(ofertaId - 1, "Oferta cadastrada com sucesso");
    }

    function alterarOferta(uint _id, uint _licitacaoId, string memory _data, uint _valor) public {

        Oferta storage oferta = ofertas[_id];

        oferta.licitacaoId = _licitacaoId;
        oferta.data = _data;
        oferta.valor = _valor;

        emit ofertaUpdated(_id, "Oferta atualizada com successo");
    }

    function ofertaInfo(uint _id) public view
        returns(
            uint,
            uint,
            string memory,
            uint,
            address
        ) {

            Oferta memory oferta = ofertas[_id];

            return (
                oferta.id,
                oferta.licitacaoId,
                oferta.data,
                oferta.valor,
                oferta.owner
            );
    }

    function listarOfertas() public view returns(uint[] memory, uint[] memory, string[] memory, uint[] memory, address[] memory) {

        uint[] memory ids = ofertasIds;

        uint[] memory idsOfertas = new uint[](ids.length);
        uint[] memory licitacoesIds = new uint[](ids.length);
        string[] memory datas = new string[](ids.length);
        uint[] memory valores = new uint[](ids.length);
        address[] memory owners = new address[](ids.length);

        for (uint i = 0; i < ids.length; i++) {
            (idsOfertas[i], licitacoesIds[i], datas[i], valores[i], owners[i]) = ofertaInfo(i);
        }

        return (idsOfertas, licitacoesIds, datas, valores, owners);
    }

}