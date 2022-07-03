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
  let [글제목, doUpdate] = useState(['나시고랭짬뽕','탕수육','고추짜장면']); //[?,?] 이런구조 ['남자 코트 추천', 함수]
  //state 변경 html 재렌더링
  let [좋아요, update] = useState([0,0,0]);
  let [modal, setStatus] = useState(false);  
  let [index, indexStatus] = useState(0);

  return (
    <div className="App">
      <div className="black-nav">
        <h1 id={title}>lee blog</h1> 
      </div>
      <button onClick={()=>{
        //기존 state == 신규 state 비교 변경 안함
        let temp = [...글제목]; //array 사본
        temp[0] = '여자코트추천'
        doUpdate(temp);
      }}>수정</button>

      <button onClick={()=> {
        let temp = [...글제목];
        temp.sort();
        doUpdate(temp);
      }}>가나다순정렬</button>


      <h4 style={{color : 'red'}}>{title}</h4>
      {/* <div className="list">
        <h4>{글제목[0]}<span onClick={()=> update(좋아요+1)}> 👍 </span> {좋아요} </h4>
        <p>1월 1일</p>
      </div>
      <div className="list">
        <h4>{글제목[1]}<span onClick={()=> update(좋아요+1)}> 👍 </span> {좋아요} </h4>
        <p>2월 1일</p>
      </div>
      <div className="list">
        <h4 onClick={function() {
          let temp = modal;
          if(modal) {
            temp = false;
          }else {
            temp = true;
          }
          setStatus(temp);
        }}>{글제목[2]}<span onClick={()=> update(좋아요+1)}> 👍 </span> {좋아요} </h4>
        <p>3월 1일</p>
      </div> */}

      {
        글제목.map((title, index)=>{
          //JSX 반복분 map 사용
          return (
          <div className="list" key={index}> 
            <h4 onClick={()=>{
  
            let temp = modal;
            if(modal) {
              temp = false;
            }else {
              temp = true;
            }
            setStatus(temp);
            indexStatus(index);
                
            }}>{title}<span onClick={()=> {
              let temp = [...좋아요]; //array 사본
              temp[index] = temp[index] + 1
              update(temp);
            }}> 👍 </span> {좋아요[index]} </h4>
            <p>1월 1일</p>
           </div>
          )      

        })
      } 

      {
        //if안됨... 삼항연산자 사용
        modal == true ? <Modal index = {index} title={글제목} callback={doUpdate}></Modal> : ''
      }


    </div>
  ); 
}

//component : 반복적인 html 축약시  // 큰 페이지들 // 자주변경되는 것들
//1. function 만들고
//2. return 안에 html
//3. <함수명><함수명/> 사용가능
//의미없는 <div></div> -> <></> 사용가능
//const Modal = () => {}
//부모 -> 자식 props 자식 -> 부모 불가능
function Modal(props) {
  console.log(props)
  return(
    <div className="modal" style={{'background' : 'skyblue'}}>
      <h4>{props.title[props.index]}</h4>
      <p>날짜</p>
      <p>상세제목</p>
      <button onClick={() => {
       // let temp = [...props.title];
      //  props.callback(props.title[index]);
      }}>글수정</button>
    </div>
  );
};
  

export default App;
