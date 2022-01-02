<html>
<body>
<button type="button" onclick="loadDoc()">btn</button>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script>
var kakaoAuth = ""; //kakao restApikey
function loadDoc() {
  $.ajax({
    method: "GET",
    url: "https://dapi.kakao.com/v2/search/image?",
    data: { "query" : "태연" },
    headers : {Authorization: "KakaoAK " + kakaoAuth}
  }).done(function (msg) {
    alert("Data Saved: " + msg);
  }).fail(function(error) {
     
  })
}
</script>
</body>
</html>