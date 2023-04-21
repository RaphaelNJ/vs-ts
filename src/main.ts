import "./general.css";
import "./Graph/styles/GraphUtils.css";
import "./Graph/styles/style.css";
import "./Graph/styles/pins.css";
import "./Graph/styles/connections.css";
import "./Graph/styles/containers.css";
import "./Variables/styles/VariablesUtils.css";
import "toolcool-color-picker";
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// console.log(typescriptLogo, viteLogo)

import * as GraphManager from "./Graph/core/graph_manager";
import * as Graph from "./Graph/core/graph";
import * as View from "./Graph/view/generate_environement";
import * as EventsListeners from "./Graph/view/event_listeners";
import * as VariablesView from "./Variables/generate_environement";
import * as VariablesEventsListenners from "./Variables/events_listenners";
import { variablesList } from "./Variables/variables_list";

let GraphContainer = document.createElement('div')
document.querySelector<HTMLDivElement>("#app")!.append(GraphContainer);
let VariablesContainer = document.createElement('div')
VariablesContainer.style.height = "100%";
document.querySelector<HTMLDivElement>("#app")!.append(VariablesContainer);


VariablesEventsListenners.addEventsListeners(VariablesView.initHtml(VariablesContainer, variablesList));

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
document.getElementById("close-popup")?.addEventListener("click", function () {
	(document.getElementById("popup-overlay") as HTMLElement).style.display = "none";
});
document.getElementById("popup-overlay")?.addEventListener("mousedown", function (event) {
	if (event.target === this) {
		this.style.display = "none";
	}
});

export function loadPopup(titleHTML: string, contentHTML: string) {
	(document.getElementById("popup-overlay") as HTMLElement).style.display = "block";
	(document.getElementById("popupTitle") as HTMLElement).innerHTML = titleHTML;
	(document.getElementById("popupContent") as HTMLElement).innerHTML = contentHTML;
}
export function deletePopup() {
	(document.getElementById("popup-overlay") as HTMLElement).style.display = "none";
}