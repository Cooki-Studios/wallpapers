const settings = document.getElementById("settings");
const color = document.getElementById("bg-color");
const color2 = document.getElementById("fill-style");
const amount = document.getElementById("amount");

if (getParameterByName('bg-color') != null) {
    amount.value = getParameterByName('amount');
}

const canvas = document.getElementById("canvas");
c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

if (getParameterByName('fill-style') != null) {
    if ((String(getParameterByName('fill-style')).charAt(0) == "r")) {
        c.fillStyle = getParameterByName('fill-style');
    } else {
        c.fillStyle = "#"+getParameterByName('fill-style');
    }
}

c.beginPath();
c.moveTo(0, canvas.height);
c.quadraticCurveTo(canvas.width/2, Math.random()*canvas.height/2, canvas.width/amount.value, canvas.height);
c.fill();

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

if (getParameterByName('bg-color') != null) {
    if ((String(getParameterByName('bg-color')).charAt(0) == "r")) {
        window.addEventListener("load",function() { document.body.style.background = getParameterByName('bg-color') });
        window.addEventListener("load",function() { color.value = getParameterByName('bg-color') });
    } else {
        window.addEventListener("load",function() { document.body.style.background = "#"+getParameterByName('bg-color') });
        window.addEventListener("load",function() { color.value = "#"+getParameterByName('bg-color') });
    }
}