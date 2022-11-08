function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

window.addEventListener("load",function() { document.body.style.background = "#"+getParameterByName('bg-color') });
window.addEventListener("load",function() { document.getElementById("color").value = "#"+getParameterByName('bg-color') });
document.getElementById("color").addEventListener("input",function() { window.location.replace("http://cooki-studios.github.io/wallpapers?bg-color="+document.getElementById("color").value) });