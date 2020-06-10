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
                let newRow = $("<tr>");
                let cols = "";
                let licitacaoTitulo = `${ofertas[i].licitacaoId[2]} - ${ofertas[i].licitacaoId[1]}`;
                let empresaRazao = `${ofertas[i].empresaId[1]} - ${ofertas[i].empresaId[2]}`;
                let data = ofertas[i].data;
                let valor = ofertas[i].valor;

                cols += `<td> ${empresaRazao} </td>`;
                cols += `<td> ${licitacaoTitulo} </td>`;
                cols += `<td> ${data} </td>`;
                cols += `<td> ${valor} </td>`;
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