const settings = document.getElementById("settings");
const color = document.getElementById("bg-color");
const color2 = document.getElementById("fill-style");
const amount = document.getElementById("amount");
const bgType = document.getElementById("bg-type");

const canvas = document.getElementById("canvas");
c = canvas.getContext("2d");

function draw(y){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (getParameterByName('bg-type') != null) {
        bgType.value = getParameterByName('bg-type');
    } else {
        bgType.value = "flat";
    }

    if (getParameterByName('amount') != null) {
        amount.value = getParameterByName('amount');
    }

    if (bgType.value == "flat") {
        if (bgType.value != null) {
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
    } else if (bgType.value == "linear") {
        var grd = c.createLinearGradient(0,0,canvas.width,0);
        grd.addColorStop(0,color.value);
        grd.addColorStop(1,"white");

        // Fill with gradient
        c.fillStyle = grd;
        c.fillRect(0,0,canvas.width,canvas.height);
    } else if (bgType.value == "radial") {
        var grd = c.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.height);
        grd.addColorStop(0,color.valuez);
        grd.addColorStop(1,"white");

        // Fill with gradient
        c.fillStyle = grd;
        c.fillRect(0,0,canvas.width,canvas.height);
    }

    if (getParameterByName('fill-style') != null) {
        if ((String(getParameterByName('fill-style')).charAt(0) == "r")) {
            c.fillStyle = getParameterByName('fill-style');
            color2.value = getParameterByName('fill-style');
        } else {
            c.fillStyle = "#"+getParameterByName('fill-style');
            color2.value = "#"+getParameterByName('fill-style');
        }

        c.beginPath();
        for (let i = 0; i < amount.value; i++) {
            if (i % 2 == 0) {
                c.moveTo(canvas.width/amount.value*i, canvas.height/2);
                c.quadraticCurveTo(canvas.width/amount.value*(i+0.5), y, canvas.width/amount.value*(i+1), canvas.height/2);
            } else {
                c.moveTo(canvas.width/amount.value*i, canvas.height/2);
                c.quadraticCurveTo(canvas.width/amount.value*(i+0.5), y^750, canvas.width/amount.value*(i+1), canvas.height/2);
            }
        }

        c.lineTo(canvas.width,canvas.height);
        c.lineTo(0,canvas.height);
        c.lineTo(0,canvas.height/2);
        c.fill();
    }
}

draw(Math.random()*canvas.height/2);

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function redirect() {
    window.location.replace("?bg-color="+color.value.slice(1)+"&fill-style="+color2.value.slice(1)+"&amount="+amount.value+"&bg-type="+bgType.value);
}

function exportImg(type) {
    if (type == 'png') {
        const link = document.createElement("a");
        link.href = canvas.toDataURL('image/png');
        link.download = "CSbackground.png";
        link.click();
    }
}

var isPaused = true;
var time = 0;
var height = Math.random()*canvas.height/2;

draw(height);

function play(){
    isPaused = false;
}

function pause(){
    isPaused = true;
}

function reload(){
  t = setInterval(function() {
    height = Math.random()*canvas.height/2;

    if (time == 1) {
        time = 0;
        height = Math.random()*canvas.height/2;
        clearInterval(t);
        reload();
    }

    draw(height*time);

    if(!isPaused) {
        time += 0.1;
    }
}, 10);
}