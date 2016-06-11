import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import MonitorTrombi from './containers/MonitorTrombi'
import configureStore from './store/configureStore';
import {hitService, ringTick} from './actions'

require("./trombi.less");


// let store = createStore(
//     reducer,
//     applyMiddleware(thunk, logger)
// );

const initialState = {
    ringOffset: 0,
    services: {
    }
};

let store = configureStore(initialState);


setInterval(() => store.dispatch(ringTick()), 100);

var conn;

function configureWebsocket() {
    var url = "ws://" + window.location.host  + "/ws";
    // url = "ws://localhost:8082/ws";
    conn = new WebSocket(url);
    conn.onclose = () => setTimeout(configureWebsocket, 1000);
    conn.onopen = () => console.log('Connected');

    conn.onmessage = function (evt) {
        var event = JSON.parse(evt.data);
        console.log(event);
        store.dispatch(hitService(event));
    };
}

configureWebsocket();

render(
    <Provider store={store}>
        <MonitorTrombi/>
    </Provider>,
    document.getElementById('root')
);

// store.dispatch(fetchProjects());