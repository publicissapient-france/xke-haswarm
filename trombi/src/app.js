import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import MonitorTrombi from './containers/MonitorTrombi'
import configureStore from './store/configureStore';
import {hitService, ringTick,fetchServices} from './actions'
import {Router, Route, hashHistory} from 'react-router'

require("./trombi.less");

// let store = createStore(
//     reducer,
//     applyMiddleware(thunk, logger)
// );

// Some trivial routing
var isMonitor = window.location.hash.startsWith("#monitor");
const initialState = {
    ringOffset: 0,
    services: {},
    isMonitor: isMonitor
};

let store = configureStore(initialState);


setInterval(() => store.dispatch(ringTick()), 100);
console.log(window.location);
var conn;
function configureWebsocket() {
    var url = "ws://" + window.location.host + "/ws";
    // console.log(url);
    // url = "ws://localhost:8082/ws";
    conn = new WebSocket(url);
    conn.onclose = () => setTimeout(configureWebsocket, 1000);
    conn.onopen = () => {
        console.log('Connected');
        store.dispatch(fetchServices());
    };

    conn.onmessage = function (evt) {
        var event = JSON.parse(evt.data);
        console.log(event);
        if (isMonitor) {
            store.dispatch(hitService(event));
        }
    };
}

configureWebsocket();
document.write('<div id="root"></div>');

render(
    <Provider store={store}>
        <MonitorTrombi/>
    </Provider>,
    document.getElementById('root')
);

// store.dispatch(fetchProjects());