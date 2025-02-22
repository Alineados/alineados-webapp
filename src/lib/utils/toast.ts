import { toast } from "svelte-sonner";

export function showToast(message: string, type: 'success' | 'error') {
    if (type === 'success')
        toast.success(message, {
            duration: 2000
        });
    else if (type === 'error') toast.error(message, { duration: 2000 });
}