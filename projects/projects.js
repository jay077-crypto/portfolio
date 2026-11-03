import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
let query = '';
let selectedIndex = -1;

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

function renderPieChart(projectsGiven) {
    let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
);


let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});

let sliceGenerator = d3.pie().value((d) => d.value);

let arcData = sliceGenerator(data);

let arcs = arcData.map((d) => arcGenerator(d));

let colors = d3.scaleOrdinal(d3.schemeTableau10);

let svg = d3.select('#projects-plot');
let legend = d3.select('.legend');

svg.selectAll('path').remove();
legend.selectAll('li').remove();

arcs.forEach((arc, i) => {
  svg
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(i))
    .on('click', () => {
      selectedIndex = selectedIndex === i ? -1 : i;

      svg
        .selectAll('path')
        .classed('selected', (_, idx) => idx === selectedIndex);

      legend
        .selectAll('li')
        .classed('selected', (_, idx) => idx === selectedIndex);

      if (selectedIndex === -1) {
            renderProjects(projectsGiven, projectsContainer, 'h2');
      } else {
        let selectedYear = data[selectedIndex].label;

        let filteredProjects = projectsGiven.filter(
            (project) => project.year === selectedYear,
        );

        renderProjects(filteredProjects, projectsContainer, 'h2');
      }
    });
});

data.forEach((d, idx) => {
  legend
    .append('li')
    .attr('style', `--color:${colors(idx)}`)
    .attr('class', 'legend-item')
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
});
}

renderPieChart(projects);

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) => {
  query = event.target.value;

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});