const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");
const tooltip = d3.select(".tooltip");

let nodes = [];
let links = [];

fetch('note.json')
  .then(res => res.json())
  .then(noteData => {
      nodes = noteData.map(n => ({id: n.id, snippet: DOMPurify.sanitize(n.snippet)}));
      links = [];
      noteData.forEach(n => {
          n.links.forEach(target => {
              links.push({source: n.id, target: target});
          });
      });
      renderGraph();
  })
  .catch(err => console.error("Failed to load note.json:", err));

function renderGraph() {
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(150))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width/2, height/2));

    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class", "link");

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .enter().append("g")
        .on("mouseover", (event,d) => {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(d.snippet.replace(/\n/g, "<br>"))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");

            link.style("stroke", l => (l.source.id===d.id || l.target.id===d.id) ? "#f00" : "#999");
        })
        .on("mouseout", () => {
            tooltip.transition().duration(200).style("opacity", 0);
            link.style("stroke", "#999");
        });

    node.append("circle").attr("r", 20);
    node.append("text").attr("dy", -30).text(d => d.id);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
}
