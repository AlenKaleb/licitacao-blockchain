window.addEventListener("load", function() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    ofertaId = parseInt(url.searchParams.get("id"), 10);

    if(ofertaId.toString() == 'NaN'){

        listarEmpresas();
        listarLicitacoes();
        
        let form = document.getElementById("formOferta");

        // adiciona uma função para
        // fazer o login quando o 
        // formulário for submetido
        form.addEventListener('submit', adicionarOferta);
    }
})

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

function adicionarOferta() {

    // previne a página de ser recarregada
    event.preventDefault();

    $('#load').attr('disabled', 'disabled');

    // resgata os dados do formulário
    let empresaId = $("#empresaId").val();
    let licitacaoId = $("#licitacaoId").val();
    let data = $("#data").val();
    let valor = $("#valor").val();

    // envia a requisição para o servidor
    $.post("/adicionarOferta", {empresaId: empresaId, licitacaoId: licitacaoId, data: data, valor: valor}, function(res) {
        
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> ofertas.js -> addOferta: ***", res.msg);            
            // limpa dados do formulário
            $("#empresaId").val("");
            $("#licitacaoId").val("");
            $("#data").val("");
            $("#valor").val("");

            // remove atributo disabled do botao
            $('#load').attr('disabled', false);

            alert("Sua oferta foi cadastrada com sucesso");
        } else {
            alert("Erro ao cadastrar oferta. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
    
}