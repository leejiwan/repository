import { ts, apiKey, privateKey } from "./Const.js";
import { useEffect, useState } from "react";
import md5 from "md5";
import axios from "axios";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from "react-bootstrap/ListGroup";
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';

function Detail() {
  let param = useParams();
  let [info, setInfo] = useState({});
  let [thumbnail, setTumbnail] = useState({});
  let [comic, setComic] = useState([]);
  let [series, setSeries] = useState([]);
  let [isOk1, setOk1] = useState(false);
  let [isOk2, setOk2] = useState(false);

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

  useEffect(() => {
    let detailData = async (data, calllback, stateCallback) => {
      let array = [];
      stateCallback(false);
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
      stateCallback(true);
      calllback(array);
    };

    axios({
      method: "GET",
      url: "https://gateway.marvel.com:443/v1/public/characters/" + param.id,
      params: paramObj,
    })
      .then(data => {
        console.log(data.data.data.results[0])
        detailData(data.data.data.results[0].comics, setComic, setOk1);
        detailData(data.data.data.results[0].series, setSeries, setOk2);
        setInfo(data.data.data.results[0]);
        setTumbnail(data.data.data.results[0].thumbnail);
      })
      .catch(res => {
        alert(res.message);
      });
  }, [param.id]);

  return (
    <div>
      <Card>
        <ListGroup horizontal>
          <div style={{ textAlign: "center" }}>
            <Card.Img
              style={{ width: "27rem" }}
              variant="top"
              src={thumbnail.path + "." + thumbnail.extension}
            />
          </div>
          <Card.Body style={{ position: "relative" }}>
            <Card.Title>{info.name}</Card.Title>
            <Card.Text>{info.description == "" ? "No Description!" : info.description}</Card.Text>
            <Button size="sm" onClick={() => {
              WindowPopup(info.urls[0].url);
            }}>learn more</Button>
            <Card.Body style={{ position: "absolute", bottom: "0", left: "39%" }}>
              <Card.Text >Data provided by Marvel. © 2022 MARVEL</Card.Text>
            </Card.Body>
          </Card.Body>
        </ListGroup>
        <Accordion defaultActiveKey="1">
          <Accordion.Item eventKey="1">
            <Accordion.Header>comics</Accordion.Header>
            <Accordion.Body>
              <ListGroup horizontal style={isOk1 == true ? { overflowX: "auto", whiteSpace: "nowrap" } : { marginLeft: "50%" }}>
                {
                  isOk1 == false ? <SpinnerDom /> :
                    comic.map((data, index) => {
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
                                <div style={{ padding: "12%" }}>
                                  <h1 style={{ 'fontSize': '1.0rem' }}>{data.data.data.results[0].title}</h1>
                                  <Button size="sm" onClick={() => {
                                    WindowPopup(data.data.data.results[0].urls[0].url);
                                  }}>learn more</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                }
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>story</Accordion.Header>
            <Accordion.Body>
              <ListGroup horizontal style={isOk2 == true ? { overflowX: "auto", whiteSpace: "nowrap" } : { marginLeft: "50%" }}>
                {isOk2 == false ? <SpinnerDom /> : series.map((data, index) => {
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
                            <div style={{ padding: "12%" }}>
                              <h1 style={{ 'fontSize': '1.0rem' }}>{data.data.data.results[0].title}</h1>
                              <Button size="lg" onClick={() => {
                                WindowPopup(data.data.data.results[0].urls[0].url);
                              }}>learn more</Button>
                            </div>
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
      </Card>
    </div >
  );
}

function SpinnerDom() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

function WindowPopup(url) {
  window.open(url, "_blank", "width=800, height=700, toolbar=no, menubar=no, scrollbars=no, resizable=yes");
}
export { Detail };
