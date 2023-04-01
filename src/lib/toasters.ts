import { toast } from '@zerodevx/svelte-toast'
import type { SvelteToastOptions } from '@zerodevx/svelte-toast/stores'

export function success(message: string, params: SvelteToastOptions) {
    toast.push(message, {
        theme: {
            '--toastBarBackground': 'var(--accent-color)',
            '--toastBorder': '3px solid var(--accent-color)',
        },
        ...params
    })
}


// not used yet so check if it looks good
export function warning(message: string, params: SvelteToastOptions) {
    toast.push(message, {
        theme: {
            '--toastBarBackground': 'yellow',
            '--toastBorder': 'yellow'
        },
        ...params
    })
}

export function error(message: string, params: SvelteToastOptions) {
    toast.push(message, {
        theme: {
            '--toastBarBackground': 'red',
            '--toastBorder': '3px solid red'
        },
        ...params
    })
}

export function info(message: string, params: SvelteToastOptions) {
    toast.push(message, {
        theme: {
            '--toastBorder': 'none'
        },
        ...params
    })
}