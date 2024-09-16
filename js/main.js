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

          // Selecionando o elemento do valor total
          const valorInicialElement = document.querySelector('#idTotal h5');
          let valorInicialTotal = parseFloat(valorInicialElement.innerHTML.replace('R$', '').replace(',', '.').trim());
          let valorFinalTotal = valorInicialTotal;

          if (tipoObtido === "entrada") {
              valorFinalTotal += valorObtido;

              const valorInicialEntradaElement = document.querySelector('#idEntradas h5');
              let valorInicialEntrada = parseFloat(valorInicialEntradaElement.innerHTML.replace('R$', '').replace(',', '.').trim());
              let valorFinalEntrada = valorInicialEntrada + valorObtido;

              valorInicialEntradaElement.innerHTML = `R$ ${valorFinalEntrada.toFixed(2)}`;

          } else if (tipoObtido === "saida") {
              valorFinalTotal -= valorObtido;

              const valorInicialSaidaElement = document.querySelector('#idSaidas h5');
              let valorInicialSaida = parseFloat(valorInicialSaidaElement.innerHTML.replace('R$', '').replace(',', '.').trim());
              let valorFinalSaida = valorInicialSaida + valorObtido;

              valorInicialSaidaElement.innerHTML = `R$ ${valorFinalSaida.toFixed(2)}`;
          }

          // Adiciona a nova linha ao HTML da tabela
          const transacoesTable = document.querySelector('#transacoes tbody');
          transacoesTable.innerHTML += `
              <tr>
                  <td>${tipoObtido}</td>
                  <td>R$ ${valorObtido.toFixed(2)}</td>
                  <td>${dataObtida}</td>
                  <td><button class="botaoExcluir"><i class="fa-solid fa-circle-minus" style="color: #ff0000;"></i></button></td>
              </tr>
          `;

          // Atualiza o valor total
          valorInicialElement.innerHTML = `R$ ${valorFinalTotal.toFixed(2)}`;

          // Ajusta a cor do total
          if (valorFinalTotal > 0) {
              valorInicialElement.style.color = 'green';
          } else if (valorFinalTotal < 0) {
              valorInicialElement.style.color = 'red';
          } else{
            valorInicialElement.style.color = 'black';
          }

          
          const botoesExcluir = document.querySelectorAll('.botaoExcluir');
          for (let i = 0; i < botoesExcluir.length; i++) {
              botoesExcluir[i].addEventListener('click', function() {
                // Aparece alert se deseja cancelar
                Swal.fire({
                  title: "Você realmente deseja excluir?",
                  icon: "info",
                  showDenyButton: true,
                  confirmButtonText: "Cancelar",
                  denyButtonText: `Excluir`
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire("Cancelado!", "", "error");
                  } else if (result.isDenied) {
                    Swal.fire("Excluido!", "", "success");

                    
                    const row = this.parentElement.parentElement; 
                    const valorObtido = parseFloat(row.children[1].textContent.replace('R$', '').trim());
                    const tipoObtido = row.children[0].textContent;

                    // Atualiza os valores de entrada, saída e total ao excluir a linha
                    if (tipoObtido === "entrada") {
                      let valorAtualEntrada = parseFloat(document.querySelector('#idEntradas h5').innerHTML.replace('R$', '').replace(',', '.').trim());
                      valorAtualEntrada -= valorObtido;
                      document.querySelector('#idEntradas h5').innerHTML = `R$ ${valorAtualEntrada.toFixed(2)}`;
                    } else if (tipoObtido === "saida") {
                      let valorAtualSaida = parseFloat(document.querySelector('#idSaidas h5').innerHTML.replace('R$', '').replace(',', '.').trim());
                      valorAtualSaida -= valorObtido;
                      document.querySelector('#idSaidas h5').innerHTML = `R$ ${valorAtualSaida.toFixed(2)}`;
                    }
                    
                    let valorAtualTotal = parseFloat(document.querySelector('#idTotal h5').innerHTML.replace('R$', '').replace(',', '.').trim());
                    valorAtualTotal = tipoObtido === 'entrada' ? valorAtualTotal - valorObtido : valorAtualTotal + valorObtido;
                    document.querySelector('#idTotal h5').innerHTML = `R$ ${valorAtualTotal.toFixed(2)}`;
                    
                    // Ajusta a cor do total
                    if (valorAtualTotal > 0) {
                      document.querySelector('#idTotal h5').style.color = 'green';
                    } else if (valorAtualTotal < 0) {
                      document.querySelector('#idTotal h5').style.color = 'red';
                    } else{
                      document.querySelector('#idTotal h5').style.color = 'black';
                    }
                    
                    // Remove a linha da tabela
                    row.remove();
                  }
                });
                  });
          }
      }
  });
}


// fim area orçamento