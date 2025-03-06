d3.json("data/revenues.json")
  .then((data) => {
    console.log("Revenue Data Loaded:");
    console.log(data);

    var margin = { left: 100, right: 10, top: 10, bottom: 100 };
    var width = 700 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var svg = d3
      .select("#chart-area")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background", "#222")
      .style("border", "1px solid #444");

    var g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, width])
      .padding(0.3);

    var y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.revenue)])
      .range([height, 0]);

    var rects = g.selectAll("rect").data(data);

    rects
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.month))
      .attr("y", (d) => y(d.revenue))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.revenue))
      .attr("fill", "#d4c400"); // Amarillo

    var xAxis = d3.axisBottom(x);
    var xAxisGroup = g
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    xAxisGroup
      .selectAll("text")
      .style("fill", "white")
      .style("font-size", "14px");

    var yAxis = d3
      .axisLeft(y)
      .ticks(6)
      .tickFormat((d) => "$" + d / 1000 + "K");
    g.append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .style("fill", "white")
      .style("font-size", "14px");

    g.append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + 50)
      .attr("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "18px")
      .text("Month");

    g.append("text")
      .attr("class", "y-axis-label")
      .attr("x", -(height / 2))
      .attr("y", -60)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .style("fill", "white")
      .style("font-size", "18px")
      .text("Revenue (dlls.)");
  })
  .catch((error) => {
    console.error("Error loading JSON:", error);
  });
