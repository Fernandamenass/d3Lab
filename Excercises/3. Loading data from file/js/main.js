/*
 *    main.js
 */

d3.csv("data/ages.csv") //Carga de datos archivo csv
  .then((data) => {
    console.log("CSV Data Loaded:");
    console.log(data);
  })
  .catch((error) => {
    console.error("Error loading CSV:", error);
  });

d3.tsv("data/ages.tsv") //carga de datos archivo tsv
  .then((data) => {
    console.log("TSV Data Loaded:");
    console.log(data);
  })
  .catch((error) => {
    console.error("Error loading TSV:", error);
  });

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
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => i * 100 + 50)
      .attr("cy", 100)
      .attr("r", (d) => d.age * 4)
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
