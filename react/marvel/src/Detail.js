import { ts, apiKey, privateKey } from "./Const.js";
import { useEffect, useState } from "react";
import md5 from "md5";
import axios from "axios";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Accordion from 'react-bootstrap/Accordion';
import { Footer } from './Footer.js'



function Detail() {
  let param = useParams();
  let [info, setInfo] = useState({});
  let [thumbnail, setTumbnail] = useState({});
  let [comic, setComic] = useState([]);
  let [series, setSeries] = useState([]);
  let [urls, setUrls] = useState([]);
  let [foot, setFoot] = useState('');

  let paramObj = {};
  paramObj.ts = ts;
  paramObj.apikey = apiKey;
  paramObj.hash = md5(ts + privateKey + apiKey);

  let style = {
    display: "inline-block",
    margin: "0px",
    marginRight: "15px",
    padding: "0px",
    float: "left",
  }; //li
  let style2 = {
    overflowX: "auto",
    whiteSpace: "nowrap",
  }; //ul
  useEffect(() => {
    let detailData = async (data, calllback) => {
      let array = [];
      let array2 = [];
      for (var i = 0; i < data.items.length; i++) {
        await axios.get(data.items[i].resourceURI, {
          params: paramObj,
        })
          .then(result => {
            array.push(result);
          })
          .catch(res => {
            alert(res.message);
          });
      }
      calllback(array);
    };

    axios({
      method: "GET",
      url: "https://gateway.marvel.com:443/v1/public/characters/" + param.id,
      params: paramObj,
    })
      .then(data => {
        detailData(data.data.data.results[0].comics, setComic);
        detailData(data.data.data.results[0].series, setSeries);
        setInfo(data.data.data.results[0]);
        setTumbnail(data.data.data.results[0].thumbnail);
        setUrls(data.data.data.results[0].urls);
        setFoot(data.data.data.results[0].attributionHTML);
      })
      .catch(res => {
        alert(res.message);
      });
  }, [param.id]);

  return (
    <div>
      <Card>
        <div style={{ textAlign: "center" }}>
          <Card.Img
            style={{ width: "27rem" }}
            variant="top"
            src={thumbnail.path + "." + thumbnail.extension}
          />
        </div>
        <Card.Body>
          <Card.Title>{info.name}</Card.Title>
          <Card.Text></Card.Text>
        </Card.Body>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>description</Accordion.Header>
            <Accordion.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>{info.description}</ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>comics</Accordion.Header>
            <Accordion.Body>
              <ListGroup horizontal style={style2}>
                {comic.map((data, index) => {
                  return (
                    <div key={index} style={style}>
                      <div className="flip-card">
                        <div className="flip-card-inner">
                          <div className="flip-card-front">
                            <img src={
                              data.data.data.results[0].thumbnail.path +
                              "." +
                              data.data.data.results[0].thumbnail.extension
                            } alt="img" style={{ width: '100%', height: '100%' }} />
                          </div>
                          <div className="flip-card-back">
                            <h1 style={{ 'fontSize': '1.0rem' }}>{data.data.data.results[0].title}</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>story</Accordion.Header>
            <Accordion.Body>
              <ListGroup horizontal style={style2}>
                {series.map((data, index) => {
                  return (
                    <div key={index} style={style}>
                      <div className="flip-card">
                        <div className="flip-card-inner">
                          <div className="flip-card-front">
                            <img src={
                              data.data.data.results[0].thumbnail.path +
                              "." +
                              data.data.data.results[0].thumbnail.extension
                            } alt="img" style={{ width: '100%', height: '100%' }} />
                          </div>
                          <div className="flip-card-back">
                            <h1 style={{ 'fontSize': '1.0rem' }}>{data.data.data.results[0].title}</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Card.Body>
          {urls.map((data, index) => {
            return (
              <div key={index}>
                <Card.Link href={data.url}>{data.type}</Card.Link>
              </div>
            );
          })}
        </Card.Body>
      </Card>
    </div >
  );
}

export { Detail };
