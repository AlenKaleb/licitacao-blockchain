let empresaId, razaoSocial, cnpj, telefone;

window.addEventListener('load', () => {
    console.log("*** editing empresa page loaded ");

    let url_string = window.location.href;
    let url = new URL(url_string);
    empresaId = parseInt(url.searchParams.get("id"), 10);

    if(empresaId || empresaId.toString() == '0'){
        
        let form = document.getElementById("formEmpresa");

        // adiciona uma função para
        // fazer o login quando o 
        // formulário for submetido
        form.addEventListener('submit', alterarEmpresa);

        getEmpresa(empresaId);
    }
});

function getEmpresa(id) {
    console.log("*** Getting Empresas ***");

    $.get("/getEmpresa", {id: id}, function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> empresa.js -> getEmpresa: ***", res.msg);

            if (res.msg === "no empresas yet") {
                return;
            }

            let empresa = res.empresa;

            $('#razaoSocial').val(empresa.razaoSocial);
            $('#cnpj').val(empresa.cnpj);
            $('#telefone').val(empresa.telefone);

            
        } else {
            alert("Erro ao resgatar empresas do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}

function alterarEmpresa(event) {
    event.preventDefault();
    console.log("*** Editing empresa: ", empresaId);

    $('#load').attr('disabled', 'disabled');

    // resgata os dados do formulário
    let razaoSocial = $("#razaoSocial").val();
    let cnpj = $("#cnpj").val();
    let telefone = $("#telefone").val();

    // envia a requisição para o servidor
    $.post("/alterarEmpresa", {empresaId, razaoSocial, cnpj, telefone}, function(res) {
    
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> empresas.js -> editarEmpresa: ***", res.msg);            
            // limpa dados do formulário
            $("#razaoSocial").val("");
            $("#cnpj").val("");
            $("#telefone").val("");
            
            // remove atributo disabled do botao
            $('#load').attr('disabled', false);

            alert("Sua empresa foi atualizada com sucesso");
            window.location.href = "/empresas";
        } else {
            alert("Erro ao atualizar empresa. Por favor, tente novamente mais tarde. " + res.msg);
        }

    });
}