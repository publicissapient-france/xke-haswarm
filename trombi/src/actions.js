export const SERVICE_HIT = 'SERVICE_HIT';
export const RESET_COUNTER = 'RESET_COUNTER';
export const RING_TICK = 'RING_TICK';

export function hitService(service) {
    return {
        type: SERVICE_HIT,
        name: service.name,
        filename: service.filename,
        hostname: service.hostname
    }
}

export function ringTick() {
    return {
        type: RING_TICK
    }
}