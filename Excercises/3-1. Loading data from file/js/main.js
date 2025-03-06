d3.json("data/ages.json") //carga de datos archivo json
  .then((data) => {
    data.forEach((d) => {
      d.age = +d.age; //Convierte a entero
    });

    const svg = d3 //Creacion de un svg
      .select("#chart-area")
      .append("svg")
      .attr("width", 1000)
      .attr("height", 400);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", 40)
      .attr("height", (d) => d.age * 10)
      .attr("x", (d, i) => i * 50)
      .attr("y", (d) => 400 - d.age * 10)
      .attr("fill", (d) => {
        if (d.age > 10) {
          return "#0a9396";
        } else {
          return "#9b2226";
        }
      });

    console.log(data);
    console.log("Número de elementos:", data.length);
  })
  .catch((error) => {
    console.error("Error loading JSON:", error);
  });
