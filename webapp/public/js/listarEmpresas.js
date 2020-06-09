window.addEventListener("load", function() {

    listarEmpresas();
})

function listarEmpresas() {
    console.log("*** Getting Empresas ***");

    $.get("/listarEmpresas", function(res) {
        
        if (!res.error) {
            console.log("*** Views -> js -> empresas.js -> listarEmpresas: ***", res.msg);

            if (res.msg === "no products yet") {
                return;
            }

            let empresas = res.empresas;

            for (let i = 0; i < empresas.length; i++) {
                let newRow = $("<tr>");
                let cols = "";
                let razaoSocial = empresas[i].razaoSocial;
                let cnpj = empresas[i].cnpj;
                let telefone = empresas[i].telefone;

                cols += `<td> ${razaoSocial} </td>`;
                cols += `<td> ${cnpj} </td>`;
                cols += `<td> ${telefone.substring(1, 10)} </td>`;
                cols += `<td align="center"> 
                    <span style="font-size: 1em; color: Dodgerblue; cursor: pointer; ">
                        <a href="/editarEmpresa?id=${empresas[i].id}"><i class="fas fa-edit"></i></a>
                    </span>
                </td>`
                
                newRow.append(cols);
                $("#empresas-table").append(newRow);
            }
            
        } else {
            alert("Erro ao resgatar empresas do servidor. Por favor, tente novamente mais tarde. " + res.msg);
        }

    })
}