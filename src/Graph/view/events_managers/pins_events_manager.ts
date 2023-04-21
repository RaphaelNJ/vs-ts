import { Graph } from "../../core/graph";
import * as GraphManager from "../../core/graph_manager";
import { project_preferences } from "../../../preferences";
import { convertCanvasPosToGraphPos } from "../event_listeners";
import { getIdOfParentWithProperty } from "../html_tools";
import { variablesList } from "../../../main";

let mousePos: { x: number; y: number };
let isPanningConnection: boolean;
let pinConnectionPanning: { pin: string; node: string };
let pathStroke: number;
let VSCurrentConnectionPath: HTMLElement;

let stringObjects = ["string", "number", "array", "object"];

export function init(): void {
	VSCurrentConnectionPath = document.getElementById("VSCurrentConnectionPath")!;
	pathStroke = parseInt(window.getComputedStyle(VSCurrentConnectionPath).getPropertyValue("stroke-width").replaceAll("px", ""));
	mousePos = { x: 0, y: 0 };
	isPanningConnection = false;
	pinConnectionPanning = { pin: "", node: "" };

	document.addEventListener("mousedown", (e) => {
		let inputPinContextMenu = document.getElementById("inputPinContextMenu") as HTMLElement;
		if ((e.target as HTMLElement).id == "SaveButton") {
			if (inputPinContextMenu != null) {
				const bareDataSwitch = document.getElementById("bareDataSwitch") as HTMLInputElement;
				const variableDataSwitch = document.getElementById("variableDataSwitch") as HTMLInputElement;
				const bareData = document.getElementById("bareData") as HTMLInputElement;
				const variableData = document.getElementById("variableData") as HTMLSelectElement;
				let data = Graph.nodes[inputPinContextMenu.getAttribute("vs-node-uid") || ""]?.inputPin[inputPinContextMenu.getAttribute("vs-pin-uid") || ""];

				if (bareDataSwitch.checked && data !== undefined) {
					if (data.details.type == "boolean") {
						data.hardWrittenBareData = bareData.checked ? "true" : "false";
					} else if (stringObjects.includes(data.details.type)) {
						data.hardWrittenBareData = bareData.value;
					}
					data.DataMode = 2;
				} else if (variableDataSwitch.checked && data !== undefined) {
					data.hardWrittenVariableData = variableData.value;
					data.DataMode = 1;
				}
				inputPinContextMenu.remove();
			}
		} else if (getIdOfParentWithProperty(e.target as HTMLElement, "vs-element-type", "inputPinContextMenu") == null) {
			inputPinContextMenu?.remove();
		}
	});
}

