import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';
import MonitorTrombi from './containers/MonitorTrombi'
import reducer from './reducers'
import createLogger from 'redux-logger';

import {hitService} from './actions'
// import SockJS from 'sockjs-client'
// import Stomp from 'stompjs'
// require ('bootstrap/less/bootstrap.less');
// require("./main.less");
// require("font-awesome-webpack");

require("./trombi.less");
const logger = createLogger();
let store = createStore(
    reducer,
    applyMiddleware(thunk, logger)
);


store.dispatch(hitService("jlrigau"));

Window["test"] = function () {
    store.dispatch(hitService("pouet"));
};
// var socket = new SockJS('/stomp');
//
// var stompClient;
//
// var stompHandler = function (frame) {
//     stompClient.subscribe("/topic/CHECKSUITE_COMPLETE", function (data) {
//         var message = JSON.parse(data.body);
//         console.log(message);
//         store.dispatch(projectRunComplete(message.project));
//     });
//     stompClient.subscribe("/topic/RESPONSE", function (data) {
//         console.log(data.body)
//     });
// };
//
// var stompFallback = function (error) {
//     console.log('STOMP: ' + error);
//     setTimeout(stompConnect, 10000);
//     console.log('STOMP: Reconecting in 10 seconds');
// };
//
// function stompConnect() {
//     stompClient = Stomp.over(socket);
//     stompClient.connect({}, stompHandler, stompFallback);
// }
// stompConnect();
render(
    <Provider store={store}>
        <MonitorTrombi/>
    </Provider>,
    document.getElementById('root')
);

// store.dispatch(fetchProjects());