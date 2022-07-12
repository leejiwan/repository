/* eslint-disable */
import './App.css';
import { Container, Nav, Navbar, Row, Col } from 'react-bootstrap';
import bgImg from './logo.svg';
import { useEffect, useState } from 'react';
import { product, name } from './data.js' //import 문법
import { Route, Routes, Link, useParams, useNavigate, Outlet } from 'react-router-dom'
//public 폴더안은 변하지 않음
import styled from 'styled-components'

function App() {
  let [prod] = useState(product);
  //hook 유용한 함수..?
  let navigate = useNavigate();

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img src={process.env.PUBLIC_URL + "/logo192.png"} width="30" height="30" className="d-inline-block align-top" />
            Shop</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => { navigate('/') }}>Home</Nav.Link>
            <Nav.Link onClick={() => { navigate('/detail') }}>Detail</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path='/about/' element={<About />} >
          <Route path='member' element={<div>zzzz</div>} /> {/*nested routes 여러 유사한 페이지 필요*/}
        </Route>
        <Route path='/detail/:id' element={<Detail data={prod} />} />
        <Route path='/' element={<ShoesData data={prod} />} />
        <Route path='*' element={<div>없는 페이지</div>} /> {/* 선언 이외의 모든 것*/}
      </Routes>
    </div>
  );
}

function ShoesData(props) {
  return (
    <div>
      <div className="main-bg" style={{ backgroundImage: 'url(' + bgImg + ')' }} />
      <div className="container">
        <div className="row">
          {
            props.data.map((data, index) => {
              return (
                <div className="col-md-4" key={index}>
                  <img src={data.url} style={{ height: '200px', width: '100px' }} />
                  <h4>{data.title}</h4>
                  <p>{data.content}</p>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}


/*
lifeCycle
mount 페이지 장착
update 업데이트
unmount 제거
*/
/*
class Detail2 extends React.Component {
  componentDidMount() {
    //mount 페이지 장착
  }
  componentDidUpdate() {
    //update 업데이트
  }
  componentWillUnmount() {
    //unmount 제거
  }

}
*/
function Detail(props) {
  useEffect(() => {
    /*mount,update 코드 실행
      html 렌더링 완료 후 실행
      오래걸리는 작업(연산, 타이머, 서버에서 데이터 가져오는 작업)
    */
    /*
     Todo 페이지 방문 후 2초 지나면 div 숨기기
    */
    console.log('start')
  });

  let [count, setCount] = useState(0);

  let id = useParams();
  let Yellowbtn = styled.button`
  backgound : ${props => props.bg};
  color : black;
  `;
  let Box = styled.div`
  padding : 50px;
  color : grey;
  backgound: ${props => props.bg == 'red' ? 'red' : 'blue'};
`;
  debugger;
  return (
    <div className="container">
      <div className="row">
        <Yellowbtn bg='red' onClick={() => {
          setCount(count + 1);
        }}>button</Yellowbtn>
        <Box>zzzz</Box>
        <div className="col-md-6">
          <img src={props.data[id.id].url} width="100%" />
        </div>
        <div className="col-md-6">
          <h4 className="pt-5">{props.data[id.id].title}</h4>
          <p>{props.data[id.id].content}</p>
          <p>{props.data[id.id].price}</p>
          <button className="btn btn-danger">주문하기</button>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div>
      <div>회사정보</div>
      <Outlet></Outlet>
    </div>

  );
}
export default App;
