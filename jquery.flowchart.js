$.fn.flowchart = (function (data) {
  if (typeof (data) === "undefined" || data === null) {
    data = {};
  }
  var $this = $(this);
  if (typeof (data["nodeSize"]) !== "undefined") {
    $this.css("--size", data["nodeSize"]);
  } else if ($this[0].hasAttribute("data-node-size")) {
    data["nodeSize"] = $this.attr("data-node-size");
    $this.css("--size", data["nodeSize"]);
  }
  if (typeof (data["lineSize"]) !== "undefined") {

  } else if ($this[0].hasAttribute("data-line-size")) {
    data["lineSize"] = $this.attr("data-line-size");
  } else {
    data["lineSize"] = 3;
  }
  if (typeof (data["results"]) !== "undefined" && data["results"] !== null) {
    data["hasResults"] = true;
  } else {
    data["hasResults"] = false;
  }

  var canv = $this.find("canvas");
  if (canv.length === 0) {
    canv = $this[0].appendChild(document.createElement("canvas"));
  } else {
    canv = canv[0];
  }
  canv.width = $this[0].clientWidth;
  canv.height = $this[0].clientHeight;
  var ctx = canv.getContext("2d");
  //ctx.clearRect(0, 0, canv.width, canv.height);

  var Logic = function (expr, el) {
    this.FlowChart = expr.FlowChart;
    this.Expression = expr;
    this.Element = el;
    this.Id = this.Element.hasAttribute("id") ? this.Element.getAttribute("id") : "";
    this.PassNames = this.Element.hasAttribute("data-pass") ? this.Element.getAttribute("data-pass").split(",") : "";
    this.FailName = this.Element.hasAttribute("data-fail") ? this.Element.getAttribute("data-fail") : "";
    this.Dependency = "";
    if (this.Element.hasAttribute("data-parent")) {
      this.Dependency = this.Element.getAttribute("data-parent");
      if ($(this.Dependency)[0].style.display === "none") {
        this.Element.style.display = "none";
      } else {
        this.Element.style.display = "table-cell";
      }
    }

    this.Element["getXY"] = (function () {
      var flowRect = $(this).closest(".flowchart")[0].getBoundingClientRect();
      var thisRect = this.getBoundingClientRect();
      var xy = { x: 0, y: 0 };
      xy.x = (thisRect.left - flowRect.left) + (thisRect.width / 2);
      xy.y = (thisRect.top - flowRect.top) + (thisRect.height / 2);
      return xy;
    }).bind(this.Element);
    $(this.Element).off("input");
    $(this.Element).on("input", function () {
      $this.flowchart();
    });

    this.Draw = (function (ctx) {
      if (this.Element.style.display === "none") {
        return;
      }
      var point = this.Element.getXY();
      //ctx.moveTo(point.x, point.y);
      ctx.lineWidth = data["lineSize"];
      var linesTo = function (source, target) {
        ctx.moveTo(source.x, source.y);
        var midHeight = source.y + ((target.y - source.y) / 2);
        ctx.lineTo(source.x, midHeight);
        ctx.lineTo(target.x, midHeight);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }
      var drawByName = function (name, color) {
        if (typeof (color) === "undefined" || color === null) {
          color = "#262626";
        }
        var log = findLogic(name);
        if (log != null && typeof (log.Element) != "undefined" && log.Element != null && log.Element.style.display != "none") {
          var pPoint = log.Element.getXY();
          ctx.beginPath();
          ctx.strokeStyle = color;
          linesTo(point, pPoint);
          return true;
        } else if (name !== "") {
          console.log("Can't find '" + name + "'");
        }
        return false;
      }
      if ((data["hasResults"] && data["results"]["#" + this.Id]) || !data["hasResults"]) {
        for (var len = this.PassNames.length, n = 0; n < len; n++) {
          drawByName(this.PassNames[n], "#089342")
        }
      }
      if ((data["hasResults"] && !data["results"]["#" + this.Id]) || !data["hasResults"]) {
        drawByName(this.FailName, "#a90329");
      }
    }).bind(this);

    return this;
  }
  var Expression = function (el) {
    this.FlowChart = $this;
    this.Element = el;
    this.Items = new Array();

    var logics = $(el).find(".logic");
    for (var len = logics.length, n = 0; n < len; n++) {
      this.Items.push(new Logic(this, logics[n]));
    }

    this.has = (function (id) {
      return (this.get(id) !== null);
    }).bind(this);
    this.get = (function (id) {
      if (typeof (id) === "undefined" || id === null || id === "") {
        return null;
      }
      for (var len = this.Items.length, n = 0; n < len; n++) {
        if ("#" + this.Items[n].Id.toLowerCase() === id.toLowerCase()) {
          return this.Items[n];
        }
      }
      return null;
    }).bind(this);

    this.Draw = (function (ctx) {
      for (var len = this.Items.length, n = 0; n < len; n++) {
        this.Items[n].Draw(ctx);
      }
    }).bind(this);

    return this;
  }


  var elExps = $this.find(".expression");
  var expressions = new Array();
  var findLogic = (function (id) {
    for (var len = this.length, n = 0; n < len; n++) {
      if (this[n].has(id)) {
        return this[n].get(id);
      }
    }
  }).bind(expressions);
  for (var len = elExps.length, n = 0; n < len; n++) {
    expressions.push(new Expression(elExps[n]));
  }
  console.log("Expressions: ", expressions);
  for (var len = expressions.length, n = 0; n < len; n++) {
    expressions[n].Draw(ctx);
  }
  $this["data"] = data;

  $this["showPath"] = (function (results) {

  }).bind($this);

  return $this;
});

