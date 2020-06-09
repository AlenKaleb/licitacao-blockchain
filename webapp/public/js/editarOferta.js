let ofertaId, razaoSocial, cnpj, telefone;

window.addEventListener('load', () => {
    console.log("*** editing oferta page loaded ");

    let url_string = window.location.href;
    let url = new URL(url_string);
    ofertaId = parseInt(url.searchParams.get("id"), 10);

    if(ofertaId >= 0){
        
        let form = document.getElementById("formOferta");

        // adiciona uma função para
        // fazer o login quando o 
        // formulário for submetido
        form.addEventListener('submit', alterarOferta);

        getOferta(ofertaId);
    }
});

function getOferta(id) {
    console.log("*** Getting Ofertas ***");

    $.get("/getOferta", {id: id}, function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> oferta.js -> getOferta: ***", res.msg);

            if (res.msg === "no ofertas yet") {
                return;
            }

            let oferta = res.oferta;

            $('#licitacaoId').val(oferta.licitacaoId);
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
    let licitacaoId = $("#licitacaoId").val();
    let data = $("#data").val();
    let valor = $("#valor").val();

    // envia a requisição para o servidor
    $.post("/alterarOferta", {ofertaId, licitacaoId, data, valor}, function(res) {
    
        console.log(res);
        // verifica resposta do servidor
        if (!res.error) {
            console.log("*** Views -> js -> ofertas.js -> editarOferta: ***", res.msg);            
            // limpa dados do formulário
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