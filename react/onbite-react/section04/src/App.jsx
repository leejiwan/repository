import './App.css'
import { useState } from 'react'
import Register from './component/Register'

/*
 구조분해할당 매개변수를 {light, ...} 이런식으로
*/ 
const Bulb = ({ligth}) => {
  return(
    <div>
      {ligth === 'on' ? <h1>on</h1> : <h1>off</h1>}
    </div>
  )
}

/*
 컴포넌트 html을 반환하는 함수
*/
function App() {
  const [count, setCount] = useState(0);
  const [light, setLight] = useState("off");
  /*
    let light = "off" <- 이렇게 안하는이유?
    버튼 클릭으로 변수값은 변경 될 수 있음 그러나 리렌더링 되지는 않아서
    usetStat를 사용하는거임
  */
  return (
    <>
    <Register></Register>
    <div>
      <Bulb ligth = {light}></Bulb>
      <button onClick={()=>{
        light == "off" ? setLight("on") : setLight("off")
      }}>light</button>
    </div>
    <div>
      <h1>{count}</h1>
      <button onClick={()=>{
        setCount(count + 1)
      }}>+</button>
    </div>
    </>
  )
}

export default App
