window.addEventListener("load", function() {

    listarLicitacoes();
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
                let newRow = $("<tr>");
                let cols = "";
                let titulo = licitacoes[i].titulo;
                let codigo = licitacoes[i].codigo;
                let dataInicio = licitacoes[i].dataInicio;
                let dataFim = licitacoes[i].dataFim;
                let status = licitacoes[i].status;

                cols += `<td> ${codigo} </td>`;
                cols += `<td> ${titulo} </td>`;
                cols += `<td> ${dataInicio} </td>`;
                cols += `<td> ${dataFim} </td>`;
                cols += `<td> ${status} </td>`;
                cols += `<td align="center"> 
                    <span style="font-size: 1em; color: Dodgerblue; cursor: pointer; ">
                        <a href="/editarLicitacao?id=${licitacoes[i].id}"><i class="fas fa-edit"></i></a>
                    </span>
                </td>`
                
                newRow.append(cols);
                $("#licitacoes-table").append(newRow);
            }
            
        } else {
            alert("Erro ao resgatar licitacoes do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}