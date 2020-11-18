import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import {Facebook} from "./auth/Facebook";
import {FeatureFlags} from "./FeatureFlags";
import './index.css';
import {Library} from "./library/Library";
import library from "./library/library.json";
import {CachedLookup, CrossRefLookup} from "./library/Lookup";
import * as serviceWorker from './serviceWorker';
import {ErrorReports} from "./util/ErrorReports";
import {AxiosClient} from "./util/http4t/AxiosClient";

const errors = new ErrorReports().add((e: any) => console.log("error", e));

ReactDOM.render(
    <React.StrictMode>
        <App
            lookup={new CachedLookup(new CrossRefLookup(new AxiosClient()))}
            loading={Promise.resolve(library as any as Library)}
            facebook={new Facebook(errors)}
            errors={errors}
            flags={new FeatureFlags()}
        />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
