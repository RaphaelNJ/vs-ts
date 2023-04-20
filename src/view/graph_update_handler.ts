import { Graph } from "../core/graph";
import { getNodeConnections, setContainerColorListener } from "../core/graph_manager";
import { ModificationType } from "../core/types";
import { project_preferences } from "../preferences";
import { getPinPathPoint } from "./events_managers/pins_events_manager";
import { VSCanvas, VSCanvasNavigation, VSCanvasDivs, VSCConnectionsSVGs } from "./generate_environement";

export function onGraphChanged(p: string, modificationType: ModificationType, value: any): void {
	let path = p.split(".");
	if (path[0] == "zoom") {
		VSCanvas.style.scale = value;
		if (VSCanvas.style.scale == "1") {
			VSCanvas.style.scale = "0.999"; // without it, there is this wierd bug that, if the scale == 1, all the <path> tags are a little bit offseted
		}
	}
	if (path[0] == "offset") {
		VSCanvasNavigation.style.transform = `translate(${value.x}px, ${value.y}px)`;
		VSCanvas.style.backgroundPosition = `${value.x}px ${value.y}px`;
	}
	if (modificationType === ModificationType.CREATED && path[0] == "nodes" && path.length == 2) {
		let tempDiv = document.createElement('div');
		tempDiv.innerHTML = project_preferences.nodeGenerator(value, path[1])
		VSCanvasDivs.appendChild(tempDiv.children[0] as HTMLElement);
	}
	if (modificationType === ModificationType.UPDATED && path[0] == "nodes") {
		if (path.length == 3) {
			let node = document.getElementById(path[1]) as HTMLElement;
			if (node !== null) {
				if (path[2] == "pos") {
					node.style.transform = `translate(${value[0]}px, ${value[1]}px)`;
					let connections = getNodeConnections(path[1]);
					connections.forEach((e) => {
						let val;
						if (e.isData) {
							val = Graph.dataConnections[e.uid];
						} else {
							val = JSON.parse(JSON.stringify(Graph.executionConnections[e.uid]));
						}

						// move the connection
						let input = document.querySelector(`[vs-node-uid="${val.input.node}"][vs-pin-uid="${val.input.pin}"]`) as HTMLElement;
						let output = document.querySelector(`[vs-node-uid="${val.output.node}"][vs-pin-uid="${val.output.pin}"]`) as HTMLElement;
						let inputPos = getPinPathPoint(input);
						let outputPos = getPinPathPoint(output);
						if (document.getElementById(e.uid) != null) {
							document
								.getElementById(e.uid)
								?.setAttribute("d", project_preferences.pathGenerator(outputPos[0], outputPos[1], inputPos[0], inputPos[1]));
						}
					});
				}
			}
		}
	}
	if (modificationType === ModificationType.DELETED && path[0] == "nodes") {
		if (path.length == 2) {
			let node = document.getElementById(path[1]) as HTMLElement;
			if (node !== null) {
				VSCanvasDivs.removeChild(node);
			}
		}
	}
	if ((path[0] == "executionConnections" || path[0] == "dataConnections") && path.length == 2 && modificationType === ModificationType.CREATED) {
		let connectionPath = document.getElementById(path[1]) as HTMLElement;
		if (connectionPath === null) {
			createConnectionPath(path[1], value.input.node, value.input.pin, value.output.node, value.output.pin);
		}
	}
	if ((path[0] == "executionConnections" || path[0] == "dataConnections") && path.length == 2 && modificationType === ModificationType.DELETED) {
		let connectionPath = document.getElementById(path[1]) as HTMLElement;
		if (connectionPath !== null) {
			connectionPath.remove();
		}
	}
	if (path[0] == "containers" && path.length == 2 && modificationType === ModificationType.CREATED) {
		let tempDiv = document.createElement('div');
		tempDiv.innerHTML = project_preferences.containerGenerator(value, path[1])
		VSCanvasDivs.appendChild(tempDiv.children[0] as HTMLElement);
		setContainerColorListener(path[1]);
	}
	if (modificationType === ModificationType.UPDATED && path[0] == "containers") {
		if (path.length == 3) {
			let container = document.getElementById(path[1]) as HTMLElement;
			if (container !== null) {
				if (path[2] == "pos") {
					container.style.transform = `translate(${value[0]}px, ${value[1]}px)`;
				} else if (path[2] == "size") {
					container.style.width = `${value[0]}px`;
					container.style.height = `${value[1]}px`;
				} else if (path[2] == "primaryColor") {
					container.style.setProperty("--primary-color", value)
				} else if (path[2] == "secondaryColor") {
					container.style.setProperty("--secondary-color", value)
				}
			}
		}
	}
	if (modificationType === ModificationType.DELETED && path[0] == "containers") {
		if (path.length == 2) {
			let container = document.getElementById(path[1]) as HTMLElement;
			if (container !== null) {
				VSCanvasDivs.removeChild(container);
			}
		}
	}
}

export function createConnectionPath(
	connectionUid: string,
	inputNodeUid: string,
	inputPinUid: string,
	outputNodeUid: string,
	outputPinUid: string
): void {
	let input = document.querySelector(`[vs-node-uid="${inputNodeUid}"][vs-pin-uid="${inputPinUid}"]`) as HTMLElement;
	let output = document.querySelector(`[vs-node-uid="${outputNodeUid}"][vs-pin-uid="${outputPinUid}"]`) as HTMLElement;
	let inputPos = getPinPathPoint(input);
	let outputPos = getPinPathPoint(output);
	Graph.nodes[outputNodeUid];
	VSCConnectionsSVGs.innerHTML += `<path id="${connectionUid}" d="${project_preferences.pathGenerator(
		outputPos[0],
		outputPos[1],
		inputPos[0],
		inputPos[1]
	)}"
	vs-connection-type="${Graph.nodes[outputNodeUid].outputPin[outputPinUid]?.type || ""}"
	vs-connection-execution="${(Graph.nodes[outputNodeUid].outputPin[outputPinUid]?.type == undefined).toString()}">`;
}
