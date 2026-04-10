<!-- @format -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 注意

- 只关注当前工作，不要擅自删除、修改其他地方的代码

## Project Overview

This is an ArcGIS JS API 4.18 demo project that visualizes and processes geometries (Polyline/Polygon) crossing the International Date Line (IDL). The core function `processGeometryAcrossIDL` adjusts longitude coordinates when the difference between adjacent points exceeds 180 degrees.

## Architecture

- **Single HTML entry point** (`index.html`) - Loads ArcGIS JS API and all scripts via AMD
- **No build system** - Direct script loading, no bundler/transpiler
- **AMD module pattern** - All modules use `require(["dep"], function() {...})` via ArcGIS JS API loader
- **No test framework** - Manual testing via browser console

## File Structure

- `index.html` - Entry point, loads all dependencies
- `main.js` - Map initialization, basemap selection, view setup
- `addIDL.js` - Adds International Date Line GeoJSON layer to map
- `testIDL.js` - Visual comparison test for Polyline IDL crossing
- `testPolygon.js` - Visual comparison test for Polygon IDL crossing
- `process.js` - Core IDL geometry processing functions
- `styles.css` - Basic styling
- `*.geojson` - GeoJSON files for IDL visualization

## Key Functions

- `processGeometryAcrossIDL(geometry)` - Main entry point, handles both Polyline and Polygon
- `processPolylineAcrossIDL(polyline)` - Processes Polyline paths
- `processPolygonAcrossIDL(polygon)` - Processes Polygon rings
- `detectIDLCrossingForPaths(paths)` - Detects if paths cross IDL (lonDiff > 180)
- `detectIDLCrossingForRings(rings)` - Detects if rings cross IDL

## Running the Project

Serve the directory with any HTTP server (ArcGIS JS API requires HTTP):

```bash
# Python
python -m http.server 8091

# Node
npx http-server -p 8091
```

Then open `http://localhost:8091` in browser.

## Adding Custom Modules

When adding new AMD modules:

1. Add `define(["dep1", "dep2"], function(dep1, dep2) {...});`
2. Reference via `require(["myModule"], function(myModule) {...});`
3. Ensure path is configured in `main.js` or use relative paths
