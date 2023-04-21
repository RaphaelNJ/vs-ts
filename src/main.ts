import "./Graph/styles/GraphUtils.css";
import "./Graph/styles/style.css";
import "./Graph/styles/pins.css";
import "./Graph/styles/connections.css";
import "./Graph/styles/containers.css";
import "toolcool-color-picker";
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// console.log(typescriptLogo, viteLogo)

import * as GraphManager from "./Graph/core/graph_manager";
import * as Graph from "./Graph/core/graph";
import * as View from "./Graph/view/generate_environement";
import * as EventsListeners from "./Graph/view/event_listeners";
import { VariablesList } from "./Graph/core/types";

let GraphContainer = document.querySelector<HTMLDivElement>("#app")!

export let variablesList: VariablesList = {
	"test" : {type: "string", value : "test"},
	"test2" : {type: "string", value : "test2"},
	"test3" : {type: "boolean", value : "true"},
}

let VSCanvasContainer = View.initHtml(GraphContainer);
let pos = EventsListeners.convertCanvasPosToGraphPos([
	VSCanvasContainer.getBoundingClientRect().left + 10,
	VSCanvasContainer.getBoundingClientRect().top + 10,
]);
GraphManager.createNode("Enter", pos[0], pos[1]);
EventsListeners.addEventsListeners(VSCanvasContainer);

document.getElementById("save")!.addEventListener("click", () => {
	console.log(Graph.saveGraph());
});
document.getElementById("load")!.addEventListener("click", () => {
	Graph.loadGraph((document.getElementById("loader") as HTMLInputElement).value, GraphContainer);
});
