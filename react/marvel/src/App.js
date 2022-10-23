import './App.css';
import { Navbar, Container } from 'react-bootstrap';
import { useState } from 'react';
import { ListData } from './List.js'
import { Detail } from './Detail.js'
import { Route, Routes } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Papago } from './Papago.js'

function App() {
  let [search, setSearch] = useState('');
  let navigate = useNavigate();
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href='' onClick={() => {
            navigate('/');
          }}>hero search</Navbar.Brand>
        </Container>
        <input type="text" placeholder="search" onChange={(e) => {
          setSearch(e.target.value);
        }}></input>
      </Navbar>
      <Routes>
        <Route path='/' element={<ListData data={search} />} />
        <Route path='/detail/:id' element={<Detail />} />
        <Route path='*' element={<div>없는 페이지</div>} /> {/* 선언 이외의 모든 것*/}
        <Route path='/test' element={<Papago />} /> {/* TEST*/}
      </Routes>
    </div>
  );
}

export default App;
