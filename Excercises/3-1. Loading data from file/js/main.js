/*
 *    main.js
 */

d3.csv("data/ages.csv")
  .then((data) => {
    console.log("CSV Data Loaded:");
    console.log(data);
  })
  .catch((error) => {
    console.error("Error loading CSV:", error);
  });

d3.tsv("data/ages.tsv")
  .then((data) => {
    console.log("TSV Data Loaded:");
    console.log(data);
  })
  .catch((error) => {
    console.error("Error loading TSV:", error);
  });

d3.json("data/ages.json")
  .then((data) => {
    data.forEach((d) => {
      d.age = +d.age;
    });

    const svg = d3
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
