import { writable } from 'svelte/store';

/* --- global init --- */
export const isMobile = writable(false);

/* --- toast --- */
interface Toast {
	id: number;
	message: string;
}

export const toast = writable<Toast | null>(null);

let toastId = 0;

export function showToast(message: string, duration = 2000) {
	const id = ++toastId;
	toast.set({ id, message });
	setTimeout(() => {
		toast.update((current) => (current?.id === id ? null : current));
	}, duration);
}
