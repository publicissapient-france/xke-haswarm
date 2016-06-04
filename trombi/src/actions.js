export const SERVICE_HIT = 'SERVICE_HIT';
export const RESET_COUNTER = 'RESET_COUNTER';
export const RING_TICK = 'RING_TICK';

export function hitService(name) {
    return {
        type: SERVICE_HIT,
        service: name
    }
}

export function ringTick() {
    return {
        type: RING_TICK
    }
}