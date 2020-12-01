<%--
	Apache-2.0 shaka-player.compiled.js 사용
 	shakaPlayer(MPEG-DASH)로 영상을 재생하는 page	
 	1. shaka-player.compiled.js 다운로드 경로 -- https://cdnjs.cloudflare.com/ajax/libs/shaka-player/2.4.1/shaka-player.compiled.js
 	2. 크롬, IE11지원  // IE10 이하로는 안된다고 함
 	3. IE Promise 지원을 위한 bluebird.min.js
	4. wowza 체험판라이센스 사용시 cors 스크립트 에러가 나옴 // 정식 라이센스 사용시 cors 오류 없음
--%>
<script src="cdn.jsdelivr.net/bluebird/latest/bluebird.js"></script>
<script src="cdnjs.cloudflare.com/ajax/libs/shaka-player/2.4.1/shaka-player.compiled.js"></script>
<script type="text/javascript">
	var path = <%= request.getParameter('path') %>; //동영상 저장 경로
    var url =  'localhost:8080' + '/vod/_definst_/mp4:' + path + '/manifest.mpd'; //'localhost:8080' <- 해당 ip

    var player = new shaka.Player(document.getElementById("shakaVideo"));
    //playerLoad
    player.load(url).then(function() {
    	console.log('load player'); 
    }) 
</script>
<!DOCTYPE html">
<html>
<head>
<meta charset="UTF-8">
</head>
<body>
    <div id="container3" class="player" style="display:block;width:100%;height:98%;">
		<video id="shakaVideo" controls = "controls" style="width:100%;height:100%;outline: 0px solid transparent;"></video>
	</div>
</body>
</html>
