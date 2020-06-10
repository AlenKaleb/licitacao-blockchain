window.addEventListener("load", function() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    empresaId = parseInt(url.searchParams.get("id"), 10);

    this.console.log(empresaId.toString());

    if(empresaId.toString() == 'NaN'){
        // restaga formulário de produtos
        let form = document.getElementById("formEmpresa");

        // adiciona uma função para
        // fazer o login quando o 
        // formulário for submetido
        form.addEventListener('submit', adicionarEmpresa);
    }
})

function adicionarEmpresa() {

    // previne a página de ser recarregada
    event.preventDefault();

    $('#load').attr('disabled', 'disabled');

    // resgata os dados do formulário
    let razaoSocial = $("#razaoSocial").val();
    let cnpj = $("#cnpj").val();
    let telefone = $("#telefone").val();

    // envia a requisição para o servidor
    $.post("/adicionarEmpresa", {razaoSocial: razaoSocial, cnpj: cnpj, telefone: telefone}, function(res) {
        
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> empresas.js -> addEmpresa: ***", res.msg);            
            // limpa dados do formulário
            $("#razaoSocial").val("");
            $("#cnpj").val("");
            $("#telefone").val("");

            // remove atributo disabled do botao
            $('#load').attr('disabled', false);

            alert("Sua empresa foi cadastrada com sucesso");
        } else {
            alert("Erro ao cadastrar empresa. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
    
}