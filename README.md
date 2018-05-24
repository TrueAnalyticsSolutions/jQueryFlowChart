# jQueryFlowChart
A jQuery library that links a HTML structure of Expressions and Logical nodes to form an interactive, conditional flowchart.

See <a href="https://codepen.io/tbm0115/full/KRLNRV/">CodePen.IO</a> example.

# HTML Structure
There are 3 main components to the DOM structure

 - Flowchart
 - Expression
 - Logic

### Flowchart
Defines a flowchart structure as a whole

```
<div class="flowchart" id="flowChart1">

</div>
```

### Expression
Defines a row of logic and visually serves as a new index of logical progression.

```
<div class="flowchart" id="flowChart1">
  <div class="expression">
  
  </div>
</div>
```

### Logic
Defines an individual node of logic (column).

```
<div class="flowchart" id="flowChart1">
  <div class="expression">
    <div class="logic" id="logic1">
    
    </div>
  </div>
</div>
```

#### Logic-If
A sub-type of Logic signifying an If-Then condition.

```
<div class="flowchart" id="flowChart1">
  <div class="expression">
    <div class="logic" id="logic1"></div>
    <div class="logic logic-if" id="logic2"></div>
  </div>
</div>
```

#### Logic-Blank
A sub-type of Logic signifying an empty column. Really only used to achieve desired spacings between Logic nodes.

```
<div class="flowchart" id="flowChart1">
  <div class="expression">
    <div class="logic id="logic1"></div>
    <div class="logic logic-if" id="logic2"></div>
    <div class="logic logic-blank" id="logic3"></div>
  </div>
</div>
```
