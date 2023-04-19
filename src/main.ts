import "./styles/GraphUtils.css";
import "./styles/style.css";
import "./styles/pins.css";
import "./styles/connections.css"
import "./styles/containers.css"
import 'toolcool-color-picker';
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// console.log(typescriptLogo, viteLogo)

import * as GraphManager from "./core/graph_manager";
import * as Graph from "./core/graph";
import * as View from "./view/generate_environement";
import * as EventsListeners from "./view/event_listeners";


let VSCanvasContainer = View.initHtml();
Graph.saveGraph();
document.getElementById("save")!.addEventListener('click', (e) => {
    console.log(Graph.saveGraph());
})
document.getElementById("load")!.addEventListener('click', (e) => {
    Graph.loadGraph(document.getElementById("loader")!.value!);
})
EventsListeners.addEventsListeners(VSCanvasContainer);