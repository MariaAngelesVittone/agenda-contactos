import Swal, { SweetAlertOptions } from 'sweetalert2';

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

async function ask(options: SweetAlertOptions, confirmButton?: string): Promise<boolean> {
  const { isConfirmed } = await Swal.fire({
    ...options,
    showCancelButton: true,
    reverseButtons: true,
    focusCancel: true,
    buttonsStyling: false,
    customClass: {
      popup: 'confirm-popup',
      confirmButton,
      cancelButton: 'secondary',
    },
  });
  return isConfirmed;
}

export function confirmDelete(name: string): Promise<boolean> {
  return ask(
    {
      icon: 'warning',
      title: `Delete ${name}?`,
      text: 'This action cannot be undone.',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    },
    'danger',
  );
}

export function confirmLogout(): Promise<boolean> {
  return ask({
    icon: 'question',
    title: 'Log out?',
    text: 'Are you sure you want to leave?',
    confirmButtonText: 'Log out',
    cancelButtonText: 'Stay',
  });
}
