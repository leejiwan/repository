import './App.css';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { useState } from 'react';
import { KitchenSinkExample } from './data.js'
import { Detail } from './Detail.js'
import { Route, Routes } from 'react-router-dom'
function App() {
  let [search, setSearch] = useState('');

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
          </Nav>
        </Container>
        <input type="text" onChange={(e) => {
          setSearch(e.target.value);
        }}></input>
      </Navbar>
      <Routes>
        <Route path='/' element={<KitchenSinkExample data={search} />} />
        <Route path='/detail/:id' element={<Detail />} />
        <Route path='*' element={<div>없는 페이지</div>} /> {/* 선언 이외의 모든 것*/}
      </Routes>
    </div>
  );
}

export default App;
