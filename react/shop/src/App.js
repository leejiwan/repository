/* eslint-disable */
import './App.css';
import { Container, Nav, Navbar, Row, Col } from 'react-bootstrap';
import bgImg from './logo.svg';
import { useEffect, useState } from 'react';
import { product, name } from './data.js' //import 문법
import { Route, Routes, Link, useParams, useNavigate, Outlet } from 'react-router-dom'
//public 폴더안은 변하지 않음
import styled from 'styled-components'
import axios from 'axios'
import md5 from 'md5'

function App() {
  let [prod, setProd] = useState(product);
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
      <button onClick={() => {
        axios.get('https://codingapple1.github.io/shop/data2.json').then((data) => {
          let temp = [...prod];
          for (var i = 0; i < data.data.length; i++) {
            temp.push(data.data[i]);
          }
          setProd(temp);
        }).catch(() => {

        });

        //axios.post('', { name: 'kim' });
        //Promise.all([axios.get(), axios.get()]).then(() => {

        //});
      }}>더보기</button>
      <button onClick={() => {
        let ts = '1';
        let apiKey = '80c4041a1fd0e215e6a0fbee4d2dd9fc'
        let privateKey = 'd32e3a2c4fd6fe64342fd18219650e06d2ae4f5b'
        //046fdf51a88784d2148448e7e7d9534c
        console.log(md5(ts + privateKey + apiKey));
        axios.get('https://gateway.marvel.com:443/v1/public/characters', { params: { 'ts': ts, 'apikey': apiKey, 'hash': md5(ts + privateKey + apiKey) } }).then((data) => {
          console.log(data)
        }).catch((res) => {
          console.log(res);
        })

      }}>test</button>
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

  let [count, setCount] = useState(0);
  let [alert, setAlert] = useState(true);
  let [content, setContent] = useState('');
  let [tabChange, setabChange] = useState(0);
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

  useEffect(() => {
    /*mount,update 코드 실행
      html 렌더링 완료 후 실행
      오래걸리는 작업(연산, 타이머, 서버에서 데이터 가져오는 작업)
       dependence 공부하기
    */
    /*
      useEffect(() => {}) 1. 재렌더링마다 코드실행하고 싶으면
      useEffect(() => {}, [])  2. mount시 1회 코드실행하고 싶으면
      useEffect(() => {
        return ()=> {
          3. unmount시 1회 코드실행하고 싶으면
        }
      }, [])
    */

    let a = setTimeout(() => {
      setAlert(false);
    }, 2000)
    return () => {
      /*
       useEffec 동작 전 실행
      */
      clearTimeout(a);
      console.log(isFinite(content))
      if (!isFinite(content)) {
        setContent('');
      }
    }
  });


  // debugger;
  return (
    <div className="container">
      <div className="row">
        <input type="text" onChange={(e) => {
          setContent(e.target.value);
          if (!isFinite(content)) {
            target.value = '';
          }
        }}></input>
        {
          alert == true ? <div>zzzz</div> : null
        }
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

      <Nav variant="tabs" defaultActiveKey="link0">
        <Nav.Item>
          <Nav.Link onClick={() => {
            setabChange(0);
          }} eventKey="link0">버튼0</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={() => {
            setabChange(1);
          }} eventKey="link1">버튼1</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link onClick={() => {
            setabChange(2);
          }} eventKey="link2">버튼2</Nav.Link>
        </Nav.Item>
      </Nav >

      <CustomTab data={tabChange} />



    </div >
  );
}


let CustomTab = (tabChange) => {
  let [fade, setFade] = useState('');
  useEffect(() => {
    setTimeout(() => {
      setFade('end');
    }, 100)
    //setFade('end');
    return () => {
      //useEffect 전에 실행
      setFade('');
    }


  }, [tabChange])

  return (
    <div className={'before' + fade}>
      {[<div>내용0</div>, <div>내용1</div>, <div>내용2</div>][tabChange]}
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
