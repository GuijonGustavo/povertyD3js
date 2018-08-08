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
    .interpolate('cardinal')
    .x (function (d) { return x(d.num) || 1; })
    .y0(function (d) { return y(d.pct95); })  //Grueso del área mayor
    .y1(function (d) { return y(d.pct25); });
  var upperInnerArea = d3.svg.area()
    .interpolate('cardinal')
    .x (function (d) { return x(d.num) || 1; })
    .y0(function (d) { return y(d.pct75); })
    .y1(function (d) { return y(d.pct50); });
  svg.datum(data);

  svg.append('path')
    .attr('class', 'area upper outer')
    .attr('d', upperOuterArea)
    .attr('clip-path', 'url(#rect-clip)');

  svg.append('path')
    .attr('class', 'area upper inner')
    .attr('d', upperInnerArea)
    .attr('clip-path', 'url(#rect-clip)');
}

function addMarker (d, svg, chartHeight, x, y, i) {
  var radius = 8,
      xPos = x(i+1) - radius,
      yPosStart = chartHeight - radius - 3,
	  yPosEnd = y((d.pct50))-radius;
	  yPosEnd_p = y((d.pct95))-radius;

	var markerG = svg.append('g')
    .attr('class', 'marker '+d.type.toLowerCase())
    .attr('transform', 'translate(' + xPos + ', ' + yPosStart + ')')
    .attr('opacity', 0);

  markerG.transition()
    .duration(1000) 
    .attr('transform', 'translate(' + xPos + ', ' + yPosEnd + ')')
    .attr('opacity', 1);
  markerG.append('circle')
    .attr('class', 'marker-bg')
    .attr('cx', radius)
    .attr('cy', radius)
    .attr('r', radius);
  markerG.append('text')
    .attr('x', radius)
    .attr('y', radius*1.5)
    .text(d.pct75); //IE

	var markerG_p = svg.append('g')
    .attr('class', 'marker '+d.type.toLowerCase())
    .attr('transform', 'translate(' + xPos + ', ' + yPosStart + ')')
    .attr('opacity', 0);

  markerG_p.transition()
    .duration(1000) //Duración en aparecer los globitos
    .attr('transform', 'translate(' + xPos + ', ' + yPosEnd_p + ')')
    .attr('opacity', 1);
  markerG_p.append('circle')
    .attr('class', 'marker-bg')
    .attr('cx', radius)
    .attr('cy', radius)
    .attr('r', radius);
/* texto que corresponde al type
  markerG_p.append('text')
    .attr('x', radius)
    .attr('y', radius*0.9);
    .text(marker.type);
*/
  markerG_p.append('text')
    .attr('x', radius)
    .attr('y', radius*1.5)
    .text(d.pct95);  //Pobreza
}

function startTransitions (svg, chartWidth, chartHeight, rectClip, x, y, data) {
  rectClip.transition()
    .duration(1000*data.length)
    .attr('width', chartWidth);

  data.forEach(function (d, i) {
    setTimeout(function () {
      addMarker(d, svg, chartHeight, x, y, i);
    },+ 500*i);
  });
}

function makeChart (data) {
  var svgWidth  = 960,
      svgHeight = 500,
      margin = { top: 20, right: 20, bottom: 40, left: 40 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var x = d3.scale.linear().range([0, chartWidth])
            .domain([1,data.length]),
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
  startTransitions(svg, chartWidth, chartHeight, rectClip, x, y, data);
}

d3.json('data.json', function (error, rawData) {
  if (error) {
    console.error(error);
    return;
  }

  var data = rawData.map(function (d) {
    return {
      num: d.num,
      pct25: d.pct25,
      pct50: d.pct50,
      pct75: d.pct75,
      pct95: d.pct95,
      type: d.type,
      version: d.version
    };
});
    makeChart(data);
});