export function onMouseDown(event: MouseEvent, target: HTMLElement): void {
	VSCurrentConnectionPath = document.getElementById("VSCurrentConnectionPath")!;
	if (target.getAttribute("vs-is-pin") == "true") {
		pinConnectionPanning = {
			pin: target.getAttribute("vs-pin-uid")?.toString() || "",
			node: target.getAttribute("vs-node-uid")?.toString() || "",
		};
		let isInputPin =
			(Graph.nodes[pinConnectionPanning.node].inputPin[pinConnectionPanning.pin] ||
				Graph.nodes[pinConnectionPanning.node].executionInputPin[pinConnectionPanning.pin]) == undefined
				? false
				: true;
		isPanningConnection = !isInputPin;
		// reroute the connection
		let pinConnection = GraphManager.getPinConnectionUID(pinConnectionPanning.node, pinConnectionPanning.pin, true);
		if (pinConnection !== null) {
			if (pinConnection.type == "execution") {
				pinConnectionPanning = {
					pin: Graph.executionConnections[pinConnection.uid].output.pin,
					node: Graph.executionConnections[pinConnection.uid].output.node,
				};
			} else {
				pinConnectionPanning = {
					pin: Graph.dataConnections[pinConnection.uid].output.pin,
					node: Graph.dataConnections[pinConnection.uid].output.node,
				};
			}
			let startPin = document.querySelector(
				`[vs-node-uid="${pinConnectionPanning.node}"][vs-pin-uid="${pinConnectionPanning.pin}"][vs-is-pin="true"]`
			);
			if (startPin !== null) {
				isPanningConnection = true;
				GraphManager.deleteConnection(pinConnection.uid);
				drawCurrentConnectionPath(startPin, [mousePos.x, mousePos.y]);
			}
		}
	}
}
export function onMouseUp(event: MouseEvent, target: HTMLElement): void {
	if (isPanningConnection && target.getAttribute("vs-is-pin") == "true") {
		GraphManager.createConnection(
			pinConnectionPanning.node,
			pinConnectionPanning.pin,
			target.getAttribute("vs-node-uid")?.toString() || "",
			target.getAttribute("vs-pin-uid")?.toString() || ""
		);
		deletePinToolTip();
		displayPinToolTip(
			event.clientX,
			event.clientY,
			parseInt(target.getAttribute("vs-pin-data-mode") || "0"),
			target.getAttribute("vs-pin-data") || "",
			target.getAttribute("vs-pin-type") || "",
		);
	}
	isPanningConnection = false;
	VSCurrentConnectionPath = document.getElementById("VSCurrentConnectionPath")!;
	VSCurrentConnectionPath.setAttribute("d", "");
}
export function onMouseLeave(event: MouseEvent, target: HTMLElement): void {
	isPanningConnection = false;
	pinConnectionPanning = { pin: "", node: "" };
	VSCurrentConnectionPath.setAttribute("d", "");
}
export function onMouseEnter(event: MouseEvent, target: HTMLElement): void {}
export function onMouseMove(event: MouseEvent, target: HTMLElement): void {
	mousePos = { x: event.clientX, y: event.clientY };
	if (isPanningConnection) {
		let startPin = document.querySelector(`[vs-node-uid="${pinConnectionPanning.node}"][vs-pin-uid="${pinConnectionPanning.pin}"][vs-is-pin="true"]`);
		if (startPin !== null) {
			drawCurrentConnectionPath(startPin, [mousePos.x, mousePos.y + pathStroke]);
		}
	}
	if (Graph.nodes[target.getAttribute("vs-node-uid") || ""]?.inputPin[target.getAttribute("vs-pin-uid") || ""] == undefined) {
		deletePinToolTip();
	} else {
		displayPinToolTip(
			event.clientX,
			event.clientY,
			parseInt(target.getAttribute("vs-pin-data-mode") || "0"),
			target.getAttribute("vs-pin-data") || "",
			target.getAttribute("vs-pin-type") || "",
		);
	}
}
export function onContextMenu(event: MouseEvent, target: HTMLElement): boolean {
	if (target.getAttribute("vs-is-pin") == "true" && target.getAttribute("vs-is-exe-pin") == "false") {
		let pin = Graph.nodes[target.getAttribute("vs-node-uid")?.toString() || ""].inputPin[target.getAttribute("vs-pin-uid")?.toString() || ""];
		if (pin != undefined) {
			configureInputPinMenu(event, target);
			return false;
		}
	}
	return true;
}
export function onWheel(event: WheelEvent, target: HTMLElement): void {
	if (Graph.nodes[target.getAttribute("vs-node-uid") || ""]?.inputPin[target.getAttribute("vs-pin-uid") || ""] == undefined) {
		deletePinToolTip();
	} else {
		displayPinToolTip(
			event.clientX,
			event.clientY,
			parseInt(target.getAttribute("vs-pin-data-mode") || "0"),
			target.getAttribute("vs-pin-data") || "",
			target.getAttribute("vs-pin-type") || "",
		);
	}
}

/**
 * convert e.clientX and e.clientY to graph coordinates
 */
export function getPinPathPoint(pin: HTMLElement): [number, number] {
	let pos = convertCanvasPosToGraphPos([
		pin.getBoundingClientRect().left + pin.getBoundingClientRect().width / 2,
		pin.getBoundingClientRect().top + pin.getBoundingClientRect().height / 1.3,
	]);
	VSCurrentConnectionPath = document.getElementById("VSCurrentConnectionPath")!;
	pathStroke = parseInt(window.getComputedStyle(VSCurrentConnectionPath).getPropertyValue("stroke-width").replaceAll("px", ""));
	pos[1] -= pathStroke;
	return pos;
}

function drawCurrentConnectionPath(startPin: Element, mousePos: [number, number]): void {
	let pathStart = getPinPathPoint(startPin as HTMLElement);
	let pathEnd = convertCanvasPosToGraphPos([mousePos[0], mousePos[1]]);

	const nodeUid = startPin.getAttribute("vs-node-uid");
	const pinUid = startPin.getAttribute("vs-pin-uid");

	VSCurrentConnectionPath.setAttribute("vs-connection-type", nodeUid && pinUid ? Graph.nodes[nodeUid].outputPin[pinUid]?.type || "" : "");
	VSCurrentConnectionPath.setAttribute(
		"vs-connection-execution",
		nodeUid && pinUid ? (Graph.nodes[nodeUid].outputPin[pinUid]?.type == undefined).toString() : ""
	);
	VSCurrentConnectionPath.setAttribute("d", project_preferences.pathGenerator(pathStart[0], pathStart[1], pathEnd[0], pathEnd[1] - pathStroke / 1.2)); // why is /1.2?
}

