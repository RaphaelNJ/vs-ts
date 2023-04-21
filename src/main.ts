import "./general.css";
import "./Graph/styles/GraphUtils.css";
import "./Graph/styles/style.css";
import "./Graph/styles/pins.css";
import "./Graph/styles/connections.css";
import "./Graph/styles/containers.css";
import "./Variables/styles/VariablesUtils.css";
import "./Functions/styles/FunctionsUtils.css";
import "toolcool-color-picker";
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// console.log(typescriptLogo, viteLogo)

import * as GraphManager from "./Graph/core/graph_manager";
import * as LoadSave from "./load_save";
import * as View from "./Graph/view/generate_environement";
import * as EventsListeners from "./Graph/view/event_listeners";
import * as VariablesView from "./Variables/generate_environement";
import * as VariablesEventsListenners from "./Variables/events_listenners";
import * as FunctionsEventsListenners from "./Functions/events_listenners";
import * as FunctionsView from "./Functions/generate_environement";
import { variablesList, changeVariablesList } from "./Variables/variables_list";
import { functionsList } from "./Functions/functions_list";
import { changeGraph } from "./Graph/core/graph";



loadFunction('main');

document.getElementById("save")!.addEventListener("click", () => {
	console.log(LoadSave.saveGraph());
});
document.getElementById("load")!.addEventListener("click", () => {
	LoadSave.loadGraph((document.getElementById("loader") as HTMLInputElement).value);
});
document.getElementById("close-popup")?.addEventListener("click", function () {
	(document.getElementById("popup-overlay") as HTMLElement).style.display = "none";
});
document.getElementById("popup-overlay")?.addEventListener("mousedown", function (event) {
	if (event.target === this) {
		this.style.display = "none";
	}
});


export function loadFunction(functionName: string): void {

	let newGraph = false;
	let Graph = functionsList[functionName].Graph
	if (Graph == null) {
		newGraph = true;
		Graph = {
			nodes: {},
			dataConnections: {},
			executionConnections: {},
			containers: {},
			zoom: 0.999,
			offset: {
				x: 0,
				y: 0,
			},
		}
	}

	functionsList[functionName].Graph = Graph


	changeVariablesList(functionsList[functionName].internalVariables);

	changeGraph(Graph);

	document.getElementById("FunctionsContainer")?.remove()
	document.getElementById("GraphContainer")?.remove()
	document.getElementById("VariablesContainer")?.remove()

	let FunctionsContainer = document.createElement('div')
	FunctionsContainer.style.height = "100%";
	FunctionsContainer.id = "FunctionsContainer";
	document.querySelector<HTMLDivElement>("#app")!.append(FunctionsContainer);

	let GraphContainer = document.createElement('div')
	GraphContainer.id = "GraphContainer";
	document.querySelector<HTMLDivElement>("#app")!.append(GraphContainer);

	let VariablesContainer = document.createElement('div')
	VariablesContainer.style.height = "100%";
	VariablesContainer.id = "VariablesContainer";
	document.querySelector<HTMLDivElement>("#app")!.append(VariablesContainer);

	FunctionsView.initHtml(FunctionsContainer, functionsList)
	FunctionsEventsListenners.addEventsListeners();


	VariablesEventsListenners.addEventsListeners(VariablesView.initHtml(VariablesContainer, variablesList));

	let VSCanvasContainer = View.initHtml(GraphContainer);
	EventsListeners.addEventsListeners(VSCanvasContainer);

	if (newGraph) {
		let pos = EventsListeners.convertCanvasPosToGraphPos([
			VSCanvasContainer.getBoundingClientRect().left + 10,
			VSCanvasContainer.getBoundingClientRect().top + 10,
		]);
		GraphManager.createNode("Enter", pos[0], pos[1]);
	}


	FunctionsView.changeCurrentFunction(functionName);

	document.getElementById('HeaderFunctionName')!.innerHTML = functionName;
	document.getElementById('HeaderFunctionDescription')!.innerHTML = functionsList[functionName].description; 
}
export function loadPopup(titleHTML: string, contentHTML: string) {
	(document.getElementById("popup-overlay") as HTMLElement).style.display = "block";
	(document.getElementById("popupTitle") as HTMLElement).innerHTML = titleHTML;
	(document.getElementById("popupContent") as HTMLElement).innerHTML = contentHTML;
}
export function deletePopup() {
	(document.getElementById("popup-overlay") as HTMLElement).style.display = "none";
}