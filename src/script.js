const settings = document.getElementById("settings");
const color = document.getElementById("bg-color");
const color2 = document.getElementById("fill-style");
const amount = document.getElementById("amount");

const canvas = document.getElementById("canvas");
c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

if (getParameterByName('amount') != null) {
    amount.value = getParameterByName('amount');
}

if (getParameterByName('bg-color') != null) {
    if ((String(getParameterByName('bg-color')).charAt(0) == "r")) {
        window.addEventListener("load",function() { document.body.style.background = getParameterByName('bg-color') });
        window.addEventListener("load",function() { color.value = getParameterByName('bg-color') });
        color.value = getParameterByName('bg-color');
        c.fillStyle = color.value;
        c.fillRect(0,0,canvas.width,canvas.height);
    } else {
        window.addEventListener("load",function() { document.body.style.background = "#"+getParameterByName('bg-color') });
        window.addEventListener("load",function() { color.value = "#"+getParameterByName('bg-color') });
        color.value = "#"+getParameterByName('bg-color');
        c.fillStyle = color.value;
        c.fillRect(0,0,canvas.width,canvas.height);
    }
}

if (getParameterByName('fill-style') != null) {
    if ((String(getParameterByName('fill-style')).charAt(0) == "r")) {
        c.fillStyle = getParameterByName('fill-style');
        color2.value = getParameterByName('fill-style');
        for (let i = 0; i < amount.value; i++) {
            c.beginPath();
            c.moveTo(canvas.width/amount.value*i, canvas.height);
            c.quadraticCurveTo((canvas.width/amount.value*i)+(canvas.width/amount.value/3), Math.random()*canvas.height/2, canvas.width/amount.value*(i+1), canvas.height);
            c.fill();
        }
    } else {
        c.fillStyle = "#"+getParameterByName('fill-style');
        color2.value = "#"+getParameterByName('fill-style');
        for (let i = 0; i < amount.value; i++) {
            c.beginPath();
            c.moveTo(canvas.width/amount.value*i, canvas.height);
            c.quadraticCurveTo((canvas.width/amount.value*i)+(canvas.width/amount.value/3), Math.random()*canvas.height/2, canvas.width/amount.value*(i+1), canvas.height);
            c.fill();
        }
    }
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function redirect() {
    window.location.replace("?bg-color="+color.value.slice(1)+"&fill-style="+color2.value.slice(1)+"&amount="+amount.value);
}

function exportImg(type) {
    if (type == 'png') {
        const link = document.createElement("a");
        link.href = canvas.toDataURL('image/png');
        link.download = "CSbackground.png";
        link.click();
    }
}

//var grd = c.createLinearGradient(0,0,canvas.width,canvas.height);
//grd.addColorStop(0,"red");
//grd.addColorStop(1,"white");

//console.log(grd)

// Fill with gradient
//c.fillStyle = grd;
//c.fillRect(0,0,canvas.width,canvas.height);