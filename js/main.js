// área orçamento

// Função para carregar as transações do localStorage
function carregarTransacoes() {
  const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
  transacoes.forEach(transacao => adicionarTransacaoNaTabela(transacao.tipo, transacao.valor, transacao.data));
  atualizarTotais();
}

// Função para adicionar transação na tabela e atualizar os totais
function adicionarTransacaoNaTabela(tipo, valor, data) {
  const transacoesTable = document.querySelector('#transacoes tbody');
  const row = document.createElement('tr');

  row.innerHTML = `
      <td>${tipo}</td>
      <td>R$ ${valor.toFixed(2)}</td>
      <td>${data}</td>
      <td>
          <button class="botaoEditar"><i class="fa-solid fa-pen" style="color: #0000ff;"></i></button>
          <button class="botaoExcluir"><i class="fa-solid fa-circle-minus" style="color: #ff0000;"></i></button>
      </td>
  `;

  transacoesTable.appendChild(row);
  adicionarEventos(row, tipo, valor, data);
}

// Função para adicionar eventos de edição e exclusão
function adicionarEventos(row, tipo, valor, data) {
  const botoesExcluir = row.querySelector('.botaoExcluir');
  const botoesEditar = row.querySelector('.botaoEditar');

  // Botão Excluir
  botoesExcluir.addEventListener('click', function () {
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
              Swal.fire('<p class="forms">Excluído!</p>', "", "success");
              
              const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
              const index = transacoes.findIndex(t => t.tipo === tipo && t.valor === valor && t.data === data);
              transacoes.splice(index, 1);
              salvarTransacoes(transacoes);
              
              atualizarTotais();
              row.remove();
          }
      });
  });

  // Botão Editar
  botoesEditar.addEventListener('click', function () {
      Swal.fire({
          title: '<p class="forms">Edite os dados:</p>',
          html: `
          <form class="forms">
              <label for="tipo">Tipo:</label>
              <select id="tipo">
                  <option value="Entrada" ${tipo === 'Entrada' ? 'selected' : ''}>Entrada</option>
                  <option value="Saida" ${tipo === 'Saida' ? 'selected' : ''}>Saída</option>
              </select><br><br>
              
              <label for="valor">Valor:</label>
              <input type="number" id="valor" value="${valor}"><br><br>
              
              <label for="data">Data:</label>
              <input type="date" id="data" value="${data}">
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
              if (valorEditado < 0) {
                  Swal.showValidationMessage('<p class="forms">Por favor, preencha um valor maior que 0!</p>');
              }
              return { tipoEditado, valorEditado, dataEditada };
          }
      }).then((result) => {
          if (result.isConfirmed) {
              const tipoEditado = result.value.tipoEditado;
              const valorEditado = parseFloat(result.value.valorEditado);
              const dataEditada = result.value.dataEditada;

              const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
              const index = transacoes.findIndex(t => t.tipo === tipo && t.valor === valor && t.data === data);
              
              // Atualiza o array de transações
              transacoes[index] = { tipo: tipoEditado, valor: valorEditado, data: dataEditada };
              salvarTransacoes(transacoes);

              // Atualiza a tabela
              row.children[0].textContent = tipoEditado;
              row.children[1].textContent = `R$ ${valorEditado.toFixed(2)}`;
              row.children[2].textContent = dataEditada;

              atualizarTotais();
          }
      });
  });
}

// Função para atualizar os totais e o localStorage
function atualizarTotais() {
  const valorInicialElemento = document.querySelector('#idTotal h5');
  const valorInicialEntradaElemento = document.querySelector('#idEntradas h5');
  const valorInicialSaidaElemento = document.querySelector('#idSaidas h5');

  let valorTotal = 0;
  let valorEntrada = 0;
  let valorSaida = 0;

  const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
  transacoes.forEach(transacao => {
      if (transacao.tipo === "Entrada") {
          valorEntrada += transacao.valor;
      } else if (transacao.tipo === "Saida") {
          valorSaida += transacao.valor;
      }
  });

  valorTotal = valorEntrada - valorSaida;

  valorInicialEntradaElemento.innerHTML = `R$ ${valorEntrada.toFixed(2)}`;
  valorInicialSaidaElemento.innerHTML = `R$ ${valorSaida.toFixed(2)}`;
  valorInicialElemento.innerHTML = `R$ ${valorTotal.toFixed(2)}`;

  // Ajusta a cor do total
  if (valorTotal > 0) {
      valorInicialElemento.style.color = 'green';
  } else if (valorTotal < 0) {
      valorInicialElemento.style.color = 'red';
  } else {
      valorInicialElemento.style.color = 'black';
  }
}

// Função para salvar transações no localStorage
function salvarTransacoes(transacoes) {
  localStorage.setItem('transacoes', JSON.stringify(transacoes));
}

// Atualiza a função alerta
function alerta() {
  Swal.fire({
      title: '<p class="forms">Informe os dados:</p>',
      html: `
      <form class="forms">
          <label for="tipo">Tipo:</label>
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

          if (!valor || !data) {
              Swal.showValidationMessage('<p class="forms">Por favor, preencha todos os campos!</p>');
          }
          if (valor < 0) {
              Swal.showValidationMessage('<p class="forms">Por favor, preencha um valor maior que 0!</p>');
          }
          return { tipo, valor, data };
      }
  }).then((result) => {
      if (result.isConfirmed) {
          const tipoObtido = result.value.tipo;
          const dataObtida = result.value.data;
          const valorObtido = parseFloat(result.value.valor);

          // Adiciona transação ao localStorage
          const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
          transacoes.push({ tipo: tipoObtido, valor: valorObtido, data: dataObtida });
          salvarTransacoes(transacoes);

          // Atualiza a tabela e os totais
          adicionarTransacaoNaTabela(tipoObtido, valorObtido, dataObtida);
          atualizarTotais();
      }
  });
}

// Chamar a função para carregar as transações ao inicializar a página
document.addEventListener('DOMContentLoaded', carregarTransacoes);

// fim area orçamento