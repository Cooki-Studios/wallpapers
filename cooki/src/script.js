let albumCoverArt = null;
let trackTitle = null;
let artist = null;

let lyrics = null;
let lyricsData = null;
let seconds = 0;
let oldDate = 0;
let textModifiers = {
    bold: false,
    italic: false
}

function wallpaperMediaPropertiesListener(event) {
    // Update title and artist labels
    // trackTitle.textContent = event.title;
    // artist.textContent = event.artist;
    lyricsData = null;

    textModifiers = {
        bold: false,
        italic: false
    }

    event.artist = event.artist.replaceAll(" - Topic","");
    event.title = event.title.replaceAll("Fuck","F**k");
    event.title = event.title.replaceAll("fuck","f**k");
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

let textColour = "#000";
const root = document.querySelector(':root');
function wallpaperMediaThumbnailListener(event) {
    // Update album cover art
    // albumCoverArt.src = event.thumbnail;
    document.body.style['background-color'] = event.primaryColor;
    textColour = event.textColor;
    root.style.setProperty('--barColour', textColour);
    // trackTitle.style.color = textColour;
    // artist.style.color = textColour;
}

// Find all required elements
albumCoverArt = document.getElementById('albumCoverArt');
trackTitle = document.getElementById('trackTitle');
artist = document.getElementById('artist');

// Register the media property listener provided by Wallpaper Engine.
window.wallpaperRegisterMediaPropertiesListener(wallpaperMediaPropertiesListener);

// Register the media thumbnail listener provided by Wallpaper Engine.
window.wallpaperRegisterMediaThumbnailListener(wallpaperMediaThumbnailListener);

function secondsCounter() {
    let fadeOutTime = 0;
    if (lyricsData != null) {
        for (let i = 0; i < lyricsData.length; i++) {
            if (lyricsData[i].seconds < seconds+0.5) {
                lyrics = lyricsData[i].lyrics;
                fadeOutTime = lyricsData[i+1].seconds - lyricsData[i].seconds;
            }
        }

        if (document.body.getElementsByTagName("h1").length == 0) {
            let lyricsEl = document.body.appendChild(document.createElement("h1"));
            if (lyrics && lyrics.includes("*")) {
                if (textModifiers.italic) {
                    textModifiers.italic = false;
                } else {
                    textModifiers.italic = true;
                }
                lyrics = lyrics.replaceAll("*","");
            }
            lyricsEl.innerText = lyrics;
            lyricsEl.style.transition = "all "+fadeOutTime+"s";
            lyricsEl.classList.add("lyric");

            for (const modifier in textModifiers) {
                if (textModifiers[modifier] = true) {
                    lyricsEl.classList.add(modifier);
                }
            }

            setTimeout(() => {
                lyricsEl.style.opacity = "0";
                lyricsEl.style.fontSize = 100/lyrics.length+"vw";
            });

            setTimeout(() => {
                lyricsEl.remove();
            }, fadeOutTime*1000);
        } else {
            if (document.body.getElementsByTagName("h1").length > 0 && document.body.getElementsByTagName("h1")[document.body.getElementsByTagName("h1").length-1].innerText != lyrics) {
                let lyricsEl = document.body.appendChild(document.createElement("h1"));
                if (lyrics && lyrics.includes("*")) {
                    if (textModifiers.italic) {
                        textModifiers.italic = false;
                    } else {
                        textModifiers.italic = true;
                    }
                    lyrics = lyrics.replaceAll("*","");
                }
                lyricsEl.innerText = lyrics;
                lyricsEl.style.transition = "all "+fadeOutTime+"s";
                lyricsEl.classList.add("lyric");

                for (const modifier in textModifiers) {
                    if (textModifiers[modifier] = true) {
                        lyricsEl.classList.add(modifier);
                    }
                }

                setTimeout(() => {
                    lyricsEl.style.opacity = "0";
                    lyricsEl.style.fontSize = 100/lyrics.length+"vw";
                });

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
    drawVisualizer();  // Draw the visualizer
    requestAnimationFrame(update);  // Keep animating
}

function drawLines(points) {
    for (let i = 1; i < points.length - 2; i++) {
        const cx = (points[i].x + points[i + 1].x) / 2;
        const cy = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, cx, cy);
    }

    // Draw the final curve
    ctx.quadraticCurveTo(points[points.length - 2].x, points[points.length - 2].y, points[points.length - 1].x, points[points.length - 1].y);
}

let mainAudioArray = null;
function drawVisualizer() {
    if (mainAudioArray != null) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        const barWidth = (canvas.width / (mainAudioArray.length/2)) * 2.5; // Calculate width of each bar
        const barSpacing = 1; // Space between bars

        // Variables for smooth curves
        const points = [];
        const points2 = [];

        // Loop through frequency data and draw bars
        for (let i = 0; i < mainAudioArray.length/2; i++) {
            const value = mainAudioArray[i]; // Get the frequency value for the current bar
            const height = value*128; // The height of each bar will be proportional to the frequency

            // X position of the current bar
            const x = i * (barWidth + barSpacing);

            // Add the current bar point to the points array
            points.push({ x, y: canvas.height - height });

            if (i == 4) {
                document.body.style.transform = "perspective(500px) translate3d(0, 0, "+value*64+"px)";
            }
        }

        // Loop through frequency data and draw bars
        for (let i = mainAudioArray.length/2; i < mainAudioArray.length; i++) {
            const value = mainAudioArray[i]; // Get the frequency value for the current bar
            const height = value*128; // The height of each bar will be proportional to the frequency

            // X position of the current bar
            const x = (i-mainAudioArray.length/2) * (barWidth + barSpacing);

            // Add the current bar point to the points array
            points2.push({ x, y: height });
        }

        // Draw smooth lines between bars
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y); // Start at the first point
        drawLines(points);
        ctx.strokeStyle = textColour+"aa"; // Color for the line
        ctx.lineWidth = 2; // Line width
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(0,canvas.height);
        ctx.lineTo(points[0].x, points[0].y); // Start at the first point
        drawLines(points);
        ctx.lineTo(canvas.width,canvas.height);
        ctx.lineTo(0,canvas.height);
        ctx.closePath();

        ctx.fillStyle = textColour+"55"; // Color for the shape
        ctx.fill();

        // Bars 2
        // Draw smooth lines between bars
        ctx.beginPath();
        ctx.moveTo(points2[0].x, points2[0].y); // Start at the first point
        drawLines(points2);
        ctx.strokeStyle = textColour+"aa"; // Color for the line
        ctx.lineWidth = 2; // Line width
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(points2[0].x, points2[0].y); // Start at the first point
        drawLines(points2);
        ctx.lineTo(canvas.width,0);
        ctx.lineTo(0,0);
        ctx.closePath();

        ctx.fillStyle = textColour+"55"; // Color for the shape
        ctx.fill();
    }
}

function wallpaperAudioListener(audioArray) {
    mainAudioArray = audioArray;
}
window.wallpaperRegisterAudioListener(wallpaperAudioListener);

update();