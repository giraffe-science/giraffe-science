import React from 'react';
import ReactDOM from 'react-dom';
import library from "./library.json";
import App from './App';
import './index.css';
import {Library} from "./Library";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <React.StrictMode>
        <App loading={Promise.resolve(library as Library)}/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
