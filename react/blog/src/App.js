/* eslint-disable */
import logo from './logo.svg';
import './App.css'; //css파일 쓰려면 상단에 경로 import 'css파일 경로'
import {useState} from 'react';

//실은 html이 아니라 JSX
//react에서 div 만드는 법 React.createElement('div',null, 'Hi')
//JSX 문법1 class -> className
//JSX 문법2 데이터바인딩 {} 중괄호
//JSX 문법3 style 넣을 땐 style={{스타일명 : '값'}}

//return() 안에는 병렬로 태그 2개 이상 기입금지

function App() {

  var title = '부개맛집'
  //자료잠깐 저장 state
  //1.import{useState}
  //2.usetState(보관할 자료)
  //let[작명, 작명]
  //변수 state 차이
  //변수가 변경이 되면 html에 자동으로 변경이 안됨
  //state쓰던 html은 자동 재렌더링이 됨
  let [글제목, b] = useState(['짬뽕','짜장면','탕수육']); //[?,?] 이런구조 ['남자 코트 추천', 함수]

  
  return (
    <div className="App">
      <div className="black-nav">
        <h1 id={title}>lee blog</h1> 
      </div>
      <h4 style={{color : 'red'}}>{title}</h4>
      <div className="list">
        <h4>{글제목[0]}<span>좋아요 👍 </span> 0 </h4>
        <p>1월 1일</p>
      </div>
      <div className="list">
        <h4>{글제목[1]}</h4>
        <p>2월 1일</p>
      </div>
      <div className="list">
        <h4>{글제목[2]}</h4>
        <p>3월 1일</p>
      </div>
    </div>
  );
}

export default App;
