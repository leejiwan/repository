import axios from 'axios';
import md5 from 'md5';
import Row from 'react-bootstrap/Row';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { ts, apiKey, privateKey } from './Const.js'
import { Footer, FooterV1 } from './Footer.js'
import Button from 'react-bootstrap/Button';
import { useDispatch } from "react-redux"
import { changeText } from './reducers/store.js'

//https://developer.marvel.com/docs#!/public/getCreatorCollection_get_0
function ListData(search) {
    let [list, setList] = useState([]);
    let navigate = useNavigate();
    let dispatch = useDispatch();

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
            dispatch(changeText(data.data.attributionText));
            setList(data.data.data.results);
        }).catch((res) => {
            alert('status::' + res.response.request.status + '\n' + 'statusText::' + res.response.request.statusText);
        })
    }, [search])


    return (
        <div>
            {
                <Row xs={1} md={5} className="g-5" style={{ "--bs-gutter-x": "0rem", "--bs-gutter-y": "1rem" }}>
                    {list.map((data, idx) => (
                        <div className="flip-card" key={idx}>
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <img src={
                                        data.thumbnail.path +
                                        "." +
                                        data.thumbnail.extension
                                    } alt="img" style={{ width: '100%', height: '100%' }} />
                                </div>
                                <div className="flip-card-back">
                                    <div style={{ padding: "26%" }}>
                                        <h1 style={{ 'fontSize': '1.0rem' }}>{data.name}</h1>
                                        <Button size="sm" onClick={() => {
                                            navigate('/detail/' + data.id);
                                        }}>detail more</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Row>
            }
            <FooterV1 />
        </div>
    );
}

export { ListData };

