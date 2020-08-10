import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {load} from "./google-sheets";
import './index.css';
import {Library} from "./Library";
import library from "./library.json";
import {CachedLookup, CrossRefLookup} from "./Lookup";
import * as serviceWorker from './serviceWorker';
import {AxiosClient} from "./util/http4t/AxiosClient";
import {RetryHandler} from "./util/http4t/RetryHandler";

ReactDOM.render(
    <React.StrictMode>
        <App
            lookup={new CachedLookup(new CrossRefLookup(new AxiosClient()))}
            loading={
                load(new RetryHandler(new AxiosClient()))
                    .catch(e => {
                        console.log("error loading library", e);
                        return library as any as Library;
                    }).then(l => {
                    console.log(l);
                    return l;
                })}/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
