export const SERVICE_HIT = 'SERVICE_HIT';
export const RESET_COUNTER = 'RESET_COUNTER';

export function hitService(name) {
    return {
        type: SERVICE_HIT,
        service: name
    }
}