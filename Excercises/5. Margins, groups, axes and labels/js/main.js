/*
 *    main.js
 */
d3.json("data/buildings.json")
  .then((data) => {
    console.log("Buildings Data Loaded:");
    console.log(data);

    var color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(d3.schemeSet3);

    var x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, 400]) //Ancho
      .paddingInner(0.3)
      .paddingOuter(0.3);

    var y = d3.scaleLinear().domain([0, 828]).range([400, 0]); //Se invirtio para que primero salgan los mas altos

    var svg = d3
      .select("#chart-area")
      .append("svg")
      .attr("width", 500)
      .attr("height", 500);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.height))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.height))
      .attr("fill", (d) => color(d.name));
  })
  .catch((error) => {
    console.error("Error loading JSON:", error);
  });
