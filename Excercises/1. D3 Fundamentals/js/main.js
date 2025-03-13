var svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", 400)
  .attr("height", 400);

var circle = svg
  .append("circle") //It adds a circle
  .attr("cx", 100) //Horizontal position
  .attr("cy", 250) //Vertical position
  .attr("r", 70) //Radious
  .attr("fill", "#0a9396");

var rect = svg
  .append("rect")
  .attr("x", 20)
  .attr("y", 20)
  .attr("width", 20)
  .attr("height", 20) // This is a square...
  .attr("fill", "#9b2226");
