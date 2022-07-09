/* eslint-disable */
import './App.css';
import { Container, Nav, Navbar, Row, Col } from 'react-bootstrap';
import bgImg from './logo.svg';
import { useState } from 'react';
import { product, name } from './data.js' //import 문법
import { Route, Routes, Link } from 'react-router-dom'
//public 폴더안은 변하지 않음
function App() {

  let [prod] = useState(product);
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img src={process.env.PUBLIC_URL + "/logo192.png"} width="30" height="30" className="d-inline-block align-top" />
            Shop</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Link to='/'>home</Link>
      <Routes>
        <Route path='/detail' element={<div>상세페이쥐</div>} />
        <Route path='/about' element={<div>어바웃</div>} />
        <Route path='/' element={<div>main</div>} />
        <Route />
      </Routes>
      <div className="main-bg" style={{ backgroundImage: 'url(' + bgImg + ')' }}></div>
      <div className="container">
        <ShoesData />
      </div>
    </div>
  );
}

function ShoesData() {
  debugger;
  let [prod] = useState(product);
  return (
    <div className="row">
      {
        prod.map((data, index) => {
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
  );
}

export default App;
