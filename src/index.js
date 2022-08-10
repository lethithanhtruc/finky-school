import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import loadable from "@loadable/component";
import SpinPage from "./components/Layout/SpinPage";
import 'antd/dist/antd.css';

import moment from 'moment';
import 'moment/locale/vi';
import locale_vi from 'antd/lib/locale/vi_VN';
import locale_en from 'antd/lib/locale/en_US';
import { ConfigProvider } from 'antd';

import { ApolloClient, ApolloProvider, InMemoryCache, ApolloLink, createHttpLink } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";

import {IntlProvider} from "react-intl";
// import { addLocaleData } from "react-intl";
// import locale_vi from 'react-intl/locale-data/vi';
// import locale_en from 'react-intl/locale-data/en';
import messages_vi from "./translations/resources.vi-VN.json";
import messages_en from "./translations/resources.en-US.json";

// addLocaleData([...locale_vi, ...locale_en]);
const messages = {
    'vi': messages_vi,
    'en': messages_en
};
// let language = 'vi';
// const language = 'en';
let language = localStorage.getItem("language");
if(!language){
    language = 'vi';
    localStorage.setItem("language", language)
}

const App = loadable(() => import("./App"), {
    fallback: <SpinPage />
});

const httpLink = new createUploadLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
});
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});
const link = ApolloLink.from([
    onError(({ graphQLErrors, networkError , operation}) => {
        if (graphQLErrors){
            let isUnauthenticated = false;
            graphQLErrors.forEach(({ message, locations, path }) => {
                if(operation.operationName != "schoolPublic" && operation.operationName != "login" && message == 'Unauthenticated.'){
                    isUnauthenticated = true;
                }
            });
            if(isUnauthenticated){
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }

        if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    authLink.concat(httpLink),
]);
const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
    },
};
const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
    connectToDevTools: process.env.REACT_APP_ENV === 'development',
});

ReactDOM.render(
    // <React.StrictMode>
        <ApolloProvider client={client}>
            <IntlProvider locale={language} messages={messages[language]}>
                <ConfigProvider locale={language === 'vi' ? locale_vi : locale_en}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </ConfigProvider>
            </IntlProvider>
        </ApolloProvider>
    // </React.StrictMode>
    ,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
