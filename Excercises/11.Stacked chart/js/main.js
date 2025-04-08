/*
 *    main.js
 */

var margin = { top: 20, right: 300, bottom: 30, left: 50 },
  width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);
var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Time parser for x-scale
var parseDate = d3.timeParse("%Y");
var formatSi = d3.format(".3s");
var formatNumber = d3.format(".1f"),
  formatBillion = (x) => {
    return formatNumber(x / 1e9);
  };

// Scales
var x = d3.scaleTime().rangeRound([0, width]);
var y = d3.scaleLinear().rangeRound([height, 0]);
var color = d3.scaleOrdinal(d3.schemeSpectral[11]);

// Axis generators
var xAxisCall = d3.axisBottom();
var yAxisCall = d3.axisLeft().tickFormat(formatBillion);

// Area generator
// TODO: create the area generator.
// The x coordinate will be the date of the data
// while y0 and y1 will be in the 0 and 1 positions of the d element

var area = d3
  .area()
  .x((d) => x(d.data.date))
  .y0((d) => y(d[0]))
  .y1((d) => y(d[1]));

// Axis groups
var xAxis = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")");
var yAxis = g.append("g").attr("class", "y axis");

// Y-Axis label
yAxis
  .append("text")
  .attr("class", "axis-title")
  .attr("fill", "#000")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("Billions of liters");

// Legend code
var legend = g
  .append("g")
  .attr("transform", "translate(" + (width + 150) + "," + (height - 210) + ")");

d3.csv("data/stacked_area2.csv")
  .then((data) => {
    // TODO: obtain the keys array, remember to remove the first column
    var keys = data.columns.slice(1);

    color.domain(
      d3.keys(data[0]).filter((key) => {
        return key !== "date";
      })
    );

    data.forEach((d) => {
      d.date = parseDate(d.date);
      keys.forEach((key) => {
        d[key] = +d[key];
      });
    });

    var maxDateVal = d3.max(data, (d) => {
      var vals = keys.map((key) => d[key]);
      return d3.sum(vals);
    });

    x.domain(
      d3.extent(data, (d) => {
        return d.date;
      })
    );
    y.domain([0, maxDateVal]);

    // Generate axes once scales have been set
    xAxis.call(xAxisCall.scale(x));
    yAxis.call(yAxisCall.scale(y));

    // Add stacked area chart
    // TODO: finish the configuration of the stack object
    // by setting the keys, order and offset
    var stack = d3
      .stack()
      .keys(keys)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    var stackedData = stack(data);

    // TODO: bind the data to the stack and create the group
    // that will contain the area path
    var areaGroup = g
      .selectAll(".area")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("class", "area");

    // TODO: call the area generator with the appropriate data
    areaGroup
      .append("path")
      .attr("class", "area")
      .attr("d", area)
      .style("fill", (d) => color(d.key));

    // Create legend
    // TODO: Create a legend showing all the names of every color
    var legendRow = legend
      .selectAll(".legend")
      .data(keys)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

    legendRow
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d) => color(d));

    legendRow
      .append("text")
      .attr("x", -10)
      .attr("y", 10)
      .attr("text-anchor", "end")
      .style("text-transform", "capitalize")
      .text((d) => d);
  })
  .catch((error) => {
    console.log(error);
  });
