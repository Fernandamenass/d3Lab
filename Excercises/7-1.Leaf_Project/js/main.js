const margin = { top: 50, right: 20, bottom: 80, left: 80 };
const width = 900 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3
  .select("#chart-area svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "chart-svg");

const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLog().domain([142, 150000]).range([0, width]);

const y = d3.scaleLinear().domain([0, 90]).range([height, 0]);

const area = d3
  .scaleLinear()
  .domain([2000, 1400000000])
  .range([25 * Math.PI, 1500 * Math.PI]);

const color = d3.scaleOrdinal(d3.schemeCategory10);

const xAxis = d3
  .axisBottom(x)
  .tickValues([400, 4000, 40000])
  .tickFormat(d3.format("$.0f"))
  .tickSize(-height);

const yAxis = d3.axisLeft(y).tickSize(-width);

g.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(xAxis)
  .style("font", "12px sans-serif");

g.append("g").call(yAxis).style("font", "12px sans-serif");

g.selectAll(".domain").style("stroke", "#ddd");

g.selectAll(".tick line").style("stroke", "#ddd");

g.append("text")
  .attr("x", width / 2)
  .attr("y", height + 50)
  .attr("text-anchor", "middle")
  .style("fill", "#666")
  .text("Income per person (GDP per capita)");

g.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", -50)
  .attr("text-anchor", "middle")
  .style("fill", "#666")
  .text("Life Expectancy (Years)");

const yearLabel = g
  .append("text")
  .attr("x", width - 50)
  .attr("y", height - 20)
  .attr("font-size", "40px")
  .attr("opacity", "0.4")
  .attr("text-anchor", "middle");

const legend = g.append("g").attr("transform", `translate(${width - 160}, 20)`);

legend
  .selectAll("g")
  .data(color.domain())
  .enter()
  .append("g")
  .attr("transform", (d, i) => `translate(0, ${i * 20})`);

legend
  .selectAll("g")
  .append("rect")
  .attr("width", 14)
  .attr("height", 14)
  .attr("fill", color);

legend
  .selectAll("g")
  .append("text")
  .attr("x", 18)
  .attr("y", 9)
  .attr("dy", "0.32em")
  .style("font", "10px sans-serif")
  .text((d) => d);

let formattedData;
let yearIndex = 0;
let interval;

d3.json("data/data.json").then((data) => {
  formattedData = data.map((year) => ({
    year: year.year,
    countries: year.countries
      .filter((c) => c.income && c.life_exp && c.population)
      .map((c) => ({
        country: c.country,
        income: +c.income,
        life_exp: +c.life_exp,
        population: +c.population,
        continent: c.continent,
      })),
  }));

  color.domain([
    ...new Set(formattedData[0].countries.map((d) => d.continent)),
  ]);

  startAnimation();
});

function update(data) {
  const t = d3.transition().duration(500).ease(d3.easeLinear);

  const circles = g.selectAll("circle").data(data, (d) => d.country);

  circles.exit().transition(t).attr("r", 0).remove();

  circles
    .enter()
    .append("circle")
    .attr("fill", (d) => color(d.continent))
    .attr("cx", (d) => x(d.income))
    .attr("cy", (d) => y(d.life_exp))
    .attr("r", 0)
    .transition(t)
    .attr("r", (d) => Math.sqrt(area(d.population) / Math.PI));

  circles
    .transition(t)
    .attr("cx", (d) => x(d.income))
    .attr("cy", (d) => y(d.life_exp))
    .attr("r", (d) => Math.sqrt(area(d.population) / Math.PI));

  yearLabel.text(formattedData[yearIndex].year);
}

function startAnimation() {
  interval = d3.interval(() => {
    yearIndex = (yearIndex + 1) % formattedData.length;
    update(formattedData[yearIndex].countries);
  }, 1000);
}
