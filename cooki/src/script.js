let albumCoverArt = null;
let trackTitle = null;
let artist = null;

let lyrics = null;
let oldLyrics = 0;
let lyricsData = null;
let seconds = 0;
let oldDate = 0;
let textModifiers = {
    bold: false,
    italic: false
};

function wallpaperMediaPropertiesListener(event) {
    lyricsData = null;

    textModifiers = {
        bold: false,
        italic: false
    };

    event.artist = event.artist.replaceAll(" - Topic","");
    event.title = event.title.replaceAll("Fuck","F**k");
    event.title = event.title.replaceAll("fuck","f**k");
    console.log("\""+event.artist+"\"")
    if (event.artist != null && event.artist != "Advertisement") {
        let url = "https://pega-a-letra-pro-pai.onrender.com/api/lyrics?song="+event.title+"&artist="+event.artist;
        console.log(url);
        if (window.localStorage.getItem(url) === null) {
            fetch(url).then(function(response) {
                return response.json();
            }).then(function(data) {
                lyricsData = data;
                window.localStorage.setItem(url, JSON.stringify(lyricsData));
            }).catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
        } else {
            lyricsData = JSON.parse(window.localStorage.getItem(url));
        }
    }
}

let textColour = "#000";
const root = document.querySelector(':root');
function wallpaperMediaThumbnailListener(event) {
    document.body.style['background-color'] = event.primaryColor;
    textColour = event.textColor;
    root.style.setProperty('--barColour', textColour);
}

albumCoverArt = document.getElementById('albumCoverArt');
trackTitle = document.getElementById('trackTitle');
artist = document.getElementById('artist');

window.wallpaperRegisterMediaPropertiesListener(wallpaperMediaPropertiesListener);
window.wallpaperRegisterMediaThumbnailListener(wallpaperMediaThumbnailListener);

function secondsCounter() {
    let fadeOutTime = 0;
    if (lyricsData != null) {
        for (let i = 0; i < lyricsData.length; i++) {
            if (lyricsData[i].seconds < seconds+0.5) {
                if (oldLyrics < i) {
                    lyrics = null;
                } else {
                    lyrics = lyricsData[i].lyrics;
                }
                oldLyrics = i;
                fadeOutTime = lyricsData[i+1].seconds - lyricsData[i].seconds;
            }
        }

        if (lyrics != null) {
            console.log(lyrics);
            let lyricsEl = document.body.appendChild(document.createElement("h1"));
            if (lyrics != null) {
                if (lyrics.includes("*")) {
                    if (textModifiers.italic) {
                        textModifiers.italic = false;
                    } else {
                        textModifiers.italic = true;
                    }
                    lyrics = lyrics.replaceAll("*","");
                }
                lyricsEl.innerText = lyrics;
                lyricsEl.style.transition = "all "+fadeOutTime+"s";
                lyricsEl.style.fontSize = "0";
                lyricsEl.style.opacity = "1";
                lyricsEl.classList.add("lyric");

                for (const modifier in textModifiers) {
                    if (textModifiers[modifier] == true) {
                        lyricsEl.classList.add(modifier);
                    }
                }

                setTimeout(() => {
                    // lyricsEl.style.opacity = "0";
                    lyricsEl.style.fontSize = 100/lyrics.length+"vw";
                }, 1);

                setTimeout(() => {
                    lyricsEl.remove();
                }, fadeOutTime*1000);
            }
        }
    }

    if (oldDate == 0) {
        oldDate = Date.now();
    }
    seconds += (Date.now() - oldDate)/1000;
    oldDate = Date.now();
}

let secondsInt = window.setInterval(secondsCounter);

function wallpaperMediaPlaybackListener(event) {
    if (event.state == window.wallpaperMediaIntegration.PLAYBACK_PAUSED || event.state == window.wallpaperMediaIntegration.PLAYBACK_STOPPED) {
        window.clearInterval(secondsInt);
    } else if (event.state == window.wallpaperMediaIntegration.PLAYBACK_PLAYING) {
        secondsInt = window.setInterval(secondsCounter);
    }
}
window.wallpaperRegisterMediaPlaybackListener(wallpaperMediaPlaybackListener);

function mediaTimelineListener(event) {
    seconds = event.position;
}
window.wallpaperRegisterMediaTimelineListener(mediaTimelineListener);

const canvas = document.body.appendChild(document.createElement("canvas"));
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

// Function to update and draw the visualizer
function update() {
    requestAnimationFrame(update);  // Keep animating
}

let mainAudioArray = null;

