import React from 'react'; //리엑트를 불러와서 사용
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';
import MyComponent from './MyComponent';
import Event from './EventHandle';


ReactDOM.render(
  <React.StrictMode>
    <Event name="LeeJiwan"/>
  </React.StrictMode>,
  document.getElementById('root')
);

 


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();