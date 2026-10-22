import Swal from 'sweetalert2';

export async function confirmAction({
  title,
  text,
  confirmButtonText = 'Confirmar'
}) {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#b94732'
  });

  return result.isConfirmed;
}

export function showErrorAlert(message) {
  return Swal.fire({
    title: 'No se pudo completar la operación',
    text: message,
    icon: 'error',
    confirmButtonText: 'Entendido'
  });
}
