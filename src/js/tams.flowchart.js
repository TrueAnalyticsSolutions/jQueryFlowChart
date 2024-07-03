class Flowchart {
  constructor(selector, data = {}) {
    this.selector = selector;
    this.data = data;
    this.nodes = [];
    this.edges = [];
    this.linkStyles = [];
    this.init();
  }

  init() {
    this.setNodeSize();
    this.setLineSize();
    this.setResults();
    this.generateDiagram();
  }

  setNodeSize() {
    const nodeSize = this.data.nodeSize || $(this.selector).attr("data-node-size");
    if (nodeSize) {
      this.data.nodeSize = nodeSize;
      $(this.selector).css("--size", nodeSize);
    }
  }

  setLineSize() {
    this.data.lineSize = this.data.lineSize || $(this.selector).attr("data-line-size") || 3;
  }

  setResults() {
    this.data.hasResults = Boolean(this.data.results);
  }

  addNode(id, label, conditionFunction = null, passNodes = [], failNodes = []) {
    this.nodes.push({ id, label, conditionFunction, passNodes, failNodes });
  }

  addLinkStyle(index, color) {
    this.linkStyles.push(`linkStyle ${index} stroke:${color},stroke-width:3px;`);
  }

  generateDiagram() {
    let diagram = "graph TD\n";
    const shapes = {
      "round": { "start": "(", "end": ")" },
      "stadium": { "start": "([", "end": "])" },
      "subroutine": { "start": "[[", "end": "]]" },
      "cylindrical": { "start": "[(", "end": ")]" },
      "circle": { "start": "((", "end": "))" },
      "asymmetric": { "start": ">", "end": "]" },
      "rhombus": { "start": "{", "end": "}" },
      "hexagon": { "start": "{{", "end": "}}" },
      "parallelogram": { "start": "[/", "end": "/]" },
      "parallelogram_alt": { "start": "[\\", "end": "\\]" },
      "trapezoid": { "start": "[/", "end": "\\]" },
      "trapezoid_alt": { "start": "[\\", "end": "/]" },
      "double_circle": { "start": "(((", "end": ")))" }
    };

    this.nodes.forEach(node => {
      const shape = node.conditionFunction ? shapes.rhombus : shapes.stadium;
      diagram += `  ${node.id}${shape.start}${node.label}${shape.end}\n`;
    });

    this.edges.forEach((edge, index) => {
      const color = edge.condition === "pass" ? "#089342" : "#a90329";
      this.addLinkStyle(index, color);
      diagram += `  ${edge.from} -->|${edge.condition}| ${edge.to}:::linkStyle${index}\n`;
    });

    diagram += this.linkStyles.join("\n");

    $(this.selector).html(`<div class="mermaid">${diagram}</div>`);
    mermaid.init(undefined, $(this.selector).find(".mermaid"));
  }

  evaluateNodes() {
    this.edges = [];
    this.nodes.forEach(node => {
      if (node.conditionFunction) {
        const result = node.conditionFunction();
        if (result) {
          node.passNodes.forEach(target => {
            this.addEdge(node.id, target, "pass");
          });
        } else {
          node.failNodes.forEach(target => {
            this.addEdge(node.id, target, "fail");
          });
        }
      }
    });
  }

  addEdge(from, to, condition = "pass") {
    if (to) {
      this.edges.push({ from, to, condition });
    }
  }

  updateDiagram() {
    this.evaluateNodes();
    this.generateDiagram();
  }
}

$.fn.flowchart = function(data) {
  const flowchart = new Flowchart(this, data);
  flowchart.updateDiagram();
  return flowchart;
};
