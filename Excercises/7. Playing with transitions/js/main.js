var margin = { left: 100, right: 10, top: 10, bottom: 100 };
var width = 700 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var flag = true;
var originalData;

var svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .style("background", "#222");

var g = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Static Axis
var xAxisGroup = g
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0,${height})`);

var yAxisGroup = g.append("g").attr("class", "y-axis");

// Static Labels
g.append("text")
  .attr("class", "x-axis-label")
  .attr("x", width / 2)
  .attr("y", height + 50)
  .attr("text-anchor", "middle")
  .style("fill", "white")
  .style("font-size", "18px")
  .text("Month");

var yLabel = g
  .append("text")
  .attr("class", "y-axis-label")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -60)
  .attr("text-anchor", "middle")
  .style("fill", "white")
  .style("font-size", "18px");

// Scale (Static)
var x = d3.scaleBand().range([0, width]).padding(0.3);

var y = d3.scaleLinear().range([height, 0]);

d3.json("data/revenues.json")
  .then((data) => {
    originalData = data;
    data.forEach((d) => {
      d.revenue = +d.revenue;
      d.profit = +d.profit;
    });

    update(data);
    d3.interval(() => {
      var newData = flag ? data : data.slice(1);
      update(newData);
      flag = !flag;
    }, 1000); //This function changes the flag to call update and between revenue and profit
  })
  .catch((error) => console.log(error));

function update(data) {
  var value = flag ? "revenue" : "profit";

  // update scales
  x.domain(originalData.map((d) => d.month)); //Use of the original data to keep the months
  y.domain([0, d3.max(data, (d) => d[value])]);

  // update axis
  var xAxis = d3.axisBottom(x);
  var yAxis = d3
    .axisLeft(y)
    .ticks(6)
    .tickFormat((d) => `$${d / 1000}K`);

  xAxisGroup
    .transition()
    .duration(800)
    .call(xAxis)
    .selectAll("text")
    .style("fill", "white");
  yAxisGroup
    .transition()
    .duration(800)
    .call(yAxis)
    .selectAll("text")
    .style("fill", "white");

  // update label Y
  yLabel.text(`${flag ? "Revenue" : "Profit"} (dlls.)`);

  // merge information
  var bars = g.selectAll("rect").data(data, (d) => d.month); // This is the key function

  // Removes the bars that are not necessary
  bars.exit().remove();

  // Update
  bars
    .transition()
    .duration(800)
    .attr("x", (d) => x(d.month))
    .attr("y", (d) => y(d[value]))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d[value]));

  // New bars are added with the transition effect
  bars
    .enter()
    .append("rect")
    .attr("fill", "#d4c400")
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth())
    .attr("y", height)
    .attr("height", 0)
    .transition()
    .duration(800)
    .attr("y", (d) => y(d[value]))
    .attr("height", (d) => height - y(d[value]));
}
