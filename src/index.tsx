import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import './index.css';
import {CognitoUsers} from "./auth/Users";
import {Library} from "./library/Library";
import library from "./library/library.json";
import {CachedLookup, CrossRefLookup} from "./library/Lookup";
import * as serviceWorker from './serviceWorker';
import {AxiosClient} from "./util/http4t/AxiosClient";

ReactDOM.render(
    <React.StrictMode>
        <App
            lookup={new CachedLookup(new CrossRefLookup(new AxiosClient()))}
            loading={Promise.resolve(library as any as Library)}
            users={CognitoUsers.connect("us-east-1_9XMxeT7Ba", "6l3c66aae8gajeatfue4s3hal8")}
        />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
