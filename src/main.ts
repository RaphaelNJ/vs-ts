import "./styles/GraphUtils.css";
import "./styles/style.css";
import "./styles/pins.css";
import "./styles/connections.css"
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// console.log(typescriptLogo, viteLogo)

import * as NodeManager from "./core/graph_manager";
import * as Graph from "./core/graph";
import * as View from "./view/generate_environement";
import * as EventsListeners from "./view/event_listeners";
// //console.log(nodeLookupTable);
// let t = NodeManager.createNode("Log", 13, 10);
// let b = NodeManager.createNode("Enter", 10, 10);
// let c = NodeManager.createNode("Log", 13, 10);
// // NodeManager.deleteNode(t);
// // t = Graph.saveGraph();
// // Graph.loadGraph(t);

// NodeManager.createConnection(a, Object.keys(Graph.Graph.nodes[a].executionOutputPin)[0], t, Object.keys(Graph.Graph.nodes[t].executionInputPin)[0]);
// NodeManager.createConnection(b, Object.keys(Graph.Graph.nodes[b].executionOutputPin)[0], c, Object.keys(Graph.Graph.nodes[c].executionInputPin)[0]);
// NodeManager.deleteNode(a);


let VSCanvasContainer = View.initHtml();
Graph.saveGraph();
document.getElementById("save")!.addEventListener('click', (e) => {
    console.log(Graph.saveGraph());
})
document.getElementById("load")!.addEventListener('click', (e) => {
    Graph.loadGraph(document.getElementById("loader")!.value!);
})
EventsListeners.addEventsListeners(VSCanvasContainer);