// área orçamento
function alerta() {
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
          const tipoObtido = result.value.tipo; 
          const dataObtida = result.value.data; 
          let valorObtido = parseFloat(result.value.valor);
          //area total
          const valorInicialElement = document.querySelector('#idTotal h5');
          let valorInicialTotal = parseFloat(valorInicialElement.innerHTML.replace('R$', '').replace(',', '.').trim());
          let valorFinalTotal = valorInicialTotal;

          if (tipoObtido === "entrada") {
              valorFinalTotal += valorObtido;
              //area de entradas 
              const valorInicialEntradaElement = document.querySelector('#idEntradas h5');
              let valorInicialEntrada = parseFloat(valorInicialEntradaElement.innerHTML.replace('R$', '').replace(',', '.').trim());
              let valorFinalEntrada = valorInicialEntrada;

              valorFinalEntrada += valorObtido;

              valorInicialEntradaElement.innerHTML = `R$ ${valorFinalEntrada.toFixed(2)}`;

          } else if (tipoObtido === "saida") {
              valorFinalTotal -= valorObtido;
              //area saidas
              const valorInicialSaidaElement = document.querySelector('#idSaidas h5');
              let valorInicialSaida = parseFloat(valorInicialSaidaElement.innerHTML.replace('R$', '').replace(',', '.').trim());
              let valorFinalSaida = valorInicialSaida;

              valorFinalSaida += valorObtido;

              valorInicialSaidaElement.innerHTML = `R$ ${valorFinalSaida.toFixed(2)}`;
          }

          document.querySelector('#transacoes tbody').innerHTML += `
              <tr>
                  <td>${tipoObtido}</td>
                  <td>R$ ${valorObtido.toFixed(2)}</td>
                  <td>${dataObtida}</td>
              </tr>
          `;

          
          valorInicialElement.innerHTML = `R$ ${valorFinalTotal.toFixed(2)}`; 
          
      }
  });
}
// fim area orçamento