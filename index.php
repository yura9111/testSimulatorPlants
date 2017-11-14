<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="google-signin-client_id" content="951394691187-khk00n2ifp1t4vot30nkqqof11rpu377.apps.googleusercontent.com">
    <title>Lords and War</title>
    <script type="text/javascript" src="vendor/components/underscore/underscore.js"></script>
    <script type="text/javascript" src="model.js"></script>
</head>
<body onload="game.init();">
<div style="margin:10px">
	<canvas width="320px" height="320px" id="canvas" onmousemove="game.mousemove(event)"></canvas>
</div>
Hello world!
<button onclick="game.play()">Play</button>
<button onclick="game.nextTurn()">One Turn</button>
<button onclick="game.stop()">Stop</button>
<button onclick="for(var i=0;i<100;i++){game.nextTurn()}">play 100</button>
<input type="checkbox" value="1" checked="checked" onclick="game.shouldRender = game.shouldRender == true ? false : true;" />
<dl>
    <dt>Age</dt>
    <dd>Определение термина 1</dd>
    <dt>HP</dt>
    <dd>Определение термина 2</dd>
    <dt>Same</dt>
    <dd>Определение термина 1</dd>
    <dt>Different</dt>
    <dd>Определение термина 2</dd>
</dl>
</body>
</html>