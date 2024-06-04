/*
kakaoApi 예제
api 정의 : sw 어플리케이션이 서로 통신하여 데이터 및 기능을 교환할 수 있는
일련의 프로토콜
*/

<html>
  <body>
    <button type="button" onclick="loadDoc()">
      btn
    </button>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script>
      var kakaoAuth = ""; //kakao restApikey function loadDoc(){" "}
      {$.ajax({
        method: "GET",
        url: "https://dapi.kakao.com/v2/search/image?",
        data: { query: "가스공사" },
        headers: { Authorization: "KakaoAK " + kakaoAuth },
      })
        .done(function (msg) {
          alert("Data Saved: " + msg);
        })
        .fail(function (error) {})}
    </script>
  </body>
</html>;
