d3.json("data/buildings.json")
  .then((data) => {
    console.log("Buildings Data Loaded:");
    console.log(data);

    var margin = { left: 100, right: 10, top: 10, bottom: 150 }; //Had to change the bottom margin because I cant see the x-axis label
    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(d3.schemeSet3);

    var x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width])
      .paddingInner(0.3)
      .paddingOuter(0.3);

    var y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.height)])
      .range([height, 0]);

    var svg = d3
      .select("#chart-area")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    var g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var rects = g.selectAll("rect").data(data);

    rects
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.height))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.height))
      .attr("fill", (d) => color(d.name));

    // Create bottom axis
    var xAxis = d3.axisBottom(x);
    var xAxisGroup = g
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Rotate x-axis labels
    xAxisGroup
      .selectAll("text")
      .attr("x", -5)
      .attr("y", 10)
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)");

    // Create left axis with 5 ticks and formatted labels
    var yAxis = d3
      .axisLeft(y)
      .ticks(5)
      .tickFormat((d) => d + " m");

    g.append("g").attr("class", "y-axis").call(yAxis);

    // Add x-axis label
    g.append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + 130)
      .attr("text-anchor", "middle")
      .text("The world's tallest buildings");

    // Add y-axis label
    g.append("text")
      .attr("class", "y-axis-label")
      .attr("x", -(height / 2))
      .attr("y", -60)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Height (m)");
  })
  .catch((error) => {
    console.error("Error loading JSON:", error);
  });
