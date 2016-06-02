import * as actions from './actions'

const initialState = {
    services: {
        tauffreodu: {
            name: "Thomas Auffredou",
            count: 2,
            url: "http://paris-container-day.xebia.fr/wp-content/uploads/2016/04/Thomas-Auffredou-Xebia-09.58.25.png"
        },
        jlrigau: {
            name: "Jean-Louis Rigau",
            count: 4,
            url: "http://paris-container-day.xebia.fr/wp-content/uploads/2016/04/Jean-Louis-Rigau.png"
        }
    }
};

function serviceReducer(state = {
    count: 0,
    name: "",
    url: ""
}, action) {
    switch (action.type) {
        case actions.SERVICE_HIT:
            return Object.assign({}, state, {
                count: state.count + 1
            });
        default:
            return state
    }
}

function services(state = {}, action) {
    switch (action.type) {
        case actions.SERVICE_HIT:
            return Object.assign({}, state, {
                [action.service]: serviceReducer(state[action.service], action)
            });
        case actions.RESET_COUNTER:
            return new Map([...state].map(([k, v]) => [k, 0]));
        default:
            return state
    }
}

function reducer(state = initialState, action) {
    console.log(state);
    return {
        services: services(state.services, action)
    }

}

export default reducer