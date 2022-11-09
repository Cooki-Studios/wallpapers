function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function redirect() {
    window.location.replace("?bg-color="+document.getElementById("color").value.slice(1));
}

if (getParameterByName('bg-color').charAt(0) == r) {
    window.addEventListener("load",function() { document.body.style.background = getParameterByName('bg-color') });
    window.addEventListener("load",function() { document.getElementById("color").value = getParameterByName('bg-color') });
} else {
    window.addEventListener("load",function() { document.body.style.background = "#"+getParameterByName('bg-color') });
    window.addEventListener("load",function() { document.getElementById("color").value = "#"+getParameterByName('bg-color') });
}
document.getElementById("settings").style.paddingTop = window.innerHeight+"px";