const boxContainer = document.getElementById("boxContainer");
const pastelColors = [
    "#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff",
    "#e4c1f9", "#f694c1", "#c1f0f6", "#fef6e4", "#d3f9d8"
];

let boxes = [];
let gridSize = 16;
let color = pastelColors[0]; // default pastel
let isEraser = false;

const selectGrid = document.getElementById("selectGrid");
const colorPalette = document.getElementById("colorPalette");
const newCanvas = document.getElementById("newCanvas");
const eraserToggle = document.getElementById("eraserToggle");
const saveCanvas = document.getElementById("saveCanvas");
const dimension = document.getElementById("dimension");

// Convert hex to RGB
function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean, 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

// Adds hover behavior to darken cell
function mouseListener(item) {
    item.addEventListener("mouseenter", () => {
        if (isEraser) {
            item.style.backgroundColor = "white";
            item.dataset.darkness = "0";
            return;
        }

        let darkness = parseFloat(item.dataset.darkness || "0");
        if (darkness < 1) {
            darkness += 0.1;
            item.dataset.darkness = darkness.toFixed(1);
        }

        const rgb = hexToRgb(color);
        item.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${darkness})`;
    });
}

// Generate grid of boxes
function drawBoxes(num) {
    boxes = [];
    boxContainer.innerHTML = ""; // clear container
    const size = (800 / gridSize) - 2;

    for (let i = 0; i < num; i++) {
        let box = document.createElement("div");
        box.classList.add("box");
        box.style.width = `${size}px`;
        box.style.height = `${size}px`;
        box.dataset.darkness = "0";
        mouseListener(box);
        boxes.push(box);
    }

    for (let n of boxes) {
        boxContainer.appendChild(n);
    }
}

// Build color palette
colorPalette.innerHTML = "";
for (let pastel of pastelColors) {
    let swatch = document.createElement("div");
    swatch.className = "color";
    swatch.style.backgroundColor = pastel;
    swatch.addEventListener("click", () => {
        color = pastel;
        isEraser = false;
        eraserToggle.textContent = "Eraser: Off";
    });
    colorPalette.appendChild(swatch);
}

// Eraser toggle
eraserToggle.addEventListener("click", () => {
    isEraser = !isEraser;
    eraserToggle.textContent = isEraser ? "Eraser: On" : "Eraser: Off";
});

// Save to image
saveCanvas.addEventListener("click", () => {
    html2canvas(boxContainer).then(canvas => {
        const link = document.createElement("a");
        link.download = `sketch-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
});

// Input validation & new canvas
newCanvas.addEventListener("click", () => {
    gridSize = parseInt(selectGrid.value);
    if (gridSize >= 1 && gridSize <= 240 && Number.isInteger(gridSize)) {
        drawBoxes(gridSize * gridSize);
        dimension.textContent = `${gridSize} X ${gridSize}`;
    } else {
        alert("Enter an appropriate grid size (1–240). No decimals!");
    }
});

// Initial load
dimension.textContent = `${gridSize} X ${gridSize}`;
drawBoxes(gridSize * gridSize);