function drawLines(points) {
    for (let i = 1; i < points.length - 2; i++) {
        const cx = (points[i].x + points[i + 1].x) / 2;
        const cy = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, cx, cy);
    }

    // Draw the final curve
    ctx.quadraticCurveTo(points[points.length - 2].x, points[points.length - 2].y, points[points.length - 1].x, points[points.length - 1].y);
}

function drawVisualizer() {
    if (mainAudioArray != null && mainAudioArray.every(value => value !== 0)) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        const barWidth = (canvas.width / (mainAudioArray.length / 2)) * 2.5; // Width of bars
        const barSpacing = 1; // Space between bars

        // Arrays to store points for smooth curve drawing
        const topPoints = [];
        const bottomPoints = [];
        const leftPoints = [];
        const rightPoints = [];

        // Loop through frequency data and calculate the points for each side
        for (let i = 0; i < mainAudioArray.length / 4; i++) {
            const value = mainAudioArray[i];
            const height = value * 128;

            // Top Edge Points
            if (height > 0) {
                topPoints.push({ x: i * (barWidth + barSpacing), y: height });
            }

            // Bottom Edge Points
            if (height > 0) {
                bottomPoints.push({ x: i * (barWidth + barSpacing), y: canvas.height - height });
            }

            // Left Edge Points
            if (height > 0) {
                leftPoints.push({ x: height, y: i * (barWidth + barSpacing) });
            }

            // Right Edge Points
            if (height > 0) {
                rightPoints.push({ x: canvas.width - height, y: i * (barWidth + barSpacing) });
            }
        }

        // Draw smooth lines for each edge with the existing function
        if (topPoints.length > 1) {
            ctx.beginPath();
            ctx.moveTo(topPoints[0].x, topPoints[0].y);
            drawLines(topPoints);
            ctx.strokeStyle = textColour + "aa"; // Smooth line color
            ctx.lineWidth = 2; // Line width
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.moveTo(topPoints[0].x, topPoints[0].y);
            drawLines(topPoints);
            ctx.lineTo(canvas.width,0);
            ctx.lineTo(0,0);
            ctx.closePath();

            // const gradient = ctx.createLinearGradient(0, 0, 0, topPoints[0].y);
            // gradient.addColorStop(0, textColour+"55");
            // gradient.addColorStop(1, textColour+"00");

            // ctx.fillStyle = gradient; // Color for the shape
            ctx.fillStyle = textColour+"55"; // Color for the shape
            ctx.fill();
        }

        if (bottomPoints.length > 1) {
            ctx.beginPath();
            ctx.moveTo(bottomPoints[0].x, bottomPoints[0].y);
            drawLines(bottomPoints);
            ctx.strokeStyle = textColour + "aa"; // Smooth line color
            ctx.lineWidth = 2; // Line width
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0,canvas.height);
            ctx.moveTo(bottomPoints[0].x, bottomPoints[0].y);
            drawLines(bottomPoints);
            ctx.lineTo(canvas.width,canvas.height);
            ctx.lineTo(0,canvas.height);
            ctx.closePath();

            ctx.fillStyle = textColour+"55"; // Color for the shape
            ctx.fill();
        }

        if (leftPoints.length > 1) {
            ctx.beginPath();
            ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
            drawLines(leftPoints);
            ctx.strokeStyle = textColour + "aa"; // Smooth line color
            ctx.lineWidth = 2; // Line width
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(0,0);
            ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
            drawLines(leftPoints);
            ctx.lineTo(0,canvas.height);
            ctx.lineTo(0,0);
            ctx.closePath();

            ctx.fillStyle = textColour+"55"; // Color for the shape
            ctx.fill();
        }

        if (rightPoints.length > 1) {
            ctx.beginPath();
            ctx.moveTo(rightPoints[0].x, rightPoints[0].y);
            drawLines(rightPoints);
            ctx.strokeStyle = textColour + "aa"; // Smooth line color
            ctx.lineWidth = 2; // Line width
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.moveTo(canvas.width,0);
            ctx.moveTo(rightPoints[0].x, rightPoints[0].y);
            drawLines(rightPoints);
            ctx.lineTo(canvas.width,canvas.height);
            ctx.lineTo(canvas.width,0);
            ctx.closePath();

            ctx.fillStyle = textColour+"55"; // Color for the shape
            ctx.fill();
        }
    }
}

function wallpaperAudioListener(audioArray) {
    mainAudioArray = audioArray;
    drawVisualizer();
}
window.wallpaperRegisterAudioListener(wallpaperAudioListener);

update();
