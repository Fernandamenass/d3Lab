var svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", 400)
  .attr("height", 400);

var data = [25, 20, 15, 10, 5];

// Crear los rectángulos y asignar los datos
//En d3 d = datos
svg
  .selectAll("rect")
  .data(data)
  .enter() //Creacion de espacios entre rectangulos
  .append("rect")
  .attr("width", 40)
  .attr("height", (d) => d * 10) // Altura escalada
  .attr("x", (d, i) => i * 50) // Espaciado horizontal de 50px
  .attr("y", (d) => 400 - d * 10) // Alinear en la parte inferior
  .attr("fill", "#0a9396");
