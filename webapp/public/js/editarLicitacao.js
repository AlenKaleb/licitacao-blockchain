let licitacaoId, codigo, titulo, dataInicio, dataFim, status;

window.addEventListener('load', () => {
    console.log("*** editing licitacao page loaded ");

    let url_string = window.location.href;
    let url = new URL(url_string);
    licitacaoId = parseInt(url.searchParams.get("id"), 10);

    if(licitacaoId >= 0){
        
        let form = document.getElementById("formLicitacao");

        // adiciona uma função para
        // fazer o login quando o 
        // formulário for submetido
        form.addEventListener('submit', alterarLicitacao);

        getLicitacao(licitacaoId);
    }
});

function getLicitacao(id) {
    console.log("*** Getting Licitacoes ***");

    $.get("/getLicitacao", {id: id}, function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> licitacao.js -> getLicitacao: ***", res.msg);

            if (res.msg === "no licitacoes yet") {
                return;
            }

            let licitacao = res.licitacao;

            $("#titulo").val(licitacao.titulo);
            $("#codigo").val(licitacao.codigo);
            $("#dataInicio").val(licitacao.dataInicio);
            $("#dataFim").val(licitacao.dataFim);
            $("#status").val(licitacao.status);

            
        } else {
            alert("Erro ao resgatar licitacoes do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}

function alterarLicitacao(event) {
    event.preventDefault();
    console.log("*** Editing licitacao: ", licitacaoId);

    $('#load').attr('disabled', 'disabled');

    // resgata os dados do formulário
    let titulo = $("#titulo").val();
    let codigo = $("#codigo").val();
    let dataInicio = $("#dataInicio").val();
    let dataFim = $("#dataFim").val();
    let status = $("#status").val();

    // envia a requisição para o servidor
    $.post("/alterarLicitacao", {licitacaoId, titulo, codigo, dataInicio, dataFim, status}, function(res) {
    
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> licitacoes.js -> editarLicitacao: ***", res.msg);            
            // limpa dados do formulário
            $("#titulo").val("");
            $("#codigo").val("");
            $("#dataInicio").val("");
            $("#dataFim").val("");
            $("#status").val("");
            
            // remove atributo disabled do botao
            $('#load').attr('disabled', false);

            alert("Sua licitacao foi atualizada com sucesso");
            window.location.href = "/licitacoes";
        } else {
            alert("Erro ao atualizar licitacao. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
}