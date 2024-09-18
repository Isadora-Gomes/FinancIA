// área orçamento
function alerta() {
  Swal.fire({
      title: '<p class="forms">Informe os dados:<p>',
      html: `
      <form class="forms">
        <label for="tipo" >Tipo:</label>
        <select id="tipo">
          <option value="Entrada">Entrada</option>
          <option value="Saida">Saída</option>
        </select><br><br>
        
        <label for="valor">Valor:</label>
        <input type="number" id="valor"><br><br>
        
        <label for="data">Data:</label>
        <input type="date" id="data">
      </form>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const tipo = Swal.getPopup().querySelector('#tipo').value;
        const valor = Swal.getPopup().querySelector('#valor').value;
        const data = Swal.getPopup().querySelector('#data').value;

        if (!valor || !data ) {
          Swal.showValidationMessage('<p class="forms">Por favor, preencha todos os campos!</p>');
        }
        if (valor<0 ) {
          Swal.showValidationMessage('<p class="forms">Por favor, preencha um valor maior que 0!</p>');
        }
        return { tipo, valor, data };
      }
  }).then((result) => {
      if (result.isConfirmed) {
          const tipoObtido = result.value.tipo; 
          const dataObtida = result.value.data; 
          let valorObtido = parseFloat(result.value.valor);

          // Selecionando o elemento do valor total
          const valorInicialElemento = document.querySelector('#idTotal h5');
          let valorInicialTotal = parseFloat(valorInicialElemento.innerHTML.replace('R$', '').replace(',', '.').trim());
          let valorFinalTotal = valorInicialTotal;

          if (tipoObtido === "Entrada") {
              valorFinalTotal += valorObtido;

              const valorInicialEntradaElemento = document.querySelector('#idEntradas h5');
              let valorInicialEntrada = parseFloat(valorInicialEntradaElemento.innerHTML.replace('R$', '').replace(',', '.').trim());
              let valorFinalEntrada = valorInicialEntrada + valorObtido;

              valorInicialEntradaElemento.innerHTML = `R$ ${valorFinalEntrada.toFixed(2)}`;

          } else if (tipoObtido === "Saida") {
              valorFinalTotal -= valorObtido;

              const valorInicialSaidaElemento = document.querySelector('#idSaidas h5');
              let valorInicialSaida = parseFloat(valorInicialSaidaElemento.innerHTML.replace('R$', '').replace(',', '.').trim());
              let valorFinalSaida = valorInicialSaida + valorObtido;

              valorInicialSaidaElemento.innerHTML = `R$ ${valorFinalSaida.toFixed(2)}`;
          }

          // Adiciona a nova linha ao HTML da tabela
          const transacoesTable = document.querySelector('#transacoes tbody');
          transacoesTable.innerHTML += `
              <tr>
                  <td>${tipoObtido}</td>
                  <td>R$ ${valorObtido.toFixed(2)}</td>
                  <td>${dataObtida}</td>
                  <td>
                      <button class="botaoEditar"><i class="fa-solid fa-pen" style="color: #0000ff;"></i></button> <!-- Linha modificada: botão de edição adicionado -->
                      <button class="botaoExcluir"><i class="fa-solid fa-circle-minus" style="color: #ff0000;"></i></button>
                  </td>
              </tr>
          `;

          // Atualiza o valor total
          valorInicialElemento.innerHTML = `R$ ${valorFinalTotal.toFixed(2)}`;

          // Ajusta a cor do total
          if (valorFinalTotal > 0) {
              valorInicialElemento.style.color = 'green';
          } else if (valorFinalTotal < 0) {
              valorInicialElemento.style.color = 'red';
          } else{
            valorInicialElemento.style.color = 'black';
          }

          
          const botoesExcluir = document.querySelectorAll('.botaoExcluir');
          const botoesEditar = document.querySelectorAll('.botaoEditar');

          //botão Excluir
          for (let i = 0; i < botoesExcluir.length; i++) {
              botoesExcluir[i].addEventListener('click', function() {
                // Aparece alert se deseja cancelar
                Swal.fire({
                  title: '<p class="forms">Você realmente deseja excluir?</p>',
                  icon: "info",
                  showDenyButton: true,
                  confirmButtonText: "Cancelar",
                  denyButtonText: `Excluir`
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire('<p class="forms"> Cancelado!</p>', "", "error");
                  } else if (result.isDenied) {
                    Swal.fire('<p class="forms">Excluido!</p>', "", "success");

                    
                    const row = this.parentElement.parentElement; 
                    const valorObtido = parseFloat(row.children[1].textContent.replace('R$', '').trim());
                    const tipoObtido = row.children[0].textContent;

                    // Atualiza os valores de entrada, saída e total ao excluir a linha
                    if (tipoObtido === "Entrada") {
                      let valorAtualEntrada = parseFloat(document.querySelector('#idEntradas h5').innerHTML.replace('R$', '').replace(',', '.').trim());
                      valorAtualEntrada -= valorObtido;
                      document.querySelector('#idEntradas h5').innerHTML = `R$ ${valorAtualEntrada.toFixed(2)}`;
                    } else if (tipoObtido === "Saida") {
                      let valorAtualSaida = parseFloat(document.querySelector('#idSaidas h5').innerHTML.replace('R$', '').replace(',', '.').trim());
                      valorAtualSaida -= valorObtido;
                      document.querySelector('#idSaidas h5').innerHTML = `R$ ${valorAtualSaida.toFixed(2)}`;
                    }
                    
                    let valorAtualTotal = parseFloat(document.querySelector('#idTotal h5').innerHTML.replace('R$', '').replace(',', '.').trim());
                    valorAtualTotal = tipoObtido === 'Entrada' ? valorAtualTotal - valorObtido : valorAtualTotal + valorObtido;
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
          for (let i = 0; i < botoesEditar.length; i++) { 
            botoesEditar[i].addEventListener('click', function() { 
              const row = this.parentElement.parentElement;
              const tipoOriginal = row.children[0].textContent;
              const valorOriginal = parseFloat(row.children[1].textContent.replace('R$', '').trim());
              const dataOriginal = row.children[2].textContent;
              console.log(valorOriginal)
              console.log(valorOriginal)

              Swal.fire({
                title: '<p class="forms">Edite os dados:</p>', 
                html: `
                <form class="forms">
                  <label for="tipo">Tipo:</label>
                  <select id="tipo">
                    <option value="Entrada" ${tipoOriginal === 'Entrada' ? 'selected' : ''}>Entrada</option>
                    <option value="Saida" ${tipoOriginal === 'Saida' ? 'selected' : ''}>Saída</option>
                  </select><br><br>
                  
                  <label for="valor">Valor:</label>
                  <input type="number" id="valor" value="${valorOriginal}"><br><br>
                  
                  <label for="data">Data:</label>
                  <input type="date" id="data" value="${dataOriginal}">
                </form>
                `,
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                  const tipoEditado = Swal.getPopup().querySelector('#tipo').value;
                  const valorEditado = parseFloat(Swal.getPopup().querySelector('#valor').value);
                  const dataEditada = Swal.getPopup().querySelector('#data').value;

                  if (!valorEditado || !dataEditada) {
                    Swal.showValidationMessage('<p class="forms">Por favor, preencha todos os campos!</p>');
                  }
                  if (valorEditado < 0 ) {
                    Swal.showValidationMessage('<p class="forms">Por favor, preencha um valor maior que 0!</p>');
                  }
                  return { tipoEditado, valorEditado, dataEditada };
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  const tipoEditado = result.value.tipoEditado;
                  const valorEditado = parseFloat(result.value.valorEditado);
                  const dataEditada = result.value.dataEditada;

                  let valorAtualTotal = parseFloat(document.querySelector('#idTotal h5').innerHTML.replace('R$', '').replace(',', '.').trim());

                  if (tipoOriginal === 'Entrada') {
                    let valorAtualEntrada = parseFloat(document.querySelector('#idEntradas h5').innerHTML.replace('R$', '').replace(',', '.').trim());
                    valorAtualEntrada -= valorOriginal;
                    document.querySelector('#idEntradas h5').innerHTML = `R$ ${valorAtualEntrada.toFixed(2)}`;
                    valorAtualTotal -= valorOriginal;
                  } else if (tipoOriginal === 'Saida') {
                    let valorAtualSaida = parseFloat(document.querySelector('#idSaidas h5').innerHTML.replace('R$', '').replace(',', '.').trim());
                    valorAtualSaida -= valorOriginal;
                    document.querySelector('#idSaidas h5').innerHTML = `R$ ${valorAtualSaida.toFixed(2)}`;
                    valorAtualTotal += valorOriginal;
                  }

                  if (tipoEditado === 'Entrada') {
                    let valorAtualEntrada = parseFloat(document.querySelector('#idEntradas h5').innerHTML.replace('R$', '').replace(',', '.').trim());
                    valorAtualEntrada += valorEditado;
                    document.querySelector('#idEntradas h5').innerHTML = `R$ ${valorAtualEntrada.toFixed(2)}`;
                    valorAtualTotal += valorEditado;
                  } else if (tipoEditado === 'Saida') {
                    let valorAtualSaida = parseFloat(document.querySelector('#idSaidas h5').innerHTML.replace('R$', '').replace(',', '.').trim());
                    valorAtualSaida += valorEditado;
                    document.querySelector('#idSaidas h5').innerHTML = `R$ ${valorAtualSaida.toFixed(2)}`;
                    valorAtualTotal -= valorEditado;
                  }

                  row.children[0].textContent = tipoEditado; 
                  row.children[1].textContent = `R$ ${valorEditado.toFixed(2)}`; 
                  row.children[2].textContent = dataEditada;

                  document.querySelector('#idTotal h5').innerHTML = `R$ ${valorAtualTotal.toFixed(2)}`;

                  if (valorAtualTotal > 0) {
                    document.querySelector('#idTotal h5').style.color = 'green';
                  } else if (valorAtualTotal < 0) {
                    document.querySelector('#idTotal h5').style.color = 'red';
                  } else {
                    document.querySelector('#idTotal h5').style.color = 'black';
                  }
                }
              });
            });
        }
    }
});
}

// fim area orçamento