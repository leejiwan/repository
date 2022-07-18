import axios from 'axios';
import md5 from 'md5';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { ts, apiKey, privateKey } from './Const.js'

//https://developer.marvel.com/docs#!/public/getCreatorCollection_get_0
function KitchenSinkExample(search) {
    let [list, setList] = useState([]);
    let [foot, setFoot] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        let paramObj = {};
        paramObj.ts = ts;
        paramObj.apikey = apiKey;
        paramObj.hash = md5(ts + privateKey + apiKey);
        paramObj.orderBy = 'name';
        if (search.data != null && search.data != '') {
            paramObj.nameStartsWith = search.data;
        }

        axios.get('https://gateway.marvel.com:443/v1/public/characters', {
            params: paramObj
        }).then((data) => {
            setFoot(data.data.attributionHTML);
            setList(data.data.data.results);
        }).catch((res) => {
            alert(res.message);
        })
    }, [search])



    return (
        <div>
            {
                <Row xs={1} md={4} className="g-4">
                    {list.map((data, idx) => (
                        <Col key={idx}>
                            <Card>
                                <Card.Img variant="top" src={data.thumbnail.path + '.' + data.thumbnail.extension} />
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item onClick={() => {
                                        //let url = '/detail/' + data.id;
                                        navigate('/detail/' + data.id)
                                    }}>{data.name}</ListGroup.Item>
                                    <ListGroup.Item>{data.description}</ListGroup.Item>
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

            <div dangerouslySetInnerHTML={{ __html: foot }}></div>
        </div>
    );
}



export { KitchenSinkExample };

