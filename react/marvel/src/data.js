import axios from 'axios';
import md5 from 'md5';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import {useState, useEffect} from 'react';

const ts = '2';
//const apiKey = '80c4041a1fd0e215e6a0fbee4d2dd9fc'
//const privateKey = 'd32e3a2c4fd6fe64342fd18219650e06d2ae4f5b'

const apiKey = 'cbd40e40774553b903028053061f5e45'
const privateKey = '55f6f480948040d1bc519fb1fe837db08302e7d2'
//https://developer.marvel.com/docs#!/public/getCreatorCollection_get_0
function KitchenSinkExample(search) {
    let [list, setList] = useState([]);
    console.log(search)
    useEffect(()=> {
        axios.get('https://gateway.marvel.com:443/v1/public/characters', { 
            params: { 
                'ts': ts, 
                'apikey': apiKey, 
                'hash': md5(ts + privateKey + apiKey),
                'orderBy' : 'name'
            } }).then((data) => {
                console.log(data)
            setList(data.data.data.results);
        }).catch((res) => {
            console.log(res);
        })
    }, [])

    
  
  return (
    <div>
        {
         <Row xs={1} md={4} className="g-4">
            {list.map((data, idx) => (
                <Col key={idx}>
                <Card>
                    <Card.Img variant="top" src={data.thumbnail.path + '.' + data.thumbnail.extension} />
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item>{data.name}</ListGroup.Item>
                        <ListGroup.Item>{data.description}</ListGroup.Item>
                        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                    </ListGroup>
                    <Card.Body>
                        <Card.Link href="#">Card Link</Card.Link>
                        <Card.Link href="#">Another Link</Card.Link>
                    </Card.Body>
                </Card>
                </Col>
            ))}
        </Row>
        }     
    </div>  
  );
}



export {KitchenSinkExample};

