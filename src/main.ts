import "./style.css";
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// console.log(typescriptLogo, viteLogo)

import * as NodeManager from "./core/graph_manager";
import * as Graph from "./core/graph";

//console.log(nodeLookupTable);
let a = NodeManager.createNode("Enter", 10, 10);
let t = NodeManager.createNode("Log", 13, 10);
let b = NodeManager.createNode("Enter", 10, 10);
let c = NodeManager.createNode("Log", 13, 10);
// NodeManager.deleteNode(t);
// t = Graph.saveGraph();
// Graph.loadGraph(t);

NodeManager.createConnection(a, Object.keys(Graph.Graph.nodes[a].executionOutputPin)[0], t, Object.keys(Graph.Graph.nodes[t].executionInputPin)[0]);
NodeManager.createConnection(b, Object.keys(Graph.Graph.nodes[b].executionOutputPin)[0], c, Object.keys(Graph.Graph.nodes[c].executionInputPin)[0]);
NodeManager.deleteNode(a);
