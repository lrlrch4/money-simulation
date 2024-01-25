var svgSide = Math.min(.45*window.innerWidth, .85*window.innerHeight)
var svgWidth = svgSide;
var svgHeight = svgSide;

const svgSimulation = d3.select('#svgSimulation')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

const svgChar = d3.select('#svgChar')
    .attr('width', svgWidth)
    .attr('height', svgHeight); 

function resizeSVG() {
    svgSide = Math.min(0.45 * window.innerWidth, 0.85 * window.innerHeight);
    svgWidth = svgSide;
    svgHeight = svgSide;
    // Actualizar el tamaño del SVG de simulación
    d3.select('#svgSimulation')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    // Actualizar el tamaño del SVG de personaje
    d3.select('#svgChar')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    drawFrame();
}
window.addEventListener('load', resizeSVG);
window.addEventListener('resize', resizeSVG);