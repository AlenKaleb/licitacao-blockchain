let ofertaId, razaoSocial, cnpj, telefone;

window.addEventListener('load', () => {
    console.log("*** editing oferta page loaded ");

    let url_string = window.location.href;
    let url = new URL(url_string);
    ofertaId = parseInt(url.searchParams.get("id"), 10);

    if(ofertaId || ofertaId.toString() == '0'){
        
        let form = document.getElementById("formOferta");

        // adiciona uma função para
        // fazer o login quando o 
        // formulário for submetido
        form.addEventListener('submit', alterarOferta);

        getOferta(ofertaId);
    }
});

function listarLicitacoes() {
    console.log("*** Getting Licitacoes ***");

    $.get("/listarLicitacoes", function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> licitacoes.js -> listarLicitacoes: ***", res.msg);

            if (res.msg === "no licitacoes yet") {
                return;
            }

            let licitacoes = res.licitacoes;

            for (let i = 0; i < licitacoes.length; i++) {
                let newRow = $("<option>");
                let id = licitacoes[i].id;
                let titulo = licitacoes[i].titulo;
                let codigo = licitacoes[i].codigo;

                newRow += `<option value="${id}"> ${titulo} - ${codigo} </option>`;
                
                $("#licitacaoId").append(newRow);
            }
            
        } else {
            alert("Erro ao resgatar licitacoes do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}

function listarEmpresas() {
    console.log("*** Getting Licitacoes ***");

    $.get("/listarEmpresas", function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> empresas.js -> listarEmpresas: ***", res.msg);

            if (res.msg === "no empresas yet") {
                return;
            }

            let empresas = res.empresas;

            for (let i = 0; i < empresas.length; i++) {
                let newRow = $("<option>");
                let id = empresas[i].id;
                let razaoSocial = empresas[i].razaoSocial;
                let cnpj = empresas[i].cnpj;

                newRow += `<option value="${id}"> ${razaoSocial} - ${cnpj} </option>`;
                
                $("#empresaId").append(newRow);
            }
            
        } else {
            alert("Erro ao resgatar empresas do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}

function getOferta(id) {
    console.log("*** Getting Ofertas ***");

    listarEmpresas();
    listarLicitacoes();

    $.get("/getOferta", {id: id}, function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> oferta.js -> getOferta: ***", res.msg);

            if (res.msg === "no ofertas yet") {
                return;
            }

            let oferta = res.oferta;

            console.log(oferta);

            $('#empresaId').val(oferta.empresaId[0]);
            $('#licitacaoId').val(oferta.licitacaoId[0]);
            $('#data').val(oferta.data);
            $('#valor').val(oferta.valor);

            
        } else {
            alert("Erro ao resgatar ofertas do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}

function alterarOferta(event) {
    event.preventDefault();
    console.log("*** Editing oferta: ", ofertaId);

    $('#load').attr('disabled', 'disabled');

    // resgata os dados do formulário
    let empresaId = $("#empresaId").val();
    let licitacaoId = $("#licitacaoId").val();
    let data = $("#data").val();
    let valor = $("#valor").val();

    // envia a requisição para o servidor
    $.post("/alterarOferta", {ofertaId, empresaId, licitacaoId, data, valor}, function(res) {
    
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> ofertas.js -> editarOferta: ***", res.msg);            
            // limpa dados do formulário
            $("#empresaId").val("");
            $("#licitacaoId").val("");
            $("#data").val("");
            $("#valor").val("");
            
            // remove atributo disabled do botao
            $('#load').attr('disabled', false);

            alert("Sua oferta foi atualizada com sucesso");
            window.location.href = "/ofertas";
        } else {
            alert("Erro ao atualizar oferta. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
}