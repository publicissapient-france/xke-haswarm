import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import devTools from 'remote-redux-devtools';
import createLogger from 'redux-logger';

export default function configureStore(initialState) {
    const logger = createLogger();

    const enhancer = compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    );
    // const store = devTools({ realtime: true })(createStore)(rootReducer, initialState);
    const store = createStore(rootReducer, initialState, enhancer);

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers').default;
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}