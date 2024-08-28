// área orçamento
function alerta(){
    Swal.fire({
        title: 'Registro de Transação',
        html: `
            <label for="tipoTransacao">Tipo de Transação:</label>
            <select id="tipoTransacao" class="swal2-input">
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
            </select>
            <label for="valorTransacao">Valor:</label>
            <input type="number" id="valorTransacao" class="swal2-input" placeholder="Digite o valor">
            <label for="dataTransacao">Data:</label>
            <input type="date" id="dataTransacao" class="swal2-input">
        `,
    })
}
// fim área orçamento