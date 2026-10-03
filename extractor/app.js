const uploadInput = document.getElementById('image-upload');
const zoomSlider = document.getElementById('zoom');
const lockCheckbox = document.getElementById('lock-checkbox');
const boxContainer = document.getElementById('box-container');
const imgEl = document.getElementById('uploaded-image');
const gridOverlay = document.getElementById('grid-overlay');
const cursorLine = document.getElementById('cursor-line');
const measurementControls = document.getElementById('measurement-controls');
const measureSlider = document.getElementById('measure-slider');
const valueDisplay = document.getElementById('current-value');

let state = {
    imgX: 0,
    imgY: 0,
    zoom: 1,
    isDragging: false,
    startX: 0,
    startY: 0,
    locked: false,
    boxWidth: 1000
};

function loadImage(file) {
    const url = URL.createObjectURL(file);
    
    imgEl.onload = () => {
        // Fit exactly to width initially
        const initialZoom = state.boxWidth / imgEl.naturalWidth;
        
        state.imgX = 0;
        state.imgY = 0;
        state.zoom = initialZoom;
        
        // Dynamically set slider boundaries around the initial zoom
        zoomSlider.min = initialZoom * 0.8;
        zoomSlider.max = initialZoom * 1.2;
        zoomSlider.step = initialZoom * 0.001; // extremely fine control
        zoomSlider.value = initialZoom;
        
        updateImageTransform();
    };
    
    imgEl.src = url;
    imgEl.style.display = 'block';
}

// Handle Image Upload
uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        loadImage(file);
    }
});

// Handle Image Paste
window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
        if (item.type.indexOf('image') === 0) {
            const file = item.getAsFile();
            loadImage(file);
            break; // Only load the first image
        }
    }
});

// Handle Zoom
zoomSlider.addEventListener('input', (e) => {
    if (state.locked) return;
    state.zoom = parseFloat(e.target.value);
    updateImageTransform();
});

// Panning Logic (Mouse Drag)
boxContainer.addEventListener('mousedown', (e) => {
    if (state.locked) return;
    state.isDragging = true;
    state.startX = e.clientX - state.imgX;
    state.startY = e.clientY - state.imgY;
});

window.addEventListener('mousemove', (e) => {
    if (!state.isDragging || state.locked) return;
    state.imgX = e.clientX - state.startX;
    state.imgY = e.clientY - state.startY;
    updateImageTransform();
});

window.addEventListener('mouseup', () => {
    state.isDragging = false;
});

// Add wheel support for zoom
boxContainer.addEventListener('wheel', (e) => {
    if (state.locked) return;
    e.preventDefault();
    const step = parseFloat(zoomSlider.step) || 0.002;
    const zoomDelta = e.deltaY > 0 ? -step * 5 : step * 5;
    const minZ = parseFloat(zoomSlider.min) || 0.5;
    const maxZ = parseFloat(zoomSlider.max) || 2;
    state.zoom = Math.max(minZ, Math.min(maxZ, state.zoom + zoomDelta));
    zoomSlider.value = state.zoom;
    updateImageTransform();
});

function updateImageTransform() {
    imgEl.style.transform = `translate(${state.imgX}px, ${state.imgY}px) scale(${state.zoom})`;
}

// Generate Grid
function createGrid() {
    gridOverlay.innerHTML = '';
    // 200 units total (-100 to 100)
    // Box width = 1000px
    // 1 unit = 5px
    // Guideline every 10 units = 50px
    const pixelsPerUnit = state.boxWidth / 200;
    
    for (let i = -100; i <= 100; i += 10) {
        const xPos = (i + 100) * pixelsPerUnit;
        const line = document.createElement('div');
        line.className = 'grid-line' + (i === 0 ? ' major' : '');
        line.style.left = `${xPos}px`;
        
        const label = document.createElement('div');
        label.className = 'grid-label';
        label.textContent = i;
        label.style.left = `${xPos}px`;
        
        gridOverlay.appendChild(line);
        gridOverlay.appendChild(label);
    }
}
createGrid();

// Handle Lock
lockCheckbox.addEventListener('change', (e) => {
    state.locked = e.target.checked;
    if (state.locked) {
        boxContainer.classList.add('locked');
        gridOverlay.classList.remove('hidden');
        cursorLine.classList.remove('hidden');
        measurementControls.classList.remove('hidden');
        zoomSlider.disabled = true;
    } else {
        boxContainer.classList.remove('locked');
        gridOverlay.classList.add('hidden');
        cursorLine.classList.add('hidden');
        measurementControls.classList.add('hidden');
        zoomSlider.disabled = false;
    }
});

// Measurement Cursor
measureSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    valueDisplay.textContent = Math.round(val);
    
    // Position the cursor line
    // val goes from -100 to 100.
    // 0 is 50%, -100 is 0%, 100 is 100%
    const percent = ((val + 100) / 200) * 100;
    cursorLine.style.left = `${percent}%`;
});

// Click on the locked box to move cursor directly to mouse position
boxContainer.addEventListener('click', (e) => {
    if (!state.locked) return;
    const rect = boxContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / state.boxWidth));
    const val = Math.round((percent * 200) - 100);
    
    measureSlider.value = val;
    // trigger input event manually to update slider and UI
    measureSlider.dispatchEvent(new Event('input'));
});
