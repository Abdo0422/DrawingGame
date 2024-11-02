const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const colorOptions = document.getElementById('color-options');
const brushSize = document.getElementById('brush-size');
const clearButton = document.getElementById('clear-canvas');
const downloadButton = document.getElementById('download-button');
const shapePicker = document.getElementById('shape-picker');

canvas.width = window.innerWidth < 820 ? window.innerWidth - 40 : 800;
canvas.height = 600;

let painting = false;
let shape = 'draw';
let startX, startY;
let shapes = [];

function startPosition(e) {
    painting = true;
    startX = e.clientX - canvas.offsetLeft;
    startY = e.clientY - canvas.offsetTop;
    if (shape === 'draw') {
        draw(e);
    }
}

function endPosition(e) {
    if (shape !== 'draw' && painting) {
        const shapeData = {
            type: shape,
            color: colorPicker.value,
            size: brushSize.value,
            startX: startX,
            startY: startY,
            endX: e.clientX - canvas.offsetLeft,
            endY: e.clientY - canvas.offsetTop
        };
        shapes.push(shapeData);
        drawShape(shapeData);
    }
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;

    ctx.lineWidth = brushSize.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;

    if (shape === 'draw') {
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }
}

function drawShape(shapeData) {
    ctx.lineWidth = shapeData.size;
    ctx.strokeStyle = shapeData.color;
    ctx.beginPath();

    switch (shapeData.type) {
        case 'rectangle':
            ctx.rect(shapeData.startX, shapeData.startY, shapeData.endX - shapeData.startX, shapeData.endY - shapeData.startY);
            ctx.stroke();
            break;
        case 'circle':
            const radius = Math.sqrt(Math.pow(shapeData.endX - shapeData.startX, 2) + Math.pow(shapeData.endY - shapeData.startY, 2));
            ctx.arc(shapeData.startX, shapeData.startY, radius, 0, Math.PI * 2);
            ctx.stroke();
            break;
        case 'line':
            ctx.moveTo(shapeData.startX, shapeData.startY);
            ctx.lineTo(shapeData.endX, shapeData.endY);
            ctx.stroke();
            break;
        case 'bucket':
            fillCanvas(shapeData.color);
            break;
    }
}

function fillCanvas(color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes = [];
}

function downloadCanvas() {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
clearButton.addEventListener('click', clearCanvas);
downloadButton.addEventListener('click', downloadCanvas);

shapePicker.addEventListener('change', (e) => {
    shape = e.target.value;
});

colorOptions.addEventListener('change', (e) => {
    colorPicker.value = e.target.value;
});
