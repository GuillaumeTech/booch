import { toast } from '@zerodevx/svelte-toast'
import type { SvelteToastOptions } from '@zerodevx/svelte-toast/stores'

export function success(message: string, params: SvelteToastOptions) {
    toast.push(message, {
        theme: {
            '--toastBackground': 'seagreen',
            '--toastColor': 'white',
            '--toastBarBackground': 'green'
        },
        ...params
    })
}

export function warning(message: string, params: SvelteToastOptions) {
    toast.push(message, {
        theme: {
            '--toastBackground': 'gold',
            '--toastColor': 'black',
            '--toastBarBackground': 'yellow'
        },
        ...params
    })
}

export function error(message: string, params: SvelteToastOptions) {
    toast.push(message, {
        theme: {
            '--toastBackground': 'firebrick',
            '--toastColor': 'white',
            '--toastBarBackground': 'red'
        },
        ...params
    })
}

export function info(message: string, params: SvelteToastOptions) {
    toast.push(message, {
        theme: {
            '--toastBackground': 'skyblue',
            '--toastColor': 'black',
            '--toastBarBackground': 'blue'
        },
        ...params
    })
}