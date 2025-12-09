const interval = 1500; // milliseconds
const lineWidth = 0.1;
const strokeStyle = "#333";
const apiURL = "https://api.wheretheiss.at/v1/satellites/25544";

function drawLines(ctx, count, length, horizontal = false) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;

    const step = length / count;

    for (let i = 0; i <= count; i++) {
        const pos = i * step;

        ctx.beginPath();
        if (horizontal) {
            ctx.moveTo(0, pos);
            ctx.lineTo(length * 2, pos);
        } else {
            ctx.moveTo(pos, 0);
            ctx.lineTo(pos, length / 2);
        }
        ctx.stroke();
    }
}

function drawISS(width, height, center, ctx, issImg) {
    fetch(apiURL)
        .then(res => res.json())
        .then(data => {
            const { latitude: lat, longitude: lon } = data;

            const x = center[0] + (lon * (width / 360));
            const y = center[1] - (lat * (height / 180));

            ctx.clearRect(0, 0, width, height);

            ctx.beginPath();
            ctx.arc(x, y, 25, 0, Math.PI * 2);
            ctx.strokeStyle = "red";
            ctx.stroke();

            ctx.drawImage(issImg, x - 25, y - 20, 52, 40);
        })
        .catch(() => console.log("Erro ao obter dados da ISS."));
}

window.onload = function () {
    const mapLayer = document.getElementById("map-layer");
    const issLayer = document.getElementById("iss-layer");

    const mapCtx = mapLayer.getContext("2d");
    const issCtx = issLayer.getContext("2d");

    const width = mapLayer.width;
    const height = mapLayer.height;
    const center = [width / 2, height / 2];

    const bgImg = new Image();
    bgImg.src = "assets/images/earthmap.jpg";

    bgImg.onload = function () {
        mapCtx.drawImage(bgImg, 0, 0, width, height);

        drawLines(mapCtx, 24, width);         // longitudes
        drawLines(mapCtx, 12, height, true);  // latitudes

        const issImg = new Image();
        issImg.src = "assets/images/iss.png";

        issImg.onload = function () {
            drawISS(width, height, center, issCtx, issImg);
            setInterval(() => drawISS(width, height, center, issCtx, issImg), interval);
        };
    };
};
