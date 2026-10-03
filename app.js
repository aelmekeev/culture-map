import { scales, countries } from './data.js';

let state = {
    viewMode: 'absolute', // 'absolute' | 'relative'
    baseCountry: 'US',
    selectedCountries: new Set(['US', 'JP', 'DE']),
    searchQuery: ''
};

// DOM Elements
const btnAbsolute = document.getElementById('btn-absolute');
const btnRelative = document.getElementById('btn-relative');
const baseCountrySelector = document.getElementById('base-country-selector');
const baseCountrySelect = document.getElementById('base-country');
const searchInput = document.getElementById('country-search');
const countryListEl = document.getElementById('country-list');
const btnSelectAll = document.getElementById('btn-select-all');
const btnClearAll = document.getElementById('btn-clear-all');
const chartContainer = document.getElementById('chart-container');

// SVG Setup
const SVG_NS = "http://www.w3.org/2000/svg";
const width = 1000;
const height = 800;
const padding = { top: 60, right: 200, bottom: 60, left: 200 };
const plotWidth = width - padding.left - padding.right;
const plotHeight = height - padding.top - padding.bottom;
const scaleSpacing = plotHeight / (scales.length - 1);

let svg = document.createElementNS(SVG_NS, "svg");
svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
chartContainer.appendChild(svg);

// SVG Groups
const gDiffs = document.createElementNS(SVG_NS, "g"); // For difference highlights
const gScales = document.createElementNS(SVG_NS, "g");
const gPaths = document.createElementNS(SVG_NS, "g");
const gPoints = document.createElementNS(SVG_NS, "g");

svg.appendChild(gDiffs);
svg.appendChild(gScales);
svg.appendChild(gPaths);
svg.appendChild(gPoints);

// Initialize UI
function init() {
    // Populate base country select
    Object.values(countries).sort((a, b) => a.name.localeCompare(b.name)).forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        baseCountrySelect.appendChild(option);
    });
    baseCountrySelect.value = state.baseCountry;

    // Event Listeners
    btnAbsolute.addEventListener('click', () => setViewMode('absolute'));
    btnRelative.addEventListener('click', () => setViewMode('relative'));
    baseCountrySelect.addEventListener('change', (e) => {
        state.baseCountry = e.target.value;
        if (!state.selectedCountries.has(state.baseCountry)) {
            state.selectedCountries.add(state.baseCountry);
            renderCountryList();
        }
        renderChart();
    });
    
    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        renderCountryList();
    });

    btnSelectAll.addEventListener('click', () => {
        Object.keys(countries).forEach(id => state.selectedCountries.add(id));
        renderCountryList();
        renderChart();
    });

    btnClearAll.addEventListener('click', () => {
        state.selectedCountries.clear();
        if (state.viewMode === 'relative') {
            state.selectedCountries.add(state.baseCountry); // Keep base country
        }
        renderCountryList();
        renderChart();
    });

    renderCountryList();
    renderChart();
}

function setViewMode(mode) {
    state.viewMode = mode;
    if (mode === 'absolute') {
        btnAbsolute.classList.add('active');
        btnRelative.classList.remove('active');
        baseCountrySelector.classList.add('hidden');
    } else {
        btnRelative.classList.add('active');
        btnAbsolute.classList.remove('active');
        baseCountrySelector.classList.remove('hidden');
        if (!state.selectedCountries.has(state.baseCountry)) {
             state.selectedCountries.add(state.baseCountry);
             renderCountryList();
        }
    }
    renderCountryList();
    renderChart();
}

function renderCountryList() {
    countryListEl.innerHTML = '';
    const sortedCountries = Object.values(countries).sort((a, b) => {
        const aSelected = state.selectedCountries.has(a.id);
        const bSelected = state.selectedCountries.has(b.id);
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return a.name.localeCompare(b.name);
    });
    
    sortedCountries.forEach(country => {
        if (state.searchQuery && !country.name.toLowerCase().includes(state.searchQuery)) {
            return;
        }

        const item = document.createElement('label');
        item.className = 'country-item';
        
        const colorIndicator = document.createElement('div');
        colorIndicator.className = 'country-color-indicator';
        colorIndicator.style.backgroundColor = country.color;

        const nameSpan = document.createElement('span');
        nameSpan.textContent = country.name;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = state.selectedCountries.has(country.id);
        
        if (state.viewMode === 'relative' && country.id === state.baseCountry) {
            checkbox.disabled = true; // Cannot unselect base country
        }

        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                state.selectedCountries.add(country.id);
            } else {
                state.selectedCountries.delete(country.id);
            }
            renderCountryList();
            renderChart();
        });

        item.appendChild(colorIndicator);
        item.appendChild(nameSpan);
        item.appendChild(checkbox);
        countryListEl.appendChild(item);
    });
}

// Charting Logic
function getX(val, scaleOffset = 0) {
    // val is between -100 and 100
    // center is padding.left + plotWidth/2
    // offset shifts the entire scale so that the base country aligns vertically
    const center = padding.left + plotWidth / 2;
    const pixelPerUnit = (plotWidth / 2) / 100;
    return center + (val * pixelPerUnit) - (scaleOffset * pixelPerUnit);
}

function getY(scaleIndex) {
    return padding.top + (scaleIndex * scaleSpacing);
}

function renderChart() {
    // Clear SVGs
    gScales.innerHTML = '';
    gPaths.innerHTML = '';
    gPoints.innerHTML = '';
    gDiffs.innerHTML = '';

    const isRelative = state.viewMode === 'relative';
    const baseData = isRelative ? countries[state.baseCountry].data : null;

    // 1. Render Scales
    scales.forEach((scale, i) => {
        const y = getY(i);
        const offset = (isRelative && baseData[scale.id] !== null) ? baseData[scale.id] : 0;
        
        const xStart = getX(-100, offset);
        const xEnd = getX(100, offset);

        // Scale line
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", xStart);
        line.setAttribute("y1", y);
        line.setAttribute("x2", xEnd);
        line.setAttribute("y2", y);
        line.setAttribute("class", "scale-line");
        gScales.appendChild(line);

        // Title
        const title = document.createElementNS(SVG_NS, "text");
        title.textContent = scale.name;
        // In relative mode, keep titles centered, or let them move? Let's fix them at center.
        title.setAttribute("x", padding.left + plotWidth / 2);
        title.setAttribute("y", y - 25);
        title.setAttribute("class", "scale-title");
        gScales.appendChild(title);

        // Labels
        const labelLeft = document.createElementNS(SVG_NS, "text");
        labelLeft.textContent = scale.left;
        labelLeft.setAttribute("x", xStart);
        labelLeft.setAttribute("y", y - 10);
        labelLeft.setAttribute("class", "scale-label left");
        gScales.appendChild(labelLeft);

        const labelRight = document.createElementNS(SVG_NS, "text");
        labelRight.textContent = scale.right;
        labelRight.setAttribute("x", xEnd);
        labelRight.setAttribute("y", y - 10);
        labelRight.setAttribute("class", "scale-label right");
        gScales.appendChild(labelRight);
        
        // Tick marks
        for (let v = -100; v <= 100; v += 25) {
            const tickX = getX(v, offset);
            const tick = document.createElementNS(SVG_NS, "line");
            tick.setAttribute("x1", tickX);
            tick.setAttribute("y1", y - 5);
            tick.setAttribute("x2", tickX);
            tick.setAttribute("y2", v === 0 ? y + 10 : y + 5);
            tick.setAttribute("stroke", v === 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)");
            tick.setAttribute("stroke-width", v === 0 ? "2" : "1");
            tick.setAttribute("class", "scale-tick");
            gScales.appendChild(tick);
        }
    });

    // 2. Render Difference Highlights (only if exactly 2 countries in relative view)
    const selectedArray = Array.from(state.selectedCountries);
    if (isRelative && selectedArray.length === 2) {
        const otherId = selectedArray.find(id => id !== state.baseCountry);
        const otherData = countries[otherId].data;
        
        for (let i = 0; i < scales.length - 1; i++) {
            const scale1 = scales[i].id;
            const scale2 = scales[i+1].id;
            
            if (baseData[scale1] === null || baseData[scale2] === null || 
                otherData[scale1] === null || otherData[scale2] === null) {
                continue;
            }
            
            const offset1 = baseData[scale1];
            const offset2 = baseData[scale2];
            
            const xBase1 = getX(baseData[scale1], offset1);
            const xBase2 = getX(baseData[scale2], offset2);
            const xOther1 = getX(otherData[scale1], offset1);
            const xOther2 = getX(otherData[scale2], offset2);
            
            const y1 = getY(i);
            const y2 = getY(i+1);
            
            // Check diff
            const diff1 = Math.abs(baseData[scale1] - otherData[scale1]);
            const diff2 = Math.abs(baseData[scale2] - otherData[scale2]);
            
            if (diff1 > 30 || diff2 > 30) {
                // Polygon connecting the space between lines
                const poly = document.createElementNS(SVG_NS, "polygon");
                poly.setAttribute("points", `${xBase1},${y1} ${xOther1},${y1} ${xOther2},${y2} ${xBase2},${y2}`);
                
                // Opacity based on diff
                const avgDiff = (diff1 + diff2) / 2;
                const opacity = Math.min(0.4, avgDiff / 200);
                poly.setAttribute("fill", `rgba(239, 68, 68, ${opacity})`);
                poly.setAttribute("class", "diff-highlight");
                gDiffs.appendChild(poly);
            }
        }
    }

    // 3. Render Paths
    selectedArray.forEach(id => {
        const country = countries[id];
        
        // Find valid points
        const validPoints = [];
        scales.forEach((scale, i) => {
            const val = country.data[scale.id];
            if (val !== null) {
                const y = getY(i);
                const offset = (isRelative && baseData[scale.id] !== null) ? baseData[scale.id] : 0;
                const x = getX(val, offset);
                validPoints.push({ x, y, scaleIndex: i });
            }
        });

        // Draw segments
        for (let j = 0; j < validPoints.length - 1; j++) {
            const p1 = validPoints[j];
            const p2 = validPoints[j+1];
            
            const line = document.createElementNS(SVG_NS, "line");
            line.setAttribute("x1", p1.x);
            line.setAttribute("y1", p1.y);
            line.setAttribute("x2", p2.x);
            line.setAttribute("y2", p2.y);
            line.setAttribute("class", "country-path");
            line.setAttribute("stroke", country.color);
            
            if (isRelative && id === state.baseCountry) {
                line.setAttribute("stroke-width", "5");
                line.setAttribute("stroke-dasharray", "8,8");
                line.setAttribute("stroke-opacity", "0.6");
            } else if (p2.scaleIndex - p1.scaleIndex > 1) {
                line.setAttribute("stroke-dasharray", "4,4");
                line.setAttribute("stroke-opacity", "0.5");
            }
            gPaths.appendChild(line);
        }
    });

    // 4. Render Points
    selectedArray.forEach(id => {
        const country = countries[id];
        
        scales.forEach((scale, i) => {
            const val = country.data[scale.id];
            if (val === null) return;
            
            const y = getY(i);
            const offset = (isRelative && baseData[scale.id] !== null) ? baseData[scale.id] : 0;
            const x = getX(val, offset);
            
            const circle = document.createElementNS(SVG_NS, "circle");
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            circle.setAttribute("r", isRelative && id === state.baseCountry ? 6 : 5);
            circle.setAttribute("class", "country-point");
            circle.setAttribute("fill", country.color);
            
            const title = document.createElementNS(SVG_NS, "title");
            title.textContent = `${country.name}: ${country.data[scale.id]}`;
            circle.appendChild(title);

            gPoints.appendChild(circle);
        });
    });
}

// Start
init();
