/* eslint-disable */
import './App.css';
import {Container,Nav,Navbar,Row,Col} from 'react-bootstrap';
import bgImg from './logo.svg';


//public 폴더안은 변하지 않음
function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img src={process.env.PUBLIC_URL +  "/logo192.png"} width="30" height="30"  className="d-inline-block align-top"/>
            Shop</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <div className="main-bg" style={{backgroundImage : 'url('+ bgImg +')'}}></div>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
          <img src="https://codingapple1.github.io/shop/shoes1.jpg" style={{height : '200px', width : '100px'}}/>
            <h4>상품명1</h4>
            <p>상품설명</p>
          </div>
          <div className="col-md-4">
          <img src="https://codingapple1.github.io/shop/shoes2.jpg" style={{height : '200px', width : '100px'}}/>
            <h4>상품명1</h4>
            <p>상품설명</p>
          </div>
          <div className="col-md-4">
          <img src="https://codingapple1.github.io/shop/shoes3.jpg" style={{height : '200px', width : '100px'}}/>
            <h4>상품명1</h4>
            <p>상품설명</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
