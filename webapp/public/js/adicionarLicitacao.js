window.addEventListener("load", function() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    licitacaoId = parseInt(url.searchParams.get("id"), 10);
    console.log(licitacaoId);

    if(licitacaoId.toString() == 'NaN'){
        // restaga formulário de produtos
        let form = document.getElementById("formLicitacao");

        // adiciona uma função para
        // fazer o login quando o 
        // formulário for submetido
        form.addEventListener('submit', adicionarLicitacao);
    }
})

function adicionarLicitacao() {

    // previne a página de ser recarregada
    event.preventDefault();

    $('#load').attr('disabled', 'disabled');

    // resgata os dados do formulário
    let titulo = $("#titulo").val();
    let codigo = $("#codigo").val();
    let dataInicio = $("#dataInicio").val();
    let dataFim = $("#dataFim").val();
    let status = $("#status").val();

    // envia a requisição para o servidor
    $.post("/adicionarLicitacao", {titulo: titulo, codigo: codigo, dataInicio: dataInicio, dataFim: dataFim, status: status}, function(res) {
        
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> licitacao.js -> addLicitacao: ***", res.msg);            
            // limpa dados do formulário
            $("#titulo").val("");
            $("#codigo").val("");
            $("#dataInicio").val("");
            $("#dataFim").val("");
            $("#status").val("");

            // remove atributo disabled do botao
            $('#load').attr('disabled', false);

            alert("Sua licitacao foi cadastrada com sucesso");
        } else {
            alert("Erro ao cadastrar licitacao. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
    
}