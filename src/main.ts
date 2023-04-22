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
import { changeGraph, Graph } from "./Graph/core/graph";
import { makeID, generateUID } from "./uid_generator";
import { VsNode } from "./types";
import { nodeLookupTable } from "./Graph/core/node_look_up_table";
import { addFunction } from "./Functions/functions_manager";

let tempInputFunctionVariablesIds: string[] = [];
let tempOutputFunctionVariablesIds: string[] = [];

loadFunction("main");

document.getElementById("popup-overlay")?.addEventListener("mousedown", function (event) {
	if (event.target === this) {
		this.style.display = "none";
	}
});
document.addEventListener("click", (e) => {
	let target = e.target as HTMLElement;
	if (target.id == "save") {
		console.log(LoadSave.saveGraph());
	} else if (target.id == "load") {
		LoadSave.loadGraph((document.getElementById("loader") as HTMLInputElement).value);
	} else if (target.id == "close-popup") {
		(document.getElementById("popup-overlay") as HTMLElement).style.display = "none";
	} else if (target.id == "FunctionVariablesSave") {
		let inputVariables = [];
		let outputVariables = [];
		let usedInputsNames: string[] = [];
		let usedOutputsNames: string[] = [];
		for (let i = 0; i < tempInputFunctionVariablesIds.length; i++) {
			let name = (document.getElementById("fun-var-in-name-" + tempInputFunctionVariablesIds[i]) as HTMLInputElement)?.value;
			let type = (document.getElementById("fun-var-in-type-" + tempInputFunctionVariablesIds[i]) as HTMLInputElement)?.value;
			let defaultValueElm = document.getElementById("fun-var-in-value-" + tempInputFunctionVariablesIds[i]) as HTMLInputElement;
			let defaultValue = "";

			if (type == "boolean") {
				defaultValue = defaultValueElm.checked ? "true" : "false";
			} else {
				defaultValue = defaultValueElm.value;
			}
			if (name != "" && !usedInputsNames.includes(name)) {
				inputVariables.push({
					name: name,
					type: type,
					description: "",
				});
				functionsList[FunctionsView.currentFunction].inputs.push({
					name: name,
					type: type
				});
			}
			usedInputsNames.push(name);
		}
		for (let i = 0; i < tempOutputFunctionVariablesIds.length; i++) {
			let name = (document.getElementById("fun-var-out-name-" + tempOutputFunctionVariablesIds[i]) as HTMLInputElement).value;
			let type = (document.getElementById("fun-var-out-type-" + tempOutputFunctionVariablesIds[i]) as HTMLInputElement).value;
			if (name != "" && !usedOutputsNames.includes(name)) {
				outputVariables.push({
					name: name,
					type: type,
					description: "",
					defaultHardWrittenBareData: "",
					defaultHardWrittenVariableData: "",
				});
				functionsList[FunctionsView.currentFunction].outputs.push({
					name: name,
					type: type,
				});
			}
			usedOutputsNames.push(name);
		}
		functionsList[FunctionsView.currentFunction].outputs = outputVariables;
		deletePopup();
		let EnterPos: [number, number] = [0, 0];
		Object.keys(Graph.nodes).forEach((key) => {
			if (Graph.nodes[key].title == "Enter") {
				EnterPos = Graph.nodes[key].pos;
				GraphManager.deleteNode(key);
			}
		});
		nodeLookupTable["Enter-" + FunctionsView.currentFunction] = nodeLookupTable["Enter"];
		nodeLookupTable["Enter-" + FunctionsView.currentFunction].outputPin = inputVariables;
		GraphManager.createNode("Enter-" + FunctionsView.currentFunction, EnterPos[0], EnterPos[1]);

		let ReturnPos: [number, number] = [0, 0];
		Object.keys(Graph.nodes).forEach((key) => {
			if (Graph.nodes[key].title == "Return") {
				ReturnPos = Graph.nodes[key].pos;
				GraphManager.deleteNode(key);
			}
		});
		nodeLookupTable["Return-" + FunctionsView.currentFunction] = nodeLookupTable["Return"];
		nodeLookupTable["Return-" + FunctionsView.currentFunction].inputPin = outputVariables;
		GraphManager.createNode("Return-" + FunctionsView.currentFunction, ReturnPos[0], ReturnPos[1]);
		addFunction(FunctionsView.currentFunction);
	} else if (target.classList.contains("fun-var-in-delete-btn")) {
		let uid = target.getAttribute("fun-var-in-uid");
		if (uid != null) {
			document.getElementById(uid)?.remove();
		}
	} else if (target.classList.contains("fun-var-out-delete-btn")) {
		let uid = target.getAttribute("fun-var-out-uid");
		if (uid != null) {
			document.getElementById(uid)?.remove();
		}
	} else if (target.classList.contains("fun-var-input-create-btn")) {
		let DetailsFunctionInputTable = document.getElementById("DetailsFunctionInputTable") as HTMLElement;
		let id = makeID(12);

		let tempDiv = document.createElement("tbody");
		tempDiv.innerHTML = /*html*/ `
		<tr id="${id}">
			<td>
				<input id="fun-var-in-name-${id}" type="text" />
			</td>
			<td>
			<select id="fun-var-in-type-${id}" fun-var-in-uid="${id}" class="fun-var-select-type">
				<option value="boolean">Boolean</option>
				<option value="string">String</option>
				<option value="array">Array</option>
				<option value="number">Number</option>
				<option value="object">Object</option>
			</select>
			</td>
			<td id="fun-in-${id}">
				<input id="fun-var-in-value-${id}" type="checkbox" />
			</td>
			<td>
				<button fun-var-in-uid="${id}" class="fun-var-in-delete-btn delete-btn">X</button>
			</td>
		</tr>`;
		DetailsFunctionInputTable.insertBefore(tempDiv.children[0] as HTMLElement, DetailsFunctionInputTable.firstChild);
		tempInputFunctionVariablesIds.push(id);
	} else if (target.classList.contains("fun-var-output-create-btn")) {
		let DetailsFunctionInputTable = document.getElementById("DetailsFunctionOutputTable") as HTMLElement;
		let id = makeID(12);

		let tempDiv = document.createElement("tbody");
		tempDiv.innerHTML = /*html*/ `
		<tr id="${id}">
			<td>
				<input id="fun-var-out-name-${id}" type="text" />
			</td>
			<td>
			<select id="fun-var-out-type-${id}">
				<option value="boolean">Boolean</option>
				<option value="string">String</option>
				<option value="array">Array</option>
				<option value="number">Number</option>
				<option value="object">Object</option>
			</select>
			</td>
			<td>
				<button fun-var-out-uid="${id}" class="fun-var-out-delete-btn delete-btn">X</button>
			</td>
		</tr>`;
		DetailsFunctionInputTable.insertBefore(tempDiv.children[0] as HTMLElement, DetailsFunctionInputTable.firstChild);
		tempOutputFunctionVariablesIds.push(id);
	}
});

