import { ts, apiKey, privateKey } from "./Const.js";
import { useEffect, useState } from "react";
import md5 from "md5";
import axios from "axios";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
/*
function getComicsThumbnail(paramObj) {

}
*/

function Detail() {
  let param = useParams();
  let [info, setInfo] = useState({});
  let [thumbnail, setTumbnail] = useState({});
  let [comic, setComic] = useState([]);
  let [urls, setUrls] = useState([]);
  let paramObj = {};
  paramObj.ts = ts;
  paramObj.apikey = apiKey;
  paramObj.hash = md5(ts + privateKey + apiKey);

  useEffect(() => {
    let comicsData = async data => {
      let array = [];
      for (var i = 0; i < data.items.length; i++) {
        let res = await axios
          .get(data.items[i].resourceURI, {
            params: paramObj,
          })
          .then(result => {
            array.push(result);
          })
          .catch(res => {
            alert(res.message);
          });
      }
      setComic(array);
    };

    axios({
      method: "GET",
      url: "https://gateway.marvel.com:443/v1/public/characters/" + param.id,
      params: paramObj,
    })
      .then(data => {
        comicsData(data.data.data.results[0].comics);
        setInfo(data.data.data.results[0]);
        setTumbnail(data.data.data.results[0].thumbnail);
        setUrls(data.data.data.results[0].urls);
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
        <ListGroup className="list-group-flush">
          <ListGroup.Item>{info.description}</ListGroup.Item>
        </ListGroup>
        <ListGroup className="list-group-flush">
          {comic.map((data, index) => {
            console.log(data.data.data.results[0]);
            return (
              <div key={index}>
                <ListGroup.Item>
                  {data.data.data.results[0].title}
                </ListGroup.Item>
                <Card.Img
                  variant="top2"
                  src={
                    data.data.data.results[0].thumbnail.path +
                    "." +
                    data.data.data.results[0].thumbnail.extension
                  }
                ></Card.Img>
              </div>
            );
          })}
        </ListGroup>
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
    </div>
  );
}

export { Detail };
