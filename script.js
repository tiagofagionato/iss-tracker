const interval = 1500; //milliseconds
const lineWidth = 0.1;
const strokeStyle = "#333";

function longitudeLines(ctx, width) {
    var yAxis = width/2;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    for (var xAxis = 0; xAxis <= width; xAxis = xAxis+width/24) {
        ctx.moveTo(xAxis, 0);
        ctx.lineTo(xAxis, yAxis);
        ctx.stroke();
    }
}

function latitudeLines(ctx, height) {
    var xAxis = height*2;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    for (var yAxis = 0; yAxis <= height; yAxis = yAxis+height/12) {
        ctx.moveTo(0, yAxis);
        ctx.lineTo(xAxis, yAxis);
        ctx.stroke();
    }
}

function iss(width, height, center, ctx, issImg) {

    var request = new XMLHttpRequest();
    request.open('GET', "https://api.wheretheiss.at/v1/satellites/25544", true);

    request.onload = function() {

        if (request.status == 200) {

            var data = JSON.parse(this.response);

            var lat = data['latitude'];
            var lon = data['longitude'];

            var width360 = width/360;
            var height180 = height/180;

            var xAxis = center[0] + lon * width360;
            var yAxis = center[1] - lat * height180;

            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();
            ctx.arc(xAxis, yAxis, 25, 0, 2 * Math.PI);
            ctx.drawImage(issImg, xAxis - 25, yAxis - 20, 52, 40);
            ctx.strokeStyle = "red";
            ctx.stroke();

        } else {

            console.log("Error: Status code is not 200.");

        }
    }

    request.send();

}

window.onload = function() {
    
    var mapLayer = document.getElementById('map-layer');
    var issLayer = document.getElementById('iss-layer');
    var mapCtx = mapLayer.getContext('2d');
    var issCtx = issLayer.getContext('2d');

    var width = mapLayer.width;
    var height = mapLayer.height;

    var center = [width/2, height/2];

    var bgImg = new Image();

    bgImg.src = 'assets/images/earthmap.jpg';

    bgImg.onload = function() {

        mapCtx.drawImage(bgImg, 0, 0, width, height);

        longitudeLines(mapCtx, width);
        latitudeLines(mapCtx, height);

        var issImg = new Image();
        issImg.src = 'assets/images/iss.png';

        issImg.onload = function() {
            iss(width, height, center, issCtx, issImg);
            setInterval(iss, interval, width, height, center, issCtx, issImg);
        }

    }

};