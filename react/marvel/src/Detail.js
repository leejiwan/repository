import { ts, apiKey, privateKey } from './Const.js'
import { useEffect, useState } from 'react';
import md5 from 'md5';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

function Detail() {
    let param = useParams();
    let [info, setInfo] = useState({});
    let [thumbnail, setTumbnail] = useState({});
    let paramObj = {};
    paramObj.ts = ts;
    paramObj.apikey = apiKey;
    paramObj.hash = md5(ts + privateKey + apiKey);

    useEffect(() => {
        let paramObj = {};
        paramObj.ts = ts;
        paramObj.apikey = apiKey;
        paramObj.hash = md5(ts + privateKey + apiKey);

        axios.get('https://gateway.marvel.com:443/v1/public/characters/' + param.id, {
            params: paramObj
        }).then((data) => {
            setInfo(data.data.data.results[0]);
            setTumbnail(data.data.data.results[0].thumbnail);

        }).catch((res) => {
            alert(res.message);
        })


    }, [param.id])

    return (
        <div>
            <Card >
                <div style={{ textAlign: 'center' }}>
                    <Card.Img style={{ width: '27rem' }} variant="top" src={thumbnail.path + '.' + thumbnail.extension} />
                </div>
                <Card.Body>
                    <Card.Title>{info.name}</Card.Title>
                    <Card.Text>
                    </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroup.Item>{info.description}</ListGroup.Item>
                    {
                        info.comics.item((data, index) => {
                            <ListGroup.Item>{data.resourceURI}</ListGroup.Item>
                        })
                    }

                </ListGroup>
                <Card.Body>
                    <Card.Link href="#">Card Link</Card.Link>
                    <Card.Link href="#">Another Link</Card.Link>
                </Card.Body>
            </Card >
        </div >
    );
};

export { Detail }