// área orçamento
function alerta(){
    Swal.fire({
        title: "Qual é o valor que deseja adcionar?",
        showDenyButton: true,
        confirmButtonText: "Entrada",
        denyButtonText: `Saida`
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Saved!", "", "success");
        }
    });
}
// fim área orçamento