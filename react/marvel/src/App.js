import './App.css';
import { Navbar, Container, Nav, Form } from 'react-bootstrap';
import { useState } from 'react';
import { ListData } from './List.js'
import { Detail } from './Detail.js'
import { ComicsDetail } from './ComicsDetail.js'
import { SeriesDetail } from './SeriesDetail.js'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Papago } from './Papago.js'

function App() {
  let [search, setSearch] = useState('');
  let navigate = useNavigate();

  return (
    <div className="App">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Navbar.Brand href="" onClick={() => {
              navigate('/hero');
            }}>hero search</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="" onClick={() => {
                navigate('/hero');
              }}>hero</Nav.Link>
              <Nav.Link href="" onClick={() => {
                navigate('/comics');
              }}>comics</Nav.Link>
              <Nav.Link href="" onClick={() => {
                navigate('/series');
              }}>series</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
        <Form className="d-flex" onChange={(e) => {
          setSearch(e.target.value);
        }}>
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
          />
        </Form>
      </Navbar>
      <Routes>
        <Route path='/' element={<ListData data={search} />} />
        <Route path='/:gubun' element={<ListData data={search} />} />
        <Route path='/detail/:id' element={<Detail />} />
        <Route path='/Comicsdetail/:id' element={<ComicsDetail />} />
        <Route path='/SeriesDetail/:id' element={<SeriesDetail />} />
        <Route path='*' element={<div>없는 페이지</div>} /> {/* 선언 이외의 모든 것*/}
        <Route path='/test' element={<Papago />} /> {/* TEST*/}
      </Routes>
    </div>
  );
}


export default App;
