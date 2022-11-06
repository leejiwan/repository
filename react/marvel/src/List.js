import axios from 'axios';
import md5 from 'md5';
import Row from 'react-bootstrap/Row';
import { useState, useEffect } from 'react';
import { resolvePath, useLinkClickHandler, useNavigate } from 'react-router-dom'
import { ts, apiKey, privateKey } from './Const.js'
import { Footer, FooterV1 } from './Footer.js'
import Button from 'react-bootstrap/Button';
import { useDispatch } from "react-redux"
import { changeText } from './reducers/store.js'
import { useParams } from "react-router-dom";

//https://developer.marvel.com/docs#!/public/getCreatorCollection_get_0
function ListData(search) {
    let param = useParams();
    let [list, setList] = useState([]);
    let navigate = useNavigate();
    let dispatch = useDispatch();

    let gubunObj =
    {
        'hero': 'https://gateway.marvel.com:443/v1/public/characters',
        'comics': 'https://gateway.marvel.com:443/v1/public/comics',
        'series': 'https://gateway.marvel.com:443/v1/public/series'
    }

    if (Object.keys(param).length == 0) {
        param.gubun = 'hero';
    }
    useEffect(() => {
        let paramObj = {};
        paramObj.ts = ts;
        paramObj.apikey = apiKey;
        paramObj.hash = md5(ts + privateKey + apiKey);
        //  paramObj.orderBy = 'name';
        if (search.data != null && search.data != '') {
            if ('hero' == param.gubun) {
                paramObj.nameStartsWith = search.data;
            } else {
                paramObj.titleStartsWith = search.data;
            }
        }
        axios.get(gubunObj[param.gubun], {
            params: paramObj
        }).then((data) => {
            // setList(data.data.data.results);
            dispatch(changeText(data.data.attributionText));
            callbackFnc(data.data.data.results);
        }).catch((res) => {
            //alert('status::' + res.response.request.status + '\n' + 'statusText::' + res.response.request.statusText);
        })

        let callbackFnc = (data) => {
            let ids = '';
            data.map((result, index) => {
                index == 0 ? ids += result.id : ids += ',' + result.id;
            });
            axios({
                method: "GET",
                url: "http://115.85.180.140:3000/read/" + param.gubun + "?id=" + ids
            }).then(datas => {
                data.map((result, index) => {
                    datas.data.map((result2, index2) => {
                        if (result.id == result2.ITEMID) {
                            result.cnt = result2.CNT;
                        }
                    })
                })
                setList(data);
            }).catch(res => {
                //alert('status::' + res.response.request.status + '\n' + 'statusText::' + res.response.request.statusText);
            });
        }



    }, [search, param])


    return (
        <div style={{ "marginTop": "55px" }}>
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
                                    <div style={{ padding: "11%" }}>
                                        <h1 style={{ 'fontSize': '1.0rem' }}>{param.gubun == 'hero' ? data.name : data.title}</h1>
                                        <h1 style={{ 'fontSize': '1.0rem' }}>readCnt : {data.cnt}</h1>

                                        <Button size="sm" onClick={() => {
                                            if ('hero' == param.gubun) {
                                                navigate('/detail/' + data.id);
                                            } else if ('comics' == param.gubun) {
                                                navigate('/Comicsdetail/' + data.id);
                                            } else {
                                                navigate('/SeriesDetail/' + data.id);
                                            }
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

