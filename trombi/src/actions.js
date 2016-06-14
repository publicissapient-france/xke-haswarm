export const SERVICE_HIT = 'SERVICE_HIT';
export const SERVICE_HIT_PENDING = 'SERVICE_HIT_PENDING';
export const SERVICE_HIT_COMPLETED = 'SERVICE_HIT_COMPLETED';
export const SERVICE_RECEIVED = 'SERVICE_RECEIVED';
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

export const receiveServices = (newServices) => {
    return {
        type: SERVICE_RECEIVED,
        services: newServices
    }
};

export const hitServicePending = () => {
    return {
        type: SERVICE_HIT_PENDING
    }
};

export const hitServiceCompleted = () => {
    return {
        type: SERVICE_HIT_COMPLETED
    }
};

export function hitServiceRequested(service) {
    return function (dispatch) {
        dispatch(hitServicePending());
        console.log(service.hitUrl);
        var hitRequest = new Request(service.hitUrl, {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }
        });
        fetch(hitRequest)
            .then(response => dispatch(hitServiceCompleted()))
    }

}

export function fetchServices() {
    return function (dispatch) {
        return fetch('/services')
            .then(response => response.json())
            .then(json => dispatch(receiveServices(json)));
    }
}

export function ringTick() {
    return {
        type: RING_TICK
    }
}