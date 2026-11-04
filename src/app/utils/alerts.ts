import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export function showToast(title: string, icon: 'success' | 'error' = 'success'): void {
  Toast.fire({ icon, title });
}

export async function confirmDelete(name: string): Promise<boolean> {
  const { isConfirmed } = await Swal.fire({
    icon: 'warning',
    title: `Delete ${name}?`,
    text: 'This action cannot be undone.',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusCancel: true,
    buttonsStyling: false,
    customClass: {
      popup: 'confirm-popup',
      confirmButton: 'danger',
      cancelButton: 'secondary',
    },
  });
  return isConfirmed;
}
