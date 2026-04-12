let width = 500;
let height = 500;

let svg = d3.select('#chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

let tooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

let countryData = [
  { country: 'BE', country_name: 'Belgium', danceability: 0.7027, energy: 0.6531, loudness: -6.7167, speechiness: 0.1122, acousticness: 0.2301, instrumentalness: 0.0118, liveness: 0.1449, valence: 0.5474, tempo: 126.8058, popularity: 82.828 },
  { country: 'DE', country_name: 'Germany', danceability: 0.689, energy: 0.7253, loudness: -6.3342, speechiness: 0.1323, acousticness: 0.1379, instrumentalness: 0.0204, liveness: 0.1892, valence: 0.5297, tempo: 131.5782, popularity: 79.472 },
  { country: 'ES', country_name: 'Spain', danceability: 0.6732, energy: 0.6408, loudness: -8.554, speechiness: 0.1009, acousticness: 0.3393, instrumentalness: 0.0792, liveness: 0.1542, valence: 0.5158, tempo: 114.1698, popularity: 81.556 },
  { country: 'FR', country_name: 'France', danceability: 0.7565, energy: 0.6428, loudness: -7.1527, speechiness: 0.1583, acousticness: 0.2541, instrumentalness: 0.0055, liveness: 0.1218, valence: 0.5905, tempo: 123.7182, popularity: 77.05 },
  { country: 'GB', country_name: 'United Kingdom', danceability: 0.6561, energy: 0.6655, loudness: -5.963, speechiness: 0.0796, acousticness: 0.2022, instrumentalness: 0.0039, liveness: 0.1723, valence: 0.5342, tempo: 121.4431, popularity: 74.384 },
  { country: 'IT', country_name: 'Italy', danceability: 0.6372, energy: 0.6617, loudness: -6.6013, speechiness: 0.0969, acousticness: 0.2382, instrumentalness: 0.0243, liveness: 0.1757, valence: 0.4981, tempo: 127.229, popularity: 73.084 },
  { country: 'NL', country_name: 'Netherlands', danceability: 0.6879, energy: 0.706, loudness: -6.0131, speechiness: 0.0729, acousticness: 0.1819, instrumentalness: 0.0044, liveness: 0.1557, valence: 0.6076, tempo: 125.9782, popularity: 76.93 },
  { country: 'PL', country_name: 'Poland', danceability: 0.665, energy: 0.6739, loudness: -7.4526, speechiness: 0.1231, acousticness: 0.2207, instrumentalness: 0.0104, liveness: 0.1761, valence: 0.4954, tempo: 126.5739, popularity: 72.206 },
  { country: 'PT', country_name: 'Portugal', danceability: 0.6864, energy: 0.6278, loudness: -7.4168, speechiness: 0.1445, acousticness: 0.2905, instrumentalness: 0.0491, liveness: 0.164, valence: 0.521, tempo: 122.3865, popularity: 78.774 },
  { country: 'SE', country_name: 'Sweden', danceability: 0.6109, energy: 0.6463, loudness: -7.4955, speechiness: 0.0877, acousticness: 0.2961, instrumentalness: 0.0162, liveness: 0.1781, valence: 0.5602, tempo: 124.6812, popularity: 72.192 }
];

let idToCode = {
  '826': 'GB', '276': 'DE', '250': 'FR', '724': 'ES', '380': 'IT',
  '528': 'NL', '752': 'SE', '616': 'PL', '056': 'BE', '620': 'PT'
};

let dataByCode = {};
countryData.forEach(function(d) {
  dataByCode[d.country] = d;
});

d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
  .then(function(world) {

  let countries = topojson.feature(world, world.objects.countries);

  let projection = d3.geoMercator()
    .center([10, 52])
    .scale(600)
    .translate([width / 2, height / 2]);

  let path = d3.geoPath().projection(projection);

  let europeFeatures = countries.features.filter(function(d) {
    let centroid = d3.geoCentroid(d);
    return centroid[0] > -15 && centroid[0] < 40 && centroid[1] > 35 && centroid[1] < 72;
  });

  function drawMap() {
    let feature = document.getElementById('feature-select').value;

    let values = countryData.map(function(d) { return d[feature]; });
    let colorScale = d3.scaleLinear()
      .domain([d3.min(values), d3.max(values)])
      .range(['#c6dbef', '#08519c']);

    svg.selectAll('path').remove();
    svg.selectAll('.legend').remove();

    svg.selectAll('path')
      .data(europeFeatures)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('stroke', 'white')
      .attr('stroke-width', 0.5)
      .attr('fill', function(d) {
        let code = idToCode[d.id];
        if (code && dataByCode[code]) {
          return colorScale(dataByCode[code][feature]);
        }
        return '#e0e0e0';
      })
      .on('mouseover', function(event, d) {
        let code = idToCode[d.id];
        if (code && dataByCode[code]) {
          d3.select(this)
            .attr('stroke', '#1b4965')
            .attr('stroke-width', 2);
          tooltip.transition()
            .duration(200)
            .style('opacity', 0.9);
          tooltip.html(
            dataByCode[code].country_name + '<br/>' +
            feature + ': ' + dataByCode[code][feature].toFixed(3)
          )
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
        }
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke', 'white')
          .attr('stroke-width', 0.5);
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
      });




    let legendWidth = 200;
    let legendHeight = 12;
    let numSteps = 8;
    let stepWidth = legendWidth / numSteps;

    let legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(' + (width - legendWidth - 20) + ',' + (height - 40) + ')');

    legend.append('text')
      .attr('x', 0)
      .attr('y', -5)
      .text(feature)
      .style('font-size', '12px')
      .style('font-weight', 'bold');

    for (let i = 0; i < numSteps; i++) {
      let val = d3.min(values) + (i / numSteps) * (d3.max(values) - d3.min(values));
      legend.append('rect')
        .attr('x', i * stepWidth)
        .attr('y', 0)
        .attr('width', stepWidth)
        .attr('height', legendHeight)
        .attr('fill', colorScale(val));
    }

    legend.append('text')
      .attr('x', 0)
      .attr('y', legendHeight + 14)
      .text(d3.min(values).toFixed(2))
      .style('font-size', '10px');

    legend.append('text')
      .attr('x', legendWidth)
      .attr('y', legendHeight + 14)
      .text(d3.max(values).toFixed(2))
      .style('font-size', '10px')
      .style('text-anchor', 'end');
  }

  drawMap();

  document.getElementById('feature-select').addEventListener('change', drawMap);
});
