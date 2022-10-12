import './App.css';
import { Nav, Navbar, Container } from 'react-bootstrap';
import { useState } from 'react';
import { List } from './List.js'
import { Detail } from './Detail.js'
import { Route, Routes } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function App() {
  let [search, setSearch] = useState('');
  let navigate = useNavigate();
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">React</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href={navigate('/')}>List</Nav.Link>
          </Nav>
        </Container>
        <input type="text" onChange={(e) => {
          setSearch(e.target.value);
        }}></input>
      </Navbar>
      <Routes>
        <Route path='/' element={<List data={search} />} />
        <Route path='/detail/:id' element={<Detail />} />
        <Route path='*' element={<div>없는 페이지</div>} /> {/* 선언 이외의 모든 것*/}
      </Routes>
    </div>
  );
}

export default App;
