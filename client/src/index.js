import React from 'react';
import ReactDom from 'react-dom';
import App from './components/App'
ReactDom.render(
    <App url='http://localhost:5000/api/receive' />
    ,document.querySelector('#root')
);  