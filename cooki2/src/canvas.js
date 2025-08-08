const canvas = document.getElementById("canvas");

const gridSize = 64;
let extraWidth = 2;
let extraHeight = 3;
let offsetX = -gridSize;
let offsetY = -gridSize*1.25;
let gridWidth = Math.floor(canvas.width / gridSize) + extraWidth;
let gridHeight = Math.floor(canvas.height / gridSize) + extraHeight;

const images = ["Cooki", "CookiBite"];

let grid = [];
if (localStorage.getItem("cooki2_wallpaper_grid")) {
    grid = JSON.parse(localStorage.getItem("cooki2_wallpaper_grid"));
}

function resizeCanvas() {
    canvas.innerHTML = '';
    canvas.width = window.innerWidth  + gridSize*extraWidth - gridSize*2;
    canvas.height = window.innerHeight + gridSize*extraHeight;
    canvas.style.width = `${window.innerWidth + gridSize*extraWidth}px`;
    canvas.style.height = `${window.innerHeight + gridSize*extraHeight}px`;
    canvas.style.top = `${offsetY}px`;
    canvas.style.left = `${offsetX}px`;

    gridWidth = Math.floor(canvas.width / gridSize) + extraWidth;
    gridHeight = Math.floor(canvas.height / gridSize) + extraHeight;
    canvas.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;

    for (let y = 0; y < gridHeight; y++) {
        grid[y] = [];
        for (let x = 0; x < gridWidth; x++) {
            let div = document.createElement("div");
            div.className = "tile";
            div.id = `tile_${x}-${y}`;
            grid[y][x] = `url("src/img/${images[Math.floor(images.length * Math.random())]}.svg") 100% 100% / 50% no-repeat`
            div.style.mask = grid[y][x];

            div.onanimationiteration = () => {
                if (grid[y][x+1]) {
                    grid[y][x] = grid[y][x+1];
                    div.style.mask = grid[y][x];
                } else {
                    grid[y][x] = `url("src/img/${images[Math.floor(images.length * Math.random())]}.svg") 100% 100% / 50% no-repeat`
                    div.style.mask = grid[y][x];
                }
            }

            canvas.appendChild(div);
        }
    }
    console.log(grid);
    localStorage.setItem("cooki2_wallpaper_grid", JSON.stringify(grid));
}
resizeCanvas();

window.onresize = resizeCanvas;

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.bgcol) {
            const colours = properties.bgcol.value.split(" ");
            document.documentElement.style.setProperty("--bgCol", `rgb(${colours[0]*255} ${colours[1]*255} ${colours[2]*255})`);
        }
        if (properties.iconcol) {
            const colours = properties.iconcol.value.split(" ");
            document.documentElement.style.setProperty("--iconCol", `rgb(${colours[0]*255} ${colours[1]*255} ${colours[2]*255})`);
        }
    },
};