function configureInputPinMenu(event: MouseEvent, target: HTMLElement): void {
	let tempDiv = document.createElement("div");
	document.getElementById("inputPinContextMenu")?.remove();

	let bareDataInput = "";
	let data = Graph.nodes[target.getAttribute("vs-node-uid") || ""]?.inputPin[target.getAttribute("vs-pin-uid") || ""];
	if (data.details.type == "boolean") {
		bareDataInput = `<input type="checkbox" id="bareData" placeholder="Bare Data" ${data.hardWrittenBareData == "true" ? "checked" : ""} ${
			target.getAttribute("vs-pin-data-mode") == "2" ? "" : "disabled"
		} />`;
	} else if (stringObjects.includes(data.details.type)) {
		bareDataInput = `<input type="text" id="bareData" placeholder="Bare Data" value="${data.hardWrittenBareData}" ${
			target.getAttribute("vs-pin-data-mode") == "2" ? "" : "disabled"
		} />`;
	}

	let optionsValues = "";
	Object.keys(variablesList).forEach((e) => {
		if (variablesList[e].type == data?.details.type) {
			optionsValues += `<option value="${e}" ${data?.hardWrittenVariableData == e ? "selected" : ""}>${e}</option>`;
		}
	});
	tempDiv.innerHTML = `
<div id="inputPinContextMenu"
vs-element-type="inputPinContextMenu"
vs-pin-uid="${target.getAttribute("vs-pin-uid")}"
vs-node-uid="${target.getAttribute("vs-node-uid")}"
style="transform: translate(${event.clientX}px, ${event.clientY}px);">
	<div id="inputPinContextMenuPanel">
		<div id="inputPinContextMenuSwitch">
			<label>
				Bare Data
				<input type="radio" name="inputSwitch" id="bareDataSwitch" ${target.getAttribute("vs-pin-data-mode") == "2" ? "checked" : ""} />
			</label>
			<label>
				Variable Data
				<input type="radio" name="inputSwitch" id="variableDataSwitch" ${target.getAttribute("vs-pin-data-mode") == "1" ? "checked" : ""} />
			</label>
		</div>
		<div id="inputPinContextMenuInputs">
			${bareDataInput}
			<select id="variableData" ${target.getAttribute("vs-pin-data-mode") == "1" ? "" : "disabled"} >
				${optionsValues}
			</select>
		</div>
		<button id="SaveButton">Save</button>
	</div>
</div>`;
	document.documentElement.append(tempDiv.children[0] as HTMLElement);

	const bareDataSwitch = document.getElementById("bareDataSwitch") as HTMLInputElement;
	const variableDataSwitch = document.getElementById("variableDataSwitch") as HTMLInputElement;
	const bareData = document.getElementById("bareData") as HTMLInputElement;
	const variableData = document.getElementById("variableData") as HTMLSelectElement;

	const inputPinContextMenu = document.getElementById("inputPinContextMenu") as HTMLElement;

	inputPinContextMenu.addEventListener("mousemove", function () {
		deletePinToolTip();
	});

	bareDataSwitch.addEventListener("change", function () {
		bareData.disabled = !bareDataSwitch.checked;
		variableData.disabled = bareDataSwitch.checked;
	});
	variableDataSwitch.addEventListener("change", function () {
		bareData.disabled = variableDataSwitch.checked;
		variableData.disabled = !variableDataSwitch.checked;
	});
}
function displayPinToolTip(x: number, y: number, datamode: number, data: string, type: string): void {
	let offset = 5;
	let pinToolTip = document.getElementById("PinToolTip");
	if (pinToolTip == null) {
	let tempDiv = document.createElement("div");
	let stringDataMode = "";
	if (datamode == 1) {
		stringDataMode = "Variable Data";
	} else if (datamode == 2) {
		stringDataMode = "Bare Data";
	} else {
		stringDataMode = "Connection Data";
	}
	tempDiv.innerHTML = `
<div id="PinToolTip" style="top: ${y + offset}px; left: ${x + offset}px;">
	<div>${stringDataMode}</div>
	${datamode == 0 ? "" : `<div>type: ${type}</div>`}
	${datamode == 0 ? "" : `<div>${addEllipsis(data, 24)}</div>`}
</div>`;
	document.documentElement.append(tempDiv.children[0] as HTMLElement);
}
else {
	pinToolTip.style.top = y + offset + "px";
	pinToolTip.style.left = x + offset + "px";
}}
function deletePinToolTip() {
	document.getElementById("PinToolTip")?.remove();
}
function addEllipsis(str: string, x: number): string {
	if (str.length <= x) {
		return str;
	} else {
		return str.slice(0, x) + "...";
	}
}
