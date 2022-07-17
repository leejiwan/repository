import './App.css';
import { Nav, Navbar, Container } from 'react-bootstrap';
import {KitchenSinkExample} from './data.js'

function App() {

 // let [list] = useState(characterList);
 // console.log(list)
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <KitchenSinkExample></KitchenSinkExample>
    </div>
  );
}

export default App;
