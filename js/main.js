// área orçamento
function alerta(){
    Swal.fire({
        title: 'Informe os dados:',
        html: `
          <label for="tipo">Tipo:</label>
          <select id="tipo">
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select><br><br>
          
          <label for="valor">Valor:</label>
          <input type="number" id="valor"><br><br>
          
          <label for="data">Data:</label>
          <input type="date" id="data">
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const tipo = Swal.getPopup().querySelector('#tipo').value;
          const valor = Swal.getPopup().querySelector('#valor').value;
          const data = Swal.getPopup().querySelector('#data').value;

          if (!valor || !data) {
            Swal.showValidationMessage('Por favor, preencha todos os campos!');
          }
  
          return { tipo, valor, data };
        }
      }).then((result) => {
        if (result.isConfirmed) {
            tipoObtido = result.value.tipo; 
            dataObtida = result.value.data; 
            valorObtido = result.value.valor; 
            valorInicial = document.getElementsByClassName(".orcamento h5")
            var x = valorObtido + valorInicial
            document.querySelector('#transacoes tbody').innerHTML += `
                <tr>
                    <td>${tipoObtido}</td>
                    <td>R$ ${valorObtido}</td>
                    <td>${dataObtida}</td>
                </tr>
            `;
            document.querySelector('.orcamento h5').innerHTML = `
                R$ ${x}
            `;
        }
    });
}
// fim area orçamento
// area financiamento


