// Initialize map
let map;
let geoJsonLayer;
let currentView = 'population';
let markers = {};

// Color scales for different metrics
const colorScales = {
    population: [
        { min: 0, max: 1000000, color: '#d4edda' },
        { min: 1000000, max: 5000000, color: '#b8e6c5' },
        { min: 5000000, max: 20000000, color: '#7ed321' },
        { min: 20000000, max: 50000000, color: '#ffc107' },
        { min: 50000000, max: 100000000, color: '#ff9800' },
        { min: 100000000, max: 500000000, color: '#ff6b6b' },
        { min: 500000000, max: Infinity, color: '#c92a2a' }
    ],
    density: [
        { min: 0, max: 10, color: '#e8f5e9' },
        { min: 10, max: 50, color: '#c8e6c9' },
        { min: 50, max: 100, color: '#a5d6a7' },
        { min: 100, max: 300, color: '#81c784' },
        { min: 300, max: 600, color: '#66bb6a' },
        { min: 600, max: 1000, color: '#ff6b6b' },
        { min: 1000, max: Infinity, color: '#c92a2a' }
    ],
    growth: [
        { min: -5, max: -1, color: '#c92a2a' },
        { min: -1, max: 0, color: '#ff9800' },
        { min: 0, max: 1, color: '#ffc107' },
        { min: 1, max: 2, color: '#7ed321' },
        { min: 2, max: 3, color: '#4caf50' },
        { min: 3, max: Infinity, color: '#1b5e20' }
    ]
};

function getColor(value, metric) {
    const colors = colorScales[metric];
    for (let scale of colors) {
        if (value >= scale.min && value < scale.max) {
            return scale.color;
        }
    }
    return '#cccccc';
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return num.toString();
}

function initMap() {
    map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    createMarkers();
    updateLegend();
    updateStatistics();
}

function createMarkers() {
    // Clear existing markers
    Object.values(markers).forEach(marker => {
        if (marker && map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
    });
    markers = {};

    Object.keys(populationData).forEach(country => {
        const data = populationData[country];
        const metric = currentView === 'population' ? data.population : 
                       currentView === 'density' ? data.density : data.growth;
        const color = getColor(metric, currentView);

        const markerOptions = {
            radius: 8,
            fillColor: color,
            color: '#333',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.7
        };

        const marker = L.circleMarker([data.lat, data.lng], markerOptions);
        
        marker.on('click', function() {
            showCountryInfo(country, data);
        });

        marker.on('mouseover', function() {
            this.setStyle({
                weight: 3,
                fillOpacity: 0.9,
                radius: 12
            });
            
            let tooltipText = country + '<br>';
            if (currentView === 'population') {
                tooltipText += 'Population: ' + formatNumber(data.population);
            } else if (currentView === 'density') {
                tooltipText += 'Density: ' + data.density.toFixed(1) + '/km²';
            } else {
                tooltipText += 'Growth: ' + data.growth.toFixed(2) + '%';
            }
            
            this.bindPopup(tooltipText).openPopup();
        });

        marker.on('mouseout', function() {
            this.setStyle({
                weight: 2,
                fillOpacity: 0.7,
                radius: 8
            });
            this.closePopup();
        });

        marker.addTo(map);
        markers[country] = marker;
    });
}

function showCountryInfo(country, data) {
    const infoDiv = document.getElementById('countryInfo');
    const worldPopulation = Object.values(populationData).reduce((sum, d) => sum + d.population, 0);
    const percentOfWorld = ((data.population / worldPopulation) * 100).toFixed(2);

    infoDiv.innerHTML = `
        <div class="popup-header">${country}</div>
        <div class="popup-item">
            <strong>Population:</strong>
            <span>${formatNumber(data.population)}</span>
        </div>
        <div class="popup-item">
            <strong>Density:</strong>
            <span>${data.density.toFixed(1)}/km²</span>
        </div>
        <div class="popup-item">
            <strong>Growth Rate:</strong>
            <span>${data.growth > 0 ? '+' : ''}${data.growth.toFixed(2)}%</span>
        </div>
        <div class="popup-item">
            <strong>% of World:</strong>
            <span>${percentOfWorld}%</span>
        </div>
        <div class="popup-item">
            <strong>Coordinates:</strong>
            <span>${data.lat.toFixed(2)}°, ${data.lng.toFixed(2)}°</span>
        </div>
    `;

    // Highlight the selected marker
    map.setView([data.lat, data.lng], 4);
}

function updateLegend() {
    const legendContent = document.getElementById('legend-content');
    legendContent.innerHTML = '';

    let legendItems = [];
    if (currentView === 'population') {
        legendItems = [
            { color: '#d4edda', label: '< 1M' },
            { color: '#b8e6c5', label: '1M - 5M' },
            { color: '#7ed321', label: '5M - 20M' },
            { color: '#ffc107', label: '20M - 50M' },
            { color: '#ff9800', label: '50M - 100M' },
            { color: '#ff6b6b', label: '100M - 500M' },
            { color: '#c92a2a', label: '> 500M' }
        ];
    } else if (currentView === 'density') {
        legendItems = [
            { color: '#e8f5e9', label: '< 10/km²' },
            { color: '#c8e6c9', label: '10-50/km²' },
            { color: '#a5d6a7', label: '50-100/km²' },
            { color: '#81c784', label: '100-300/km²' },
            { color: '#66bb6a', label: '300-600/km²' },
            { color: '#ff6b6b', label: '600-1000/km²' },
            { color: '#c92a2a', label: '> 1000/km²' }
        ];
    } else {
        legendItems = [
            { color: '#c92a2a', label: '-5% to -1%' },
            { color: '#ff9800', label: '-1% to 0%' },
            { color: '#ffc107', label: '0% to 1%' },
            { color: '#7ed321', label: '1% to 2%' },
            { color: '#4caf50', label: '2% to 3%' },
            { color: '#1b5e20', label: '> 3%' }
        ];
    }

    legendItems.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${item.color};"></div>
            <span>${item.label}</span>
        `;
        legendContent.appendChild(legendItem);
    });
}

function updateStatistics() {
    const stats = Object.values(populationData);
    const worldPopulation = stats.reduce((sum, d) => sum + d.population, 0);
    const countriesCount = Object.keys(populationData).length;

    document.getElementById('worldPop').textContent = formatNumber(worldPopulation);
    document.getElementById('countriesCount').textContent = countriesCount;
}

// Event listeners
document.getElementById('viewToggle').addEventListener('change', function(e) {
    currentView = e.target.value;
    createMarkers();
    updateLegend();
});

document.getElementById('resetBtn').addEventListener('click', function() {
    map.setView([20, 0], 2);
    document.getElementById('countryInfo').innerHTML = '<p>Hover over a country to see details</p>';
});

document.getElementById('searchBox').addEventListener('keyup', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    Object.keys(populationData).forEach(country => {
        const marker = markers[country];
        if (marker) {
            if (country.toLowerCase().includes(searchTerm)) {
                marker.setStyle({ opacity: 1, fillOpacity: 0.7 });
                if (searchTerm.length > 0) {
                    marker.setStyle({ fillOpacity: 0.9, weight: 3 });
                }
            } else {
                marker.setStyle({ opacity: 0.3, fillOpacity: 0.3 });
            }
        }
    });

    // If exact match found, zoom to it
    if (searchTerm.length > 0) {
        for (let country of Object.keys(populationData)) {
            if (country.toLowerCase() === searchTerm) {
                const data = populationData[country];
                map.setView([data.lat, data.lng], 5);
                showCountryInfo(country, data);
                break;
            }
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initMap();
});