document.getElementById("HeaderFunctionDetails")!.addEventListener("click", () => {
	tempInputFunctionVariablesIds = [];
	tempOutputFunctionVariablesIds = [];
	loadPopup(
		'Details of the function "' + FunctionsView.currentFunction + '"',
		/*html*/ `
	<div>Description : ${functionsList[FunctionsView.currentFunction].description}</div>
	<div id="DetailsFunctionTables">
		<table>
			<thead>
				<tr>
					<th>Nom</th>
					<th>Type</th>
					<th>Valeur</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody id="DetailsFunctionInputTable">
				<tr>
					<td colspan="4">
						<button id="DetailsFunctionInputAdd" class="fun-var-input-create-btn create-btn">+ Add</button>
					</td>
				</tr>
			</tbody>
		</table>
		<table>
			<thead>
				<tr>
					<th>Nom</th>
					<th>Type</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody id="DetailsFunctionOutputTable">
				<tr>
					<td colspan="3">
						<button id="DetailsFunctionOutputAdd" class="fun-var-output-create-btn create-btn">+ Add</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	<button id="FunctionVariablesSave" class="fun-var-save-btn save-btn">Save</button>
	`
	);
});

document.addEventListener("change", (e) => {
	let target = e.target as HTMLInputElement;
	if (target.classList.contains("fun-var-select-type")) {
		let uid = target.getAttribute("fun-var-in-uid");
		if (uid != null && target.value != "boolean") {
			let element = document.getElementById("fun-in-" + uid);
			if (element != null) {
				element.innerHTML = `<input id="fun-var-in-value-${uid}" type="text" />`;
			}
		} else if (uid != null && target.value == "boolean") {
			let element = document.getElementById("fun-in-" + uid);
			if (element != null) {
				element.innerHTML = `<input id="fun-var-in-value-${uid}" type="checkbox" />`;
			}
		}
	}
});

export function loadFunction(functionName: string): void {
	let newGraph = false;
	let Graph = functionsList[functionName].Graph;
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
		};
	}

	functionsList[functionName].Graph = Graph;

	changeVariablesList(functionsList[functionName].internalVariables);

	changeGraph(Graph);

	document.getElementById("FunctionsContainer")?.remove();
	document.getElementById("GraphContainer")?.remove();
	document.getElementById("VariablesContainer")?.remove();

	let FunctionsContainer = document.querySelector<HTMLDivElement>("#template-left-panel")!;

	let GraphContainer = document.querySelector<HTMLDivElement>("#template-middle-panel")!;

	let VariablesContainer = document.querySelector<HTMLDivElement>("#template-right-panel")!;

	FunctionsView.initHtml(FunctionsContainer, functionsList);
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
		if (functionName != "main") {
			pos = EventsListeners.convertCanvasPosToGraphPos([
				VSCanvasContainer.getBoundingClientRect().right - 80,
				VSCanvasContainer.getBoundingClientRect().bottom - 80,
			]);
			GraphManager.createNode("Return", pos[0], pos[1]);
		}
	}

	FunctionsView.changeCurrentFunction(functionName);

	document.getElementById("HeaderFunctionName")!.innerHTML = "Current Function : " + functionName;
	//document.getElementById('HeaderFunctionDescription')!.innerHTML = functionsList[functionName].description;
	if (functionName == "main") {
		document.getElementById("HeaderFunctionDetails")!.style.display = "none";
	} else {
		document.getElementById("HeaderFunctionDetails")!.style.display = "block";
	}
}
export function loadPopup(titleHTML: string, contentHTML: string) {
	(document.getElementById("popup-overlay") as HTMLElement).style.display = "block";
	(document.getElementById("popupTitle") as HTMLElement).innerHTML = titleHTML;
	(document.getElementById("popupContent") as HTMLElement).innerHTML = contentHTML;
}
export function deletePopup() {
	(document.getElementById("popup-overlay") as HTMLElement).style.display = "none";
}
