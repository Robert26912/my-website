const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");
const tooltip = d3.select(".tooltip");

let nodes = [];
let links = [];

document.getElementById('fileInput').addEventListener('change', handleFiles, false);

function handleFiles(event) {
    const files = event.target.files;
    const fileReadPromises = [];

    for (let file of files) {
        fileReadPromises.push(readFile(file));
    }

    Promise.all(fileReadPromises).then(results => {
        buildGraph(results);
    });
}

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;

            // Separate YAML frontmatter
            const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
            let yamlData = {}, markdown = content;
            if(match){
                try {
                    yamlData = jsyaml.load(match[1], { schema: jsyaml.JSON_SCHEMA });
                } catch(e){
                    console.error("YAML parse error in", file.name);
                }
                markdown = match[2];
            }

            // Convert Markdown to safe HTML
            const safeHtml = DOMPurify.sanitize(marked.parse(markdown));

            // Extract links to other notes
            const linkMatches = [...markdown.matchAll(/\[\[([^\]]+)\]\]/g)].map(m => m[1]);

            resolve({
                id: file.name.replace('.md',''),
                snippet: safeHtml,
                links: linkMatches
            });
        };
        reader.readAsText(file);
    });
}

function buildGraph(noteData) {
    nodes = noteData.map(n => ({id: n.id, snippet: n.snippet}));
    links = [];
    noteData.forEach(n => {
        n.links.forEach(target => {
            links.push({source: n.id, target: target});
        });
    });

    renderGraph();
}

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
            tooltip.html(d.snippet)
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
