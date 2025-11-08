import { useState, useEffect } from 'react'
import { ts, apiKey, privateKey, mavelAddress} from  "./Const.ts";
import { AxiosResponse } from 'axios';
import md5 from "md5";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface MarvelParams {
  ts: string;
  apikey: string;
  hash: string;
}

function App() {
  const paramObj: MarvelParams = {
  ts,
  apikey: apiKey,
  hash: md5(ts + privateKey + apiKey)
};

  const [count, setCount] = useState(0) // 상태변경

useEffect(() => {
      axios({
        method: "GET",
        url: mavelAddress + "characters/1",
        params: paramObj,
      })
      .then((response: AxiosResponse) => {
       
      })
      .catch(res => {
        alert('status::' + res.response.request.status + '\n' + 'statusText::' + res.response.request.statusText);
      });

}, [count]);
  
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
