import { Graph } from "../../core/graph";
import * as GraphManager from "../../core/graph_manager";
import { project_preferences } from "../../preferences";
import { convertCanvasPosToGraphPos } from "../event_listeners";

let mousePos: { x: number; y: number };
let isPanningConnection: boolean;
let pinConnectionPanning: { pin: string; node: string };
let pathStroke: number;
let VSCurrentConnectionPath: HTMLElement;

export function init(): void {
	VSCurrentConnectionPath = document.getElementById("VSCurrentConnectionPath")!;
	pathStroke = parseInt(window.getComputedStyle(VSCurrentConnectionPath).getPropertyValue("stroke-width").replaceAll("px", ""));
	mousePos = { x: 0, y: 0 };
	isPanningConnection = false;
	pinConnectionPanning = { pin: "", node: "" };
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
			drawCurrentConnectionPath(startPin, [mousePos.x, mousePos.y]);
		}
	}
}
export function onContextMenu(event: MouseEvent, target: HTMLElement): void {}
export function onWheel(event: WheelEvent, target: HTMLElement): void {}

/**
 * convert e.clientX and e.clientY to graph coordinates
 */
export function getPinPathPoint(pin: HTMLElement): [number, number] {
	let pos = convertCanvasPosToGraphPos([
		pin.getBoundingClientRect().x + pin.getBoundingClientRect().width / 2,
		pin.getBoundingClientRect().y + pin.getBoundingClientRect().height / 2,
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