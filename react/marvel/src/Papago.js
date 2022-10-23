import axios from 'axios';
import { useEffect } from "react";

function Papago(data, lang) {
    console.log('gg');
    useEffect(() => {
        axios({
            method: "POST",
            url: "https://openapi.naver.com/v1/papago/n2mt",
            params: { 'source': 'ko', 'target': 'en', 'text': 'name' },
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Naver-Client-Id': 'tWZ2IcLz4JgeLo6cHMxE',
                'X-Naver-Client-Secret': 'ivWydgLNvB',
                'Access-Control-Allow-Origin': '*'
            },
        }).then(data => {

            console.log(data);
        }).catch(res => {
            alert('status::' + res.response.request.status + '\n' + 'statusText::' + res.response.request.statusText);
        });
    }, [])


    return (
        <div>zzz</div>
    )
}

export { Papago };
