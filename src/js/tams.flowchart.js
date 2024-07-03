$.fn.flowchart = (function (data = {}) {
  const $this = $(this);

  const setNodeSize = () => {
    const nodeSize = data.nodeSize || $this.attr("data-node-size");
    if (nodeSize) {
      data.nodeSize = nodeSize;
      $this.css("--size", nodeSize);
    }
  };

  const setLineSize = () => {
    data.lineSize = data.lineSize || $this.attr("data-line-size") || 3;
  };

  const setResults = () => {
    data.hasResults = Boolean(data.results);
  };

  const initializeCanvas = () => {
    let canv = $this.find("canvas")[0] || $this[0].appendChild(document.createElement("canvas"));
    canv.width = $this[0].clientWidth;
    canv.height = $this[0].clientHeight;
    return canv.getContext("2d");
  };

  const initializeData = () => {
    setNodeSize();
    setLineSize();
    setResults();
  };

  initializeData();
  const ctx = initializeCanvas();

  class Logic {
    constructor(expr, el) {
      this.FlowChart = expr.FlowChart;
      this.Expression = expr;
      this.Element = el;
      this.Id = el.getAttribute("id") || "";
      this.PassNames = el.getAttribute("data-pass")?.split(",") || [];
      this.FailName = el.getAttribute("data-fail") || "";
      this.Dependency = el.getAttribute("data-parent") || "";

      this.setupElement();
      this.bindEvents();
    }

    setupElement() {
      if (this.Dependency && $(this.Dependency)[0].style.display === "none") {
        this.Element.style.display = "none";
      } else {
        this.Element.style.display = "table-cell";
      }
      this.Element.getXY = () => {
        const flowRect = $(this).closest(".flowchart")[0].getBoundingClientRect();
        const thisRect = this.getBoundingClientRect();
        return {
          x: (thisRect.left - flowRect.left) + (thisRect.width / 2),
          y: (thisRect.top - flowRect.top) + (thisRect.height / 2)
        };
      };
    }

    bindEvents() {
      $(this.Element).off("input").on("input", () => {
        $this.flowchart();
      });
    }

    draw(ctx) {
      if (this.Element.style.display === "none") return;
      const point = this.Element.getXY();
      ctx.lineWidth = data.lineSize;

      const linesTo = (source, target) => {
        ctx.moveTo(source.x, source.y);
        const midHeight = source.y + ((target.y - source.y) / 2);
        ctx.lineTo(source.x, midHeight);
        ctx.lineTo(target.x, midHeight);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      };

      const drawByName = (name, color = "#262626") => {
        const log = findLogic(name);
        if (log && log.Element.style.display !== "none") {
          const pPoint = log.Element.getXY();
          ctx.beginPath();
          ctx.strokeStyle = color;
          linesTo(point, pPoint);
        } else if (name) {
          console.log(`Can't find '${name}'`);
        }
      };

      if (data.hasResults ? data.results[`#${this.Id}`] : true) {
        this.PassNames.forEach(name => drawByName(name, "#089342"));
      }
      if (data.hasResults ? !data.results[`#${this.Id}`] : true) {
        drawByName(this.FailName, "#a90329");
      }
    }
  }

  class Expression {
    constructor(el) {
      this.FlowChart = $this;
      this.Element = el;
      this.Items = Array.from($(el).find(".logic")).map(logicEl => new Logic(this, logicEl));
    }

    has(id) {
      return this.get(id) !== null;
    }

    get(id) {
      return this.Items.find(item => `#${item.Id.toLowerCase()}` === id.toLowerCase()) || null;
    }

    draw(ctx) {
      this.Items.forEach(item => item.draw(ctx));
    }
  }

  const expressions = Array.from($this.find(".expression")).map(expEl => new Expression(expEl));
  expressions.forEach(exp => exp.draw(ctx));
  $this.data = data;

  return $this;
});
