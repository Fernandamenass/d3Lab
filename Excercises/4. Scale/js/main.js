/*
 *    main.js
 */
d3.json("data/buildings.json")
  .then((data) => {
    console.log("Buildings Data Loaded:");
    console.log(data);

    var margin = { left: 100, right: 10, top: 10, bottom: 100 };

    var width = 600 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

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
      .attr("width", 600)
      .attr("height", 400);

    var g = svg
      .append("g") //En este grupo se aplica el margen
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var rects = g.selectAll("rect").data(data);

    rects
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.height))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.height))
      .attr("fill", (d) => color(d.name));

    var xAxis = d3.axisBottom(x); //Eje inferior

    g.append("g")
      .attr("transform", `translate(0, ${height})`) // Coloca el eje en la parte inferior
      .call(xAxis)
      .selectAll("text") // Etiquetas del eje X
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)") // Rotación para evitar superposición
      .style("font-size", "12px"); //Tamaño del texto
  })
  .catch((error) => {
    console.error("Error loading JSON:", error);
  });
