import { ts, apiKey, privateKey } from './Const.js'
import { useEffect, useState } from 'react';
import md5 from 'md5';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
function getComicsThumbnail(paramObj) {

}


function Detail() {
    let param = useParams();
    let [info, setInfo] = useState({});
    let [thumbnail, setTumbnail] = useState({});
    let [story, setStory] = useState([]);
    let [urls, setUrls] = useState([]);
    let paramObj = {};
    paramObj.ts = ts;
    paramObj.apikey = apiKey;
    paramObj.hash = md5(ts + privateKey + apiKey);
    debugger;
    useEffect(() => {
        let paramObj = {};
        paramObj.ts = ts;
        paramObj.apikey = apiKey;
        paramObj.hash = md5(ts + privateKey + apiKey);
        debugger;

        axios.get('https://gateway.marvel.com:443/v1/public/characters/' + param.id, {
            params: paramObj
        }).then((data) => {
            setInfo(data.data.data.results[0]);
            setTumbnail(data.data.data.results[0].thumbnail);
            setStory(data.data.data.results[0].series.items);
            setUrls(data.data.data.results[0].urls);
        }).catch((res) => {
            alert(res.message);
        })

        console.log(param)
    }, [param.id])
    debugger;
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
                </ListGroup>
                <ListGroup className="list-group-flush">
                    {
                        story.map((data, index) => {
                            return (
                                <ListGroup.Item>{data.name}</ListGroup.Item>
                            )
                        })
                    }
                </ListGroup>
                <Card.Body>
                    {
                        urls.map((data, index) => {
                            return (
                                <div>
                                    <Card.Link href={data.url}>{data.type}</Card.Link>
                                </div>
                            )
                        })
                    }
                </Card.Body>
            </Card >
        </div >
    );
};


export { Detail }