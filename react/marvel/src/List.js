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
import { TopButton } from "./Topbutton"
import Card from 'react-bootstrap/Card';
import { EyeFill, HandThumbsUp } from 'react-bootstrap-icons';
import { mavelAddress, serverAddress } from './Const';

//https://developer.marvel.com/docs#!/public/getCreatorCollection_get_0
function ListData(search) {
    let param = useParams();
    let [list, setList] = useState([]);
    let navigate = useNavigate();
    let dispatch = useDispatch();

    let gubunObj =
    {
        'hero': mavelAddress + 'characters',
        'comics': mavelAddress + 'comics',
        'series': mavelAddress + 'series'
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
            callbackFnc(data.data.data.results, 'read');
            callbackFnc(data.data.data.results, 'sympathy');
        }).catch((res) => {
            //alert('status::' + res.response.request.status + '\n' + 'statusText::' + res.response.request.statusText);
        })

        let callbackFnc = (data, gubun) => {
            let ids = '';
            data.map((result, index) => {
                index == 0 ? ids += result.id : ids += ',' + result.id;
            });
            axios({
                method: "GET",
                url: serverAddress + gubun + "/" + param.gubun + "?id=" + ids
            }).then(datas => {
                console.log(gubun)
                data.map((result, index) => {
                    datas.data.map((result2, index2) => {
                        if ('read' == gubun && result.id == result2.ITEMID) {
                            console.log('result.id:::' + result.id);
                            console.log('readCnt:::' + result2.CNT);
                            result['readCnt'] = result2.CNT;
                        }
                        if ('sympathy' == gubun && result.id == result2.ITEMID) {
                            console.log('result.id:::' + result.id);
                            console.log('sympathyCnt:::' + result2.CNT);
                            result['sympathyCnt'] = result2.CNT;
                        }
                    })
                })
                console.log('-------------------------');
                console.log(data)
                setList(data);
            }).catch(res => {
                //alert('status::' + res.response.request.status + '\n' + 'statusText::' + res.response.request.statusText);
            });
        }


    }, [search, param])


    return (
        <div style={{ "marginTop": "55px" }}>
            {
                <Row xs={1} md={5} className="g-5" style={{ "--bs-gutter-x": "-10rem", "--bs-gutter-y": "1rem" }}>
                    {list.map((data, idx) => (
                        <Card style={{ width: '18rem' }} key={idx}>
                            <Card.Img variant="top" style={{ cursor: 'pointer' }} src={
                                data.thumbnail.path +
                                "." +
                                data.thumbnail.extension
                            } onClick={() => {
                                if ('hero' == param.gubun) {
                                    navigate('/detail/' + data.id);
                                } else if ('comics' == param.gubun) {
                                    navigate('/Comicsdetail/' + data.id);
                                } else {
                                    navigate('/SeriesDetail/' + data.id);
                                }
                            }} />
                            <Card.Body>
                                <Card.Title >
                                    {param.gubun == 'hero' ? data.name : data.title}
                                </Card.Title>
                                <Card.Text>
                                    {data.description == '' ? 'No description' : data.description}
                                </Card.Text>
                                <Card.Text style={{ float: 'right' }}>
                                    <EyeFill></EyeFill>{(typeof data.readCnt == 'undefined') ? 0 : data.readCnt}
                                    <HandThumbsUp style={{ cursor: 'pointer' }} onClick={() => {
                                        axios({
                                            method: "POST",
                                            url: serverAddress + "sympathy/" + param.gubun + "?id=" + data.id
                                        }).then(datas => {
                                            let temp = [...list];
                                            temp.forEach((tempData, index, array) => {
                                                if (tempData.id == data.id) {
                                                    if (typeof tempData.sympathyCnt == 'undefined') {
                                                        tempData.sympathyCnt = 1;
                                                    } else {
                                                        tempData.sympathyCnt = tempData.sympathyCnt + 1;
                                                    }

                                                }
                                            })
                                            setList(temp);
                                        }).catch(res => {
                                            //alert('status::' + res.response.request.status + '\n' + 'statusText::' + res.response.request.statusText);
                                        });

                                    }}></HandThumbsUp>{(typeof data.sympathyCnt == 'undefined') ? 0 : data.sympathyCnt}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        /*
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



            */
                    ))}
                    <TopButton />
                </Row>
            }
            <FooterV1 />
        </div >
    );
}

export { ListData };

