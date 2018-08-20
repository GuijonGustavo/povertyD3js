function addAxesAndLegend (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
  var legendWidth  = 200,
      legendHeight = 80;
//Titulo del gráfico
  var titlulo = svg.append('g')
		.append("text")         // append text
 //   .style("fill", "black")   // fill the text with the colour black
    .attr("x", 180)           // set x position of left side of text
    .attr('class', 'titulo')
    .attr("y", 2)           // set y position of bottom of text
    .attr("dy", ".35em")           // set offset y position
//	.attr("style","bold")
    .attr("text-anchor", "middle") // set anchor y justification
    .attr("transform", "translate(100,0) scale(2) rotate(0)"  )
//    .text("Aguascalientes");

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
/*
	var titulo = svg.append('g')
    .attr('class', 'legend');
   // .attr('transform', 'translate(' + (chartWidth - legendWidth) + ', 310)');

  titlulo.append('text')
    .attr('x', 15)
    .attr('y', 50)
    .text('Aguas');
*/

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
    .attr('y', 50)
    .text('IE');
//Zona IE
  legend.append('rect')
    .attr('class', 'inner')
    .attr('width',  75)
    .attr('height', 1)
    .attr('x', 10)
    .attr('y', 49);

  legend.append('text')
    .attr('x', 115)
    .attr('y', 25)
    .text('Pobreza');
}

	var colors = ["#7D74FE","#7DFF26","#F84F1B","#28D8D5","#FB95B6","#9D9931","#F12ABF","#27EA88","#549AD5","#FEA526","#7B8D8B","#BB755F","#432E16",
"#D75CFB","#44E337","#51EBE3","#ED3D24","#4069AE","#E1CC72","#E33E88","#D8A3B3","#428B50","#66F3A3","#E28A2A","#B2594D","#609297","#E8F03F","#3D2241",
"#954EB3","#6A771C","#58AE2E","#75C5E9","#BBEB85","#A7DAB9","#6578E6","#932C5F","#865A26","#CC78B9","#2E5A52","#8C9D79","#9F6270","#6D3377","#551927","#DE8D5A",
"#E3DEA8","#C3C9DB","#3A5870","#CD3B4F","#E476E3","#DCAB94","#33386D","#4DA284","#817AA5","#8D8384","#624F49","#8E211F","#9E785B","#355C22","#D4ADDE",
"#A98229","#E88B87","#28282D","#253719","#BD89E1","#EB33D8","#6D311F","#DF45AA","#E86723","#6CE5BC","#765175","#942C42","#986CEB","#8CC488","#8395E3",
"#D96F98","#9E2F83","#CFCBB8","#4AB9B7","#E7AC2C","#E96D59","#929752","#5E54A9","#CCBA3F","#BD3CB8","#408A2C","#8AE32E","#5E5621","#ADD837","#BE3221","#8DA12E",
"#3BC58B","#6EE259","#52D170","#D2A867","#5C9CCD","#DB6472","#B9E8E0","#CDE067","#9C5615","#536C4F","#A74725","#CBD88A","#DF3066","#E9D235","#EE404C","#7DB362",
"#B1EDA3","#71D2E1","#A954DC","#91DF6E","#CB6429","#D64ADC"];




function drawPaths (svg, data, x, y) {
  var upperOuterArea = d3.svg.area()
    .interpolate('cardinal')
    .x (function (d) { return x(d.numero) || 1; })
    .y0(function (d) { return y(d.pbza); })  //Grueso del área mayor
    .y1(function (d) { return y(d.ieco); });
  var upperInnerArea = d3.svg.area()
    .interpolate('cardinal')
    .x (function (d) { return x(d.numero) || 1; })
    .y0(function (d) { return y(d.ieco); })
    .y1(function (d) { return y(d.ieco); });
  svg.datum(data);
//console.log(data.num);
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
	  yPosEnd = y((d.ieco))-radius;
	  yPosEnd_p = y((d.pbza))-radius;

	var markerG = svg.append('g')
    .attr('class', 'marker ')
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
    .text(d.ieco); //IE

	var markerG_p = svg.append('g')
    .attr('class', 'marker ')
    .attr('transform', 'translate(' + xPos + ', ' + yPosStart + ')')
    .attr('opacity', 0);

  markerG_p.transition()
    .duration(2000) //Duración en aparecer los globitos
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
    .text(d.pbza);  //Pobreza
}

