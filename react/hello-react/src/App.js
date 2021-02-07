//import logo from './logo.svg';
import './App.css';

function App() {
  const name = 'Lee';
  const style = {backgroundColor:'black', color:'aqua',fontSize:'48px',fontWeight:'bold'};
  const className = 'react'
  return (
    <div className={className} style={style}>
      {name === "Lee2" ? (
        <h1>{name} 리액트 TEST</h1>
      ) : (
        <h1>{name} 리액트 TEST2</h1>
      )}
    </div>
  );
}



export default App;
