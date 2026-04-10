# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DS4200 data visualization project analyzing top Spotify songs across 10 European countries (GB, DE, FR, ES, IT, NL, SE, PL, BE, PT). The research question: **How does geographical location in Europe influence the distribution of music genres and audio features?**

Data sourced from Kaggle's "Top Spotify Songs in 73 Countries" dataset.

## Project Structure

```
project/
├── index.html                  ← Main landing page
├── styles.css                  ← Shared CSS (navbar, layout, typography)
├── CLAUDE.md
├── DS4200 Dataframe.ipynb      ← Data cleaning notebook
├── data/
│   ├── universal_top_spotify_songs.csv        ← Raw Kaggle data (~498MB)
│   ├── top_spotify_songs_EU_cleaned.csv       ← Intermediate cleaned data
│   └── fully_cleaned_top_spotify_songs_EU.csv ← Final clean data (5000 rows)
├── heatmap/
│   ├── heatmap.html
│   └── heatmap.css
├── scatterplot/
│   ├── scatterplot.html
│   └── scatterplot.css
├── map/
│   ├── map.html
│   └── map.css
├── barchart/
│   ├── barchart.html
│   └── barchart.css
├── radar/
│   ├── radar.html
│   └── radar.css
└── images/
```

## Data Pipeline

The single Jupyter notebook `DS4200 Dataframe.ipynb` handles all data processing:

1. **Input**: `universal_top_spotify_songs.csv` (~498MB, full Kaggle dataset)
2. **Filtering**: Selects 10 EU countries, takes top 500 songs per country → 5000 rows
3. **Drops**: `spotify_id`, `daily_rank`, `daily_movement`, `weekly_movement`, `snapshot_date`, `name`, `album_release_date`, `album_name`
4. **Intermediate output**: `top_spotify_songs_EU_cleaned.csv`
5. **Further cleaning**: Converts `duration_ms` → `duration_s`, adds `artist_count`, lowercases artist names, creates `artists_list` (explodable)
6. **Final output**: `fully_cleaned_top_spotify_songs_EU.csv`

## Key Audio Features in Dataset

`danceability`, `energy`, `loudness`, `speechiness`, `acousticness`, `instrumentalness`, `liveness`, `valence`, `tempo`, `key`, `mode`, `time_signature` — all from Spotify's audio analysis API.

## 10 Target Countries

United Kingdom, Germany, France, Spain, Italy, Netherlands, Sweden, Poland, Belgium, Portugal.

## Website Architecture

- **Static site** — HTML, CSS, JS only. No build tools or bundlers.
- **Shared navbar** — Defined in each HTML file (no templating). Keep nav links consistent across all pages.
- **Shared styles** — `styles.css` at root holds navbar, layout, typography, and CSS variables. Each viz page imports it via `@import url('../styles.css')` in its own CSS file.
- **CSS variables** — All theme colors and fonts are defined as variables in `:root` in `styles.css`. Use these for consistency.
- **Fonts** — DM Serif Display (headings) + Work Sans (body), loaded from Google Fonts.
- **Color palette** — Deep blue/teal theme: primary `#1b4965`, accent `#e07a5f`, bg `#faf9f6`.

## Visualizations (5 required)

Each visualization lives in its own subfolder with its own `.html` and `.css` file.

| # | Name | Type | Library | Interaction |
|---|------|------|---------|-------------|
| 1 | Feature Heatmap | Heatmap | Altair (Vega-Lite) | Static — hover tooltips |
| 2 | Energy vs. Valence | Scatterplot | Altair (Vega-Lite) | Filter by country, hover for details |
| 3 | Interactive Map | Choropleth | D3.js | Click country, dropdown to change feature |
| 4 | Country Comparison | Bar chart | Altair (Vega-Lite) | Dropdown to switch audio attribute |
| 5 | Country Profiles | Radar chart | D3.js | Select countries to compare |

### Altair → HTML Workflow

1. Build chart in Jupyter notebook with Altair
2. Export with `chart.save('output.html')` or grab spec via `chart.to_dict()`
3. Copy the Vega-Lite JSON spec into the hand-built HTML page
4. The HTML page loads Vega, Vega-Lite, and Vega-Embed from CDN to render the spec

### D3 Visualizations

Built directly in HTML/JS. The map needs a GeoJSON file for European country boundaries. The radar chart is pure D3 SVG.

### Interaction Requirements (minimum 3 types across all 5 viz)

- Dropdown/select to change displayed attribute
- Hover tooltips showing data details
- Click/filter to isolate specific countries

## Grading Requirements

- At least 5 visualizations, at least 3 different chart types
- At least 1 Altair, at least 1 D3
- At least 3 different interaction types
- Each viz needs clear titles, labels, legends
- Each viz needs an explanatory paragraph on the webpage (takeaway)
- Separate Word doc explaining design decisions for each viz
- Summary/conclusions section with 2-3 findings tied to the research question
- Published on GitHub Pages

## Running the Notebook

Requires Python with `pandas`. Run cells sequentially — the notebook reads/writes CSVs between stages.

## Team

- **Joyce** — Project management, scheduling, quality assurance
- **Oliver** — Data cleaning, visualization development
- **Lua** — Writing, analysis, design philosophy