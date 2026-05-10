# Interactive World Population Census Map

A dynamic, interactive web-based map displaying world population statistics with census data for over 50 countries.

## Features

### 🌍 Interactive Map
- **Real-time visualization** of countries with population census data
- **Zoom and pan** to explore different regions
- **Click on countries** to view detailed information
- **Hover tooltips** showing quick population insights

### 📊 Multiple View Modes
1. **Total Population** - Color-coded by total country population
   - Light green for small populations (< 1M)
   - Yellow for medium populations (20M - 50M)
   - Red for large populations (> 500M)

2. **Population Density** - Color-coded by people per km²
   - Green shades for sparse areas
   - Red shades for densely populated regions

3. **Growth Rate** - Color-coded by annual population growth percentage
   - Red for negative growth
   - Green for high growth rates

### 🔍 Search Functionality
- Type country names to filter and highlight
- Auto-zoom to exact country matches
- Instant highlighting of search results

### 📈 Statistics Panel
- Real-time world population total
- Country count
- Detailed country information including:
  - Total population
  - Population density
  - Growth rate
  - Percentage of world population
  - Geographic coordinates

### 🎨 Visual Legend
- Color-coded legend for each view mode
- Easy interpretation of population ranges
- Updates automatically with view changes

## How to Use

1. **Open the Map**
   - Double-click `index.html` to open in your default browser
   - Or use a local web server for best performance

2. **Explore Data**
   - Hover over colored circles to see quick info
   - Click on a country to see detailed statistics
   - Scroll to zoom in/out
   - Drag to pan around the map

3. **Change View**
   - Use the dropdown menu to switch between:
     - Total Population
     - Population Density
     - Growth Rate

4. **Search for Countries**
   - Type in the search box to filter countries
   - Exact matches will auto-zoom to that location

5. **Reset Map**
   - Click "Reset Map" button to return to global view

## File Structure

```
map/
├── index.html      # Main HTML file
├── app.js          # JavaScript application logic
├── data.js         # Population census data
├── styles.css      # Styling and layouts
└── README.md       # This file
```

## Data Source

The map includes population data for 50+ countries with:
- **Population figures** (based on latest census data)
- **Population density** (per km²)
- **Growth rates** (annual percentage)
- **Geographic coordinates** (latitude/longitude)

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

Requires modern browser with JavaScript support.

## Technologies Used

- **Leaflet.js** - Interactive mapping library
- **OpenStreetMap** - Map tile provider
- **Vanilla JavaScript** - Application logic
- **CSS3** - Modern styling

## Customization

### Add More Countries

1. Open `data.js`
2. Add new entries to the `populationData` object:
```javascript
"Country Name": { 
    population: 1000000, 
    density: 100, 
    growth: 1.5, 
    lat: 0.0, 
    lng: 0.0 
}
```

### Change Colors

Edit the `colorScales` object in `app.js` to modify color gradients for different metrics.

### Modify Initial View

In `app.js`, change the map center and zoom:
```javascript
map.setView([20, 0], 2);  // [latitude, longitude, zoom]
```

## Performance Tips

- For large datasets (100+ countries), consider clustering with Leaflet.markercluster
- Use GeoJSON format for more complex geographical boundaries
- Cache data locally for offline usage

## Known Limitations

- Current implementation shows circle markers at country centroids
- Actual country boundaries not displayed (uses point markers instead)
- Real-time data updates would require API integration

## Future Enhancements

- [ ] Country boundary visualization (GeoJSON polygons)
- [ ] Historical data comparison
- [ ] Real-time data updates from APIs
- [ ] Marker clustering for zoomed out view
- [ ] Export data functionality
- [ ] Additional metrics (GDP, urbanization rate, etc.)
- [ ] Mobile app version

## License

This project is free to use and modify for personal or educational purposes.

## Support

For issues or suggestions, refer to the code documentation or create detailed issue reports.

---

**Last Updated**: May 2026
**Version**: 1.0
