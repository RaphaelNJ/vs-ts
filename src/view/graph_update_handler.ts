import { Graph } from "../core/graph";
import { getNodeConnections } from "../core/graph_manager";
import { ModificationType } from "../core/types";
import { project_preferences } from "../preferences";
import { getPinPathPoint } from "./event_listeners";
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
		VSCanvasDivs.innerHTML += project_preferences.nodeGenerator(value, path[1]);
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
			let input = document.querySelector(`[vs-node-uid="${value.input.node}"][vs-pin-uid="${value.input.pin}"]`) as HTMLElement;
			let output = document.querySelector(`[vs-node-uid="${value.output.node}"][vs-pin-uid="${value.output.pin}"]`) as HTMLElement;
			let inputPos = getPinPathPoint(input);
			let outputPos = getPinPathPoint(output);
			Graph.nodes[value.output.node]
			VSCConnectionsSVGs.innerHTML += `<path id="${path[1]}" d="${project_preferences.pathGenerator(
				outputPos[0],
				outputPos[1],
				inputPos[0],
				inputPos[1]
			)}"
			vs-connection-type="${Graph.nodes[value.output.node].outputPin[value.output.pin]?.type || ""}"
			vs-connection-execution="${(Graph.nodes[value.output.node].outputPin[value.output.pin]?.type == undefined).toString()	}">`;

		}
	}
	if ((path[0] == "executionConnections" || path[0] == "dataConnections") && path.length == 2 && modificationType === ModificationType.DELETED) {
		let connectionPath = document.getElementById(path[1]) as HTMLElement;
		if (connectionPath !== null) {
			connectionPath.remove();
		}
	}
}
