// Slicing is ugly, filter a bit better so wraping it 
export function removeAtIndex(array: Array<any>, index: number) {
    return array.filter((_, idx) => index !== idx)
}