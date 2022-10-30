2020/11/29

1. 참고

- 이것이 코딩테스트다 // https://github.com/ndb796
- 국내 기술 면접 가이드 라인 //https://github.com/JaeYeopHan/Interview_Question_for_Beginner
- JAVA 기초 참고 http://www.tcpschool.com/java

2. react

# JSX 문법

실은 html이 아니라 JSX
react에서 div 만드는 법 React.createElement('div',null, 'Hi')
JSX 문법1 class -> className
JSX 문법2 데이터바인딩 {} 중괄호
JSX 문법3 style 넣을 땐 style={{스타일명 : '값'}}

return() 안에는 병렬로 태그 2개 이상 기입금지

# useState

자료잠깐 저장 state
1.import{useState}
2.usetState(보관할 자료)
let[작명, 작명]
변수 state 차이
변수가 변경이 되면 html에 자동으로 변경이 안됨
state쓰던 html은 자동 재렌더링이 됨

# component

component : 반복적인 html 축약시 // 큰 페이지들 // 자주변경되는 것들

1. function 만들고
2. return 안에 html
3. <함수명><함수명/> 사용가능
   의미없는 <div></div> -> <></> 사용가능
   const Modal = () => {}
   부모 -> 자식 props 자식 -> 부모 불가능

# 리액트 훅 정리

# props로 매개변수 component 귀찮을 때

1.context API(리액트 기본문법)

- component 재활용이 어려움;
  2.Redux등 외부 라이브러리
- npm install @reduxjs/toolkit react-redux

# Redux

- component간의 state 공유



# localStorage
- key : value 값으로 저장


# PWA 셋팅 
- 모바일 웹 앱 
- PWA 리액트 프로젝트 생성(npx create-react-app 프로젝트명 --template cra-template-pwa)

- 1. manifest.json
- 2. service-worker.js



# react build
- npm run build
