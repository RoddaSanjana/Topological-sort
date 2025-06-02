// DAG with numeric node labels
const graph = {
  0: [1, 2],
  1: [3],
  2: [3],
  3: [4],
  4: [],
  5: [2]
};

// Fixed positions for layout
const positions = {
  0: { x: 100, y: 50 },
  1: { x: 200, y: 150 },
  2: { x: 100, y: 150 },
  3: { x: 150, y: 250 },
  4: { x: 200, y: 350 },
  5: { x: 300, y: 50 }
};

const nodeElements = {};
const graphDiv = document.getElementById('graph');
const svg = document.getElementById('svg-edges');

// Create nodes
Object.keys(graph).forEach(node => {
  const div = document.createElement('div');
  div.className = 'node';
  div.id = `node-${node}`;
  div.textContent = node;

  const pos = positions[node];
  div.style.left = pos.x + 'px';
  div.style.top = pos.y + 'px';

  graphDiv.appendChild(div);
  nodeElements[node] = div;
});

// Draw SVG arrows (edges)
function drawArrows() {
  svg.innerHTML = ''; // clear previous

  Object.keys(graph).forEach(from => {
    graph[from].forEach(to => {
      const fromPos = positions[from];
      const toPos = positions[to];

      const x1 = fromPos.x + 25;
      const y1 = fromPos.y + 25;
      const x2 = toPos.x + 25;
      const y2 = toPos.y + 25;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", "#999");
      line.setAttribute("stroke-width", "2");
      line.setAttribute("marker-end", "url(#arrowhead)");
      svg.appendChild(line);
    });
  });

  // Arrowhead definition
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <marker id="arrowhead" markerWidth="10" markerHeight="7"
        refX="0" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#999" />
    </marker>
  `;
  svg.appendChild(defs);
}

drawArrows();

// Sleep helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Recursive DFS for topological sort
async function dfsTopo(node, visited, stack) {
  visited[node] = true;

  for (let neighbor of graph[node]) {
    if (!visited[neighbor]) {
      await dfsTopo(neighbor, visited, stack);
    }
  }

  nodeElements[node].classList.add('visited');
  await sleep(500);
  stack.push(node);
}

// Main function
async function startTopologicalDFS() {
  const visited = {};
  const stack = [];

  // Reset UI
  document.getElementById('topo-order').textContent = '';
  Object.values(nodeElements).forEach(el => el.classList.remove('visited'));

  for (let node of Object.keys(graph)) {
    if (!visited[node]) {
      await dfsTopo(node, visited, stack);
    }
  }

  const order = stack.reverse();
  document.getElementById('topo-order').textContent = order.join(' → ');
  console.log("Topological Order:", order);
}
function visitNode(nodeId) {
  const nodeEl = document.getElementById(nodeId);
  nodeEl.classList.add('visited');
}

function highlightCurrent(nodeId) {
  const nodeEl = document.getElementById(nodeId);
  nodeEl.classList.add('current');
  setTimeout(() => nodeEl.classList.remove('current'), 500);
}

function showTopoOrder(order) {
  const el = document.getElementById("topo-order");
  el.textContent = order.join(" → ");
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), 800);
}
function playVisitSound() {
  const sound = document.getElementById('visit-sound');
  sound.currentTime = 0;
  sound.play();
}

function highlightNode(nodeId) {
  const nodeElement = document.getElementById(`node-${nodeId}`);
  if (nodeElement) {
    nodeElement.classList.add('visited');
  }
}

// Example usage inside DFS
function dfs(nodeId, visited, topoStack) {
  visited[nodeId] = true;
  playVisitSound();
  highlightNode(nodeId);

  // Assume `graph[nodeId]` is an array of neighbors
  for (const neighbor of graph[nodeId]) {
    if (!visited[neighbor]) {
      dfs(neighbor, visited, topoStack);
    }
  }

  topoStack.push(nodeId);
}
