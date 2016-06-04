import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
// import thunk from 'redux-thunk';
import MonitorTrombi from './containers/MonitorTrombi'
// import createLogger from 'redux-logger';
import configureStore from './store/configureStore';
import {hitService, ringTick} from './actions'
// import SockJS from 'sockjs-client'
// import Stomp from 'stompjs'
// require ('bootstrap/less/bootstrap.less');
// require("./main.less");
// require("font-awesome-webpack");

require("./trombi.less");


// let store = createStore(
//     reducer,
//     applyMiddleware(thunk, logger)
// );

const initialState = {
    ringOffset: 0,
    services: {
        tauffredou: {
            name: "Thomas Auffredou",
            url: "http://paris-container-day.xebia.fr/wp-content/uploads/2016/04/Thomas-Auffredou-Xebia-09.58.25.png",
            countBuffer: 0,
            countRing: [0]
        },
        jlrigau: {
            name: "Jean-Louis Rigau",
            url: "http://paris-container-day.xebia.fr/wp-content/uploads/2016/04/Jean-Louis-Rigau.png",
            countBuffer: 0,
            countRing: [0]
        }
    }
};

let store = configureStore(initialState);


setInterval(() => store.dispatch(ringTick()), 100);

var conn;

function configureWebsocket() {
    conn = new WebSocket("ws://localhost:8082/ws");
    conn.onclose = () => setTimeout(configureWebsocket, 1000);
    conn.onopen = () => console.log('Connected');

    conn.onmessage = function (evt) {
        event = JSON.parse(evt.data);
        store.dispatch(hitService(event.service));
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