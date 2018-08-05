function addAxesAndLegend (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
  var legendWidth  = 200,
      legendHeight = 80;
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

//Caja descriptiva
 var legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + (chartWidth - legendWidth) + ', 310)');

  legend.append('rect')
    .attr('class', 'legend-bg')
    .attr('width',  legendWidth)
    .attr('height', legendHeight);
//Zona pobreza
  legend.append('rect')
    .attr('class', 'outer')
    .attr('width',  75)
    .attr('height', 1)
    .attr('x', 10)
    .attr('y', 19);

  legend.append('text')
    .attr('x', 115)
    .attr('y', 25)
    .text('Pobreza');
//Zona IE
  legend.append('rect')
    .attr('class', 'inner')
    .attr('width',  75)
    .attr('height', 1)
    .attr('x', 10)
    .attr('y', 49);

  legend.append('text')
    .attr('x', 115)
    .attr('y', 55)
    .text('IE');
/*
  legend.append('path')
    .attr('class', 'median-line')
    .attr('d', 'M10,80L85,80');

  legend.append('text')
    .attr('x', 115)
    .attr('y', 85)
    .text('Median');*/
}

function drawPaths (svg, data, x, y) {
  var upperOuterArea = d3.svg.area()
    .interpolate('basis')
    .x (function (d) { return x(d.numMunicipios) || 1; })
    .y0(function (d) { return y(d.pct95); })  //Grueso del área mayor
    .y1(function (d) { return y(d.pct25); });
  var upperInnerArea = d3.svg.area()
    .interpolate('basis')
    .x (function (d) { return x(d.numMunicipios) || 1; })
    .y0(function (d) { return y(d.pct75); })
    .y1(function (d) { return y(d.pct50); });
  var medianLine = d3.svg.line()
    .interpolate('basis')
    .x(function (d) { return x(d.numMunicipios); })
    .y(function (d) { return y(d.pct50); });


  var lowerInnerArea = d3.svg.area()
    .interpolate('basis')
    .x (function (d) { return x(d.numMunicipios) || 1; })
    .y0(function (d) { return y(d.pct50); })
    .y1(function (d) { return y(d.pct25); });
  var lowerOuterArea = d3.svg.area()
    .interpolate('basis')
    .x (function (d) { return x(d.numMunicipios) || 1; })
    .y0(function (d) { return y(d.pct25); })
    .y1(function (d) { return y(d.pct05); });

  svg.datum(data);

  svg.append('path')
    .attr('class', 'area upper outer')
    .attr('d', upperOuterArea)
    .attr('clip-path', 'url(#rect-clip)');

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
// Funcion de globitos
function addMarker (marker, svg, chartHeight, x, data) {
  var radius = 12,
      xPos = x(marker.numero) - radius - 3,
      yPosStart = chartHeight - radius - 3,
//      yPosEnd = (marker.type === 'ie' ? 80: 160) + radius - 3;
yPosEnd = (d3.min(data, function (d) { return d.pct50; }))*100;
console.log(yPosEnd);
//	alert(chartHeight);
  var markerG = svg.append('g')
    .attr('class', 'marker '+marker.type.toLowerCase())
    .attr('transform', 'translate(' + xPos + ', ' + yPosStart + ')')
    .attr('opacity', 0);

//console.log(d.pct50);
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
    .attr('y', radius*0.9);
  //  .text(marker.type);

  markerG.append('text')
    .attr('x', radius)
    .attr('y', radius*1.5)
    .text(marker.version);
}
function startTransitions (svg, chartWidth, chartHeight, rectClip, markers, x, data) {
  rectClip.transition()
    .duration(1000*markers.length)
    .attr('width', chartWidth);

//console.log(data.pct50);
  markers.forEach(function (marker, i) {
    setTimeout(function () {
      addMarker(marker, svg, chartHeight, x, data);
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
            .domain(d3.extent(data, function (d) { return d.numMunicipios; })),
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
  startTransitions(svg, chartWidth, chartHeight, rectClip, markers, x, data);
//	console.log(d3.max(markers, function (marker) { return marker.type; }));
//	console.log(d3.max(data, function (d) { return d.pct95; }));
}

d3.json('data.json', function (error, rawData) {
  if (error) {
    console.error(error);
    return;
  }

  var data = rawData.map(function (d) {
    return {
      numMunicipios: d.numMunicipios,
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
        numero: marker.numero,
        type: marker.type,
        version: marker.version
      };
    });
    makeChart(data, markers);
  });
});

