window.addEventListener("load", function() {

    listarOfertas();
})

function listarOfertas() {
    console.log("*** Getting Ofertas ***");

    $.get("/listarOfertas", function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> ofertas.js -> listarOfertas: ***", res.msg);

            if (res.msg === "no ofertas yet") {
                return;
            }

            let ofertas = res.ofertas;

            for (let i = 0; i < ofertas.length; i++) {
                let licitacao = getLicitacao(ofertas[i].licitacaoId);
                let newRow = $("<tr>");
                let cols = "";
                let licitacaoTitulo = `${licitacao.codigo} - ${licitacao.titulo}`;
                let data = ofertas[i].data;
                let valor = ofertas[i].valor;

                cols += `<td> ${licitacaoTitulo} </td>`;
                cols += `<td> ${data} </td>`;
                cols += `<td> ${valor.substring(1, 10)} </td>`;
                cols += `<td align="center"> 
                    <span style="font-size: 1em; color: Dodgerblue; cursor: pointer; ">
                        <a href="/editarOferta?id=${ofertas[i].id}"><i class="fas fa-edit"></i></a>
                    </span>
                </td>`
                
                newRow.append(cols);
                $("#ofertas-table").append(newRow);
            }
            
        } else {
            alert("Erro ao resgatar ofertas do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}

function getLicitacao(id) {
    console.log("*** Getting Licitacoes ***");

    $.get("/getLicitacao", {id: id}, function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> licitacao.js -> getLicitacao: ***", res.msg);

            if (res.msg === "no licitacoes yet") {
                return;
            }

            return res.licitacao;

            // $("#titulo").val(licitacao.titulo);
            // $("#codigo").val(licitacao.codigo);
            // $("#dataInicio").val(licitacao.dataInicio);
            // $("#dataFim").val(licitacao.dataFim);
            // $("#status").val(licitacao.status);

            
        } else {
            alert("Erro ao resgatar licitacoes do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}