import { scales, countries } from './data.js';
import { getDistinctFlagColors } from './country-colors-lib.js';

let state = {
    viewMode: 'absolute', // 'absolute' | 'relative'
    baseCountry: '',
    selectedCountries: new Set(),
    searchQuery: '',
    showLines: true
};

// Parse URL parameters
const params = new URLSearchParams(window.location.search);
if (params.has('mode') && (params.get('mode') === 'absolute' || params.get('mode') === 'relative')) {
    state.viewMode = params.get('mode');
}
if (params.has('base') && countries[params.get('base')]) {
    state.baseCountry = params.get('base');
}
if (params.has('selected')) {
    const selected = params.get('selected').split(',').filter(id => countries[id]);
    if (selected.length > 0) {
        state.selectedCountries = new Set(selected);
    } else {
        state.selectedCountries = new Set();
    }
}
if (params.has('lines')) {
    state.showLines = params.get('lines') !== 'false';
}

function getFlagEmoji(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function updateColors() {
    const selectedArray = Array.from(state.selectedCountries);
    
    // 1. Reset ALL countries to a neutral unselected color (light gray)
    Object.values(countries).forEach(c => {
        c.color = '#d1d5db'; // Unselected indicator
    });

    // 2. Dynamically assign high-contrast flag colors ONLY to active selections
    if (selectedArray.length > 0 && typeof getDistinctFlagColors === 'function') {
        const dynamicColors = getDistinctFlagColors(selectedArray);
        selectedArray.forEach(id => {
            if (dynamicColors[id]) {
                countries[id].color = dynamicColors[id];
            }
        });
    }
}

function updateUrlParams() {
    const p = new URLSearchParams();
    p.set('mode', state.viewMode);
    p.set('base', state.baseCountry);
    p.set('selected', Array.from(state.selectedCountries).join(','));
    if (!state.showLines) {
        p.set('lines', 'false');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${p.toString()}`);
}

// DOM Elements
const btnAbsolute = document.getElementById('btn-absolute');
const btnRelative = document.getElementById('btn-relative');
const baseCountrySelector = document.getElementById('base-country-selector');
const baseCountrySelect = document.getElementById('base-country');
const searchInput = document.getElementById('country-search');
const countryListEl = document.getElementById('country-list');
const btnSelectAll = document.getElementById('btn-select-all');
const btnClearAll = document.getElementById('btn-clear-all');
const toggleLinesCheckbox = document.getElementById('toggle-lines');
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
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Base Country...';
    defaultOption.disabled = true;
    baseCountrySelect.appendChild(defaultOption);

    Object.values(countries)
        .filter(c => Object.values(c.data).filter(val => val !== null).length >= 5)
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = `${getFlagEmoji(c.id)} ${c.name}`;
            baseCountrySelect.appendChild(option);
        });
    baseCountrySelect.value = state.baseCountry;

    toggleLinesCheckbox.checked = state.showLines;

    // Event Listeners
    btnAbsolute.addEventListener('click', () => setViewMode('absolute'));
    btnRelative.addEventListener('click', () => setViewMode('relative'));
    baseCountrySelect.addEventListener('change', (e) => {
        state.baseCountry = e.target.value;
        baseCountrySelect.classList.remove('highlight-pulse');
        if (!state.selectedCountries.has(state.baseCountry)) {
            state.selectedCountries.add(state.baseCountry);
        }
        updateColors(); renderCountryList();
        renderChart();
    });
    
    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase();
        updateColors(); renderCountryList();
    });

    toggleLinesCheckbox.addEventListener('change', (e) => {
        state.showLines = e.target.checked;
        renderChart();
    });

    btnSelectAll.addEventListener('click', () => {
        Object.values(countries)
            .filter(c => Object.values(c.data).filter(val => val !== null).length >= 5)
            .forEach(c => state.selectedCountries.add(c.id));
        updateColors(); renderCountryList();
        renderChart();
    });

    btnClearAll.addEventListener('click', () => {
        state.selectedCountries.clear();
        state.baseCountry = '';
        baseCountrySelect.value = '';
        baseCountrySelect.classList.remove('highlight-pulse');
        updateColors(); renderCountryList();
        renderChart();
    });

    setViewMode(state.viewMode);
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
        
        if (!state.baseCountry) {
            const selectedArray = Array.from(state.selectedCountries);
            if (selectedArray.length === 1) {
                state.baseCountry = selectedArray[0];
                baseCountrySelect.value = state.baseCountry;
                baseCountrySelect.classList.remove('highlight-pulse');
            } else if (selectedArray.length > 1) {
                baseCountrySelect.classList.add('highlight-pulse');
            }
        }
    }
    updateColors(); renderCountryList();
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
        const dataPointsCount = Object.values(country.data).filter(val => val !== null).length;
        if (dataPointsCount < 5) return;
        
        if (state.searchQuery && !country.name.toLowerCase().includes(state.searchQuery)) {
            return;
        }

        const item = document.createElement('label');
        item.className = 'country-item';
        
        const colorIndicator = document.createElement('div');
        colorIndicator.className = 'country-color-indicator';
        colorIndicator.style.backgroundColor = country.color;


        const nameSpan = document.createElement('span');
        nameSpan.textContent = `${getFlagEmoji(country.id)} ${country.name} (${dataPointsCount}/${scales.length})`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'custom-checkbox';
        checkbox.checked = state.selectedCountries.has(country.id);

        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                state.selectedCountries.add(country.id);
                if (state.viewMode === 'relative' && state.selectedCountries.size === 1) {
                    state.baseCountry = country.id;
                    baseCountrySelect.value = state.baseCountry;
                    baseCountrySelect.classList.remove('highlight-pulse');
                }
            } else {
                state.selectedCountries.delete(country.id);
                if (state.baseCountry === country.id) {
                    if (state.viewMode === 'relative' && state.selectedCountries.size === 1) {
                        const remaining = Array.from(state.selectedCountries)[0];
                        state.baseCountry = remaining;
                        baseCountrySelect.value = state.baseCountry;
                        baseCountrySelect.classList.remove('highlight-pulse');
                    } else {
                        state.baseCountry = '';
                        baseCountrySelect.value = '';
                        if (state.viewMode === 'relative' && state.selectedCountries.size > 0) {
                            baseCountrySelect.classList.add('highlight-pulse');
                        }
                    }
                }
            }
            
            // Clear search filter when a country is selected/deselected
            state.searchQuery = '';
            searchInput.value = '';
            
            updateColors(); renderCountryList();
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
    const baseData = (isRelative && state.baseCountry && countries[state.baseCountry]) ? countries[state.baseCountry].data : null;

    // 1. Render Scales
    scales.forEach((scale, i) => {
        const y = getY(i);
        const offset = (isRelative && baseData && baseData[scale.id] !== null) ? baseData[scale.id] : 0;
        
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
        labelLeft.setAttribute("y", y + 25);
        labelLeft.setAttribute("class", "scale-label left");
        gScales.appendChild(labelLeft);

        const labelRight = document.createElementNS(SVG_NS, "text");
        labelRight.textContent = scale.right;
        labelRight.setAttribute("x", xEnd);
        labelRight.setAttribute("y", y + 25);
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
            tick.setAttribute("stroke", v === 0 ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)");
            tick.setAttribute("stroke-width", v === 0 ? "2" : "1");
            tick.setAttribute("class", "scale-tick");
            gScales.appendChild(tick);
        }
    });

    // 2. Render Difference Highlights (only if exactly 2 countries in relative view)
    // Configure colors and thresholds for diff highlighting here
    const DIFF_CONFIG = [
        { diff: 0, r: 34, g: 197, b: 94, opacity: 0.05 },   // Green (aligned)
        { diff: 30, r: 234, g: 179, b: 8, opacity: 0.15 },  // Yellow (moderate diff)
        { diff: 60, r: 239, g: 68, b: 68, opacity: 0.3 }    // Red (big diff)
    ];

    function getDiffColor(diff) {
        if (diff <= DIFF_CONFIG[0].diff) {
            const s = DIFF_CONFIG[0];
            return `rgba(${s.r}, ${s.g}, ${s.b}, ${s.opacity})`;
        }
        if (diff >= DIFF_CONFIG[2].diff) {
            const s = DIFF_CONFIG[2];
            return `rgba(${s.r}, ${s.g}, ${s.b}, ${s.opacity})`;
        }
        
        const stageIdx = diff < DIFF_CONFIG[1].diff ? 0 : 1;
        const s1 = DIFF_CONFIG[stageIdx];
        const s2 = DIFF_CONFIG[stageIdx + 1];
        
        const factor = (diff - s1.diff) / (s2.diff - s1.diff);
        const r = Math.round(s1.r + factor * (s2.r - s1.r));
        const g = Math.round(s1.g + factor * (s2.g - s1.g));
        const b = Math.round(s1.b + factor * (s2.b - s1.b));
        const opacity = s1.opacity + factor * (s2.opacity - s1.opacity);
        
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    
    const selectedArray = Array.from(state.selectedCountries);
    if (selectedArray.length === 2) {
        const id1 = selectedArray[0];
        const id2 = selectedArray[1];
        const data1 = countries[id1].data;
        const data2 = countries[id2].data;
        
        scales.forEach((scale, i) => {
            const scaleId = scale.id;
            
            if (data1[scaleId] === null || data2[scaleId] === null) {
                return;
            }
            
            const diff = Math.abs(data1[scaleId] - data2[scaleId]);
            
            const y = getY(i);
            const offset = (isRelative && baseData && baseData[scaleId] !== null) ? baseData[scaleId] : 0;
            
            const xStart = getX(-100, offset) - 30; // padding left
            const xEnd = getX(100, offset) + 30;   // padding right
            
            const rect = document.createElementNS(SVG_NS, "rect");
            rect.setAttribute("x", xStart);
            rect.setAttribute("y", y - 45); // 70px height centered around the line
            rect.setAttribute("width", xEnd - xStart);
            rect.setAttribute("height", 90);
            
            rect.setAttribute("fill", getDiffColor(diff));
            rect.setAttribute("rx", 8); // rounded corners
            rect.setAttribute("class", "diff-highlight");
            
            gDiffs.appendChild(rect);
        });
    }

    // 3. Render Paths
    if (state.showLines) {
        selectedArray.forEach(id => {
            const country = countries[id];
        
        // Find valid points
        const validPoints = [];
        scales.forEach((scale, i) => {
            const val = country.data[scale.id];
            if (val !== null) {
                const y = getY(i);
                const offset = (isRelative && baseData && baseData[scale.id] !== null) ? baseData[scale.id] : 0;
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
    }

    // 4. Render Points
    selectedArray.forEach(id => {
        const country = countries[id];
        
        scales.forEach((scale, i) => {
            const val = country.data[scale.id];
            if (val === null) return;
            
            const y = getY(i);
            const offset = (isRelative && baseData[scale.id] !== null) ? baseData[scale.id] : 0;
            const x = getX(val, offset);
            
            const gPoint = document.createElementNS(SVG_NS, "g");
            gPoint.setAttribute("class", "country-point-group");

            const circle = document.createElementNS(SVG_NS, "circle");
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            const radius = isRelative && id === state.baseCountry ? 16 : 14;
            circle.setAttribute("r", radius);
            circle.setAttribute("class", "country-point");
            circle.setAttribute("fill", country.color);
            
            const title = document.createElementNS(SVG_NS, "title");
            title.textContent = `${country.name}: ${country.data[scale.id]}`;
            gPoint.appendChild(title); // attach title to group for better hover area
            
            const text = document.createElementNS(SVG_NS, "text");
            text.textContent = id;
            text.setAttribute("x", x);
            text.setAttribute("y", y);
            text.setAttribute("class", "country-point-label");

            gPoint.appendChild(circle);
            gPoint.appendChild(text);
            
            gPoints.appendChild(gPoint);
        });
    });
    
    updateUrlParams();
}

// Start
init();
