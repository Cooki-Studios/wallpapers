const settings = document.getElementById("settings");
const color = document.getElementById("color");
const canvas = document.getElementById("canvas");
c = canvas.getContext("2d");

c.fillStyle = "#fff"
c.fillRect(0, 0, canvas.width, canvas.height);

if (getParameterByName('bg-color') != null) {
    if ((String(getParameterByName('bg-color')).charAt(0) == "r")) {
        c.fillStyle = getParameterByName('bg-color');
    } else {
        c.fillStyle = "#"+getParameterByName('bg-color');
    }
}

c.beginPath();
c.moveTo(0, canvas.height);
c.quadraticCurveTo(canvas.width/2, canvas.height/2, canvas.width, canvas.height);
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
    window.location.replace("?bg-color="+color.value.slice(1));
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

settings.style.paddingTop = window.innerHeight+"px";