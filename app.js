function addAxesAndLegend (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
  var legendWidth  = 200,
      legendHeight = 100;

  // clipping to make sure nothing appears behind legend
  svg.append('clipPath')
    .attr('id', 'axes-clip')
    .append('polygon')
      .attr('points', (-margin.left)                 + ',' + (-margin.top)                 + ' ' +
                      (chartWidth - legendWidth - 1) + ',' + (-margin.top)                 + ' ' +
                      (chartWidth - legendWidth - 1) + ',' + legendHeight                  + ' ' +
                      (chartWidth + margin.right)    + ',' + legendHeight                  + ' ' +
                      (chartWidth + margin.right)    + ',' + (chartHeight + margin.bottom) + ' ' +
                      (-margin.left)                 + ',' + (chartHeight + margin.bottom));

//Titulo del gráfico
  svg.append('g')
		.append("text")         // append text
    .style("fill", "black")   // fill the text with the colour black
    .attr("x", 200)           // set x position of left side of text
  //  .attr("y", 100)           // set y position of bottom of text
    .attr("dy", ".35em")           // set offset y position
	.attr("style","bold")
    .attr("text-anchor", "middle") // set anchor y justification
    .attr("transform", "translate(100,0) scale(2) rotate(0)"  )
    .text("Aguascalientes");

  var axes = svg.append('g')
    .attr('clip-path', 'url(#axes-clip)');

  axes.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + chartHeight + ')')
    .call(xAxis)
    .append('text')
      .attr('transform', 'rotate(0)')
      .attr('x', 756)
      .attr('dx', '.71em')
      .text('Número de municipios');

  axes.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(0)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('IE');

 
}

function drawPaths (svg, data, x, y) {
  var upperOuterArea = d3.svg.area()
    .interpolate('basis')
    .x (function (d) { return x(d.pobreza) || 1; })
    .y0(function (d) { return y(d.pct95); })  //Grueso del área mayor
    .y1(function (d) { return y(d.pct25); });

  var upperInnerArea = d3.svg.area()
    .interpolate('basis')
    .x (function (d) { return x(d.pobreza) || 1; })
    .y0(function (d) { return y(d.pct75); })
    .y1(function (d) { return y(d.pct50); });

  var medianLine = d3.svg.line()
    .interpolate('basis')
    .x(function (d) { return x(d.pobreza); })
    .y(function (d) { return y(d.pct50); });

  var lowerInnerArea = d3.svg.area()
    .interpolate('basis')
    .x (function (d) { return x(d.pobreza) || 1; })
    .y0(function (d) { return y(d.pct50); })
    .y1(function (d) { return y(d.pct25); });

  var lowerOuterArea = d3.svg.area()
    .interpolate('basis')
    .x (function (d) { return x(d.pobreza) || 1; })
    .y0(function (d) { return y(d.pct25); })
    .y1(function (d) { return y(d.pct05); });

  svg.datum(data);

  svg.append('path')
    .attr('class', 'area upper outer')
    .attr('d', upperOuterArea)
    .attr('clip-path', 'url(#rect-clip)');
/* Bloque esta parte para que dé el efecto de escalera
  svg.append('path')
    .attr('class', 'area lower outer')
    .attr('d', lowerOuterArea)
    .attr('clip-path', 'url(#rect-clip)');
*/
  svg.append('path')
    .attr('class', 'area upper inner')
    .attr('d', upperInnerArea)
    .attr('clip-path', 'url(#rect-clip)');

  svg.append('path')
    .attr('class', 'area lower inner')
    .attr('d', lowerInnerArea)
    .attr('clip-path', 'url(#rect-clip)');

  svg.append('path')
    .attr('class', 'median-line')
    .attr('d', medianLine)
    .attr('clip-path', 'url(#rect-clip)');
}

function addMarker (marker, svg, chartHeight, x) {
  var radius = 32,
      xPos = x(marker.date) - radius - 3,
      yPosStart = chartHeight - radius - 3,
      yPosEnd = (marker.type === 'Client' ? 80 : 160) + radius - 3;

  var markerG = svg.append('g')
    .attr('class', 'marker '+marker.type.toLowerCase())
    .attr('transform', 'translate(' + xPos + ', ' + yPosStart + ')')
    .attr('opacity', 0);

  markerG.transition()
    .duration(1000) //Duración en aparecer los globitos
    .attr('transform', 'translate(' + xPos + ', ' + yPosEnd + ')')
    .attr('opacity', 1);
  markerG.append('circle')
    .attr('class', 'marker-bg')
    .attr('cx', radius)
    .attr('cy', radius)
    .attr('r', radius);

  markerG.append('text')
    .attr('x', radius)
    .attr('y', radius*0.9)
    .text(marker.type);

  markerG.append('text')
    .attr('x', radius)
    .attr('y', radius*1.5)
    .text(marker.version);
}

function startTransitions (svg, chartWidth, chartHeight, rectClip, markers, x) {
  rectClip.transition()
    .duration(1000*markers.length)
    .attr('width', chartWidth);

  markers.forEach(function (marker, i) {
    setTimeout(function () {
      addMarker(marker, svg, chartHeight, x);
    }, 1000 + 500*i);
  });
}

function makeChart (data, markers) {
  var svgWidth  = 960,
      svgHeight = 500,
      margin = { top: 20, right: 20, bottom: 40, left: 40 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var x = d3.scale.linear().range([0, chartWidth])
            .domain(d3.extent(data, function (d) { return d.pobreza; })),
      y = d3.scale.linear().range([chartHeight, 0])
            .domain([0, d3.max(data, function (d) { return d.pct95; })]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
      yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

  var svg = d3.select('body').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // clipping to start chart hidden and slide it in later
  var rectClip = svg.append('clipPath')
    .attr('id', 'rect-clip')
    .append('rect')
      .attr('width', 0)
      .attr('height', chartHeight);

  addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
  drawPaths(svg, data, x, y);
  startTransitions(svg, chartWidth, chartHeight, rectClip, markers, x);
}

//var parseDate  = d3.time.format('%Y-%m-%d').parse;
d3.json('data.json', function (error, rawData) {
  if (error) {
    console.error(error);
    return;
  }

  var data = rawData.map(function (d) {
    return {
      pobreza:  d.pobreza,
      pct05: d.pct05,
      pct25: d.pct25,
      pct50: d.pct50,
      pct75: d.pct75,
      pct95: d.pct95
    };
  });

  d3.json('markers.json', function (error, markerData) {
    if (error) {
      console.error(error);
      return;
    }

    var markers = markerData.map(function (marker) {
      return {
        date: marker.pobreza,
        type: marker.type,
        version: marker.version
      };
    });

    makeChart(data, markers);
  });
});
