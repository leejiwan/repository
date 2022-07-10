/* eslint-disable */
import './App.css';
import { Container, Nav, Navbar, Row, Col } from 'react-bootstrap';
import bgImg from './logo.svg';
import { useState } from 'react';
import { product, name } from './data.js' //import 문법
import { Route, Routes, Link, useParams, useNavigate, Outlet } from 'react-router-dom'
//public 폴더안은 변하지 않음
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
          <Route path='member' element={<div>zzzz</div>} /> {//nested routes 여러 유사한 페이지 필요}
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

function Detail(props) {
  let id = useParams();
  debugger;
  return (
    <div className="container">
      <div className="row">
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