function startTransitions (svg, chartWidth, chartHeight, rectClip, x, y, data) {
  rectClip.transition()
  //  .duration(100*data.length)
    .duration(2000)
    .attr('width', chartWidth);

  data.forEach(function (d, i) {
    setTimeout(function () {
      addMarker(d, svg, chartHeight, x, y, i);
    },+ 50*i);
  });
}
function makeChart (data) {
  var svgWidth  = 960,
      svgHeight = 500,
      margin = { top: 20, right: 20, bottom: 40, left: 40 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

var x = d3.scale.linear().range([0, chartWidth])
            .domain(d3.extent(data, function (d) { return d.numero; })),



      y = d3.scale.linear().range([chartHeight, 0])
            .domain([0, d3.max(data, function (d) { return d.pbza; })]);
  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
      yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

	var svg = d3.select('div#contentDiv').append('svg')
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
function distQuant(dato, legRow){
	
	function mouseoverLegend(_,p){	
		d3.selectAll("svg").remove();
		if (p ==0 ){	
		updateData("ags_1.json");}
		if (p ==1 ){	
		updateData("ags_2.json");}
	}
		
	// draw legends.
	var legRow = d3.select("#contentDiv").append("div").attr("class","legenda")
		.append("table").selectAll("tr").data(dato.dP).enter().append("tr").append("td");
	legRow.append("div").style("background",function(d,i){ return colors[i];});
//		.on("mouseover",mouseoverLegend).on("mouseout",mouseoutLegend).style("cursor","pointer");
		
	legRow.append("span").text(function(d){ return d[0];})
		.on("mouseover",mouseoverLegend).on("mouseout",mouseoutLegend).style("cursor","pointer");	
}
function drawAll(dato, id){

	var seg = d3.select("#"+id).selectAll("div").data(d3.range(dato.length)).enter()
		.append("div").attr("id",function(d,i){ return "segment"+i;}).attr("class","distquantdiv");
		
	d3.range(dato.length).forEach(function(d,i){ distQuant(dqData[i], "segment"+i );});
}
drawAll(dqData, "contentDiv");



////////////






//
function updateData(nomEstado) {
d3.json(nomEstado, function (error, rawData) {
  if (error) {
    console.error(error);
    return;
  }

var jsonArr = [];

for (var j = 0; j < (Object.keys(rawData)).length; j++) {
	    jsonArr.push({
			        "numero":j+1
			        
			    })};
/*
var myData = jsonArr.map(function (e){
return {
	numero: e.numero
};
});
*/

var merge = function() {
var destination = [],
sources = [].slice.call( arguments, 0 );
sources.forEach(function( source ) {
var prop;
for ( prop in source ) {
if ( prop in destination && Array.isArray( destination[ prop ] ) ) {
destination[ prop ] = destination[ prop ].concat( source[ prop ] );
} else if ( prop in destination && typeof destination[ prop ] === "object" ) {
destination[ prop ] = merge( destination[ prop ], source[ prop ] );
} else {
destination[ prop ] = source[ prop ];
}
}
});
return destination;
};
var final = merge(rawData,jsonArr)
//console.log(JSON.stringify(final));
//console.log(final.numero);


  var data = final.map(function (d) {
    return {
      nombre: d.nombre,
      ieco: d.ieco,
      pbza: d.pbza,
      numero: d.numero
    };
});
    makeChart(data);
})};
