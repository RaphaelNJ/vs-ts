import { Graph } from "../core/graph";
import { project_preferences } from "../preferences";
import { VSCanvasDivs } from "./generate_environement";
import * as NodeManager from "../core/graph_manager";

let isMouseDown: boolean;
let isMouseOut: boolean;
let isMouseOnDraggableElement: boolean;
let isMouseOnCanvas: boolean;
let lastMousePos: { x: number; y: number };
let mousePos: { x: number; y: number };
let mouseOffset: { x: number; y: number };
let isPanningConnection: boolean;
let pinConnectionPanning: { pin: string; node: string };
let pathStroke: number;
let VSCurrentConnectionPath: HTMLElement;
// for dev pupuses:
let currentNode = "Test";

export function addEventsListeners(VSCanvasContainer: HTMLElement): void {
	VSCurrentConnectionPath = document.getElementById("VSCurrentConnectionPath")!;
	pathStroke = parseInt(window.getComputedStyle(VSCurrentConnectionPath).getPropertyValue("stroke-width").replaceAll("px", ""));
	isMouseDown = false;
	isMouseOut = true;
	isMouseOnDraggableElement = false;
	isMouseOnCanvas = false;
	lastMousePos = { x: 0, y: 0 };
	mousePos = { x: 0, y: 0 };
	mouseOffset = { x: 0, y: 0 };
	isPanningConnection = false;
	pinConnectionPanning = { pin: "", node: "" };
	VSCanvasContainer.addEventListener("mousedown", onMouseDown);
	VSCanvasContainer.addEventListener("mouseup", onMouseUp);
	VSCanvasContainer.addEventListener("mouseleave", onMouseLeave);
	VSCanvasContainer.addEventListener("mouseenter", onMouseEnter);
	VSCanvasContainer.addEventListener("mousemove", onMouseMove);
	VSCanvasContainer.addEventListener("contextmenu", onContextMenu);
	VSCanvasContainer.addEventListener("wheel", onWheel);
}
function onMouseDown(event: MouseEvent): void {
	VSCurrentConnectionPath = document.getElementById("VSCurrentConnectionPath")!;

	event.preventDefault();
	const target = event.target! as HTMLElement;
	isMouseDown = true;
	isMouseOut = false;
	let uid = target.getAttribute("vs-node-uid");

	if (event.button == 0) {
		if (target.id === "VSCanvas") {
			isMouseOnCanvas = true;
		}
		if (target.classList.contains("NodeCloseButton")) {
			if (uid !== null) {
				NodeManager.deleteNode(uid);
			}
		}
		if (target.getAttribute("vs-is-draggable")) {
			isMouseOnDraggableElement = true;
			target.setAttribute("vs-is-being-dragged", "true");
			if (uid !== null) {
				let node = document.getElementById(uid);
				if (node !== null) {
					updateZIndex(node.style.zIndex == "" ? 0 : parseInt(node.style.zIndex));
					node.style.zIndex = (node.childElementCount + 1).toString();
				}
			}
		}
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
		}
	}
}
function onMouseUp(event: MouseEvent): void {
	event.preventDefault();
	VSCurrentConnectionPath.setAttribute("d", "");
	const target = event.target! as HTMLElement;
	if (isPanningConnection && target.getAttribute("vs-is-pin") == "true") {
		NodeManager.createConnection(
			pinConnectionPanning.node,
			pinConnectionPanning.pin,
			target.getAttribute("vs-node-uid")?.toString() || "",
			target.getAttribute("vs-pin-uid")?.toString() || ""
		);
	}
	document.querySelector('[vs-is-being-dragged="true"]')?.removeAttribute("vs-is-being-dragged");
	isMouseDown = false;
	isMouseOut = false;
	isMouseOnDraggableElement = false;
	isMouseOnCanvas = false;
	isPanningConnection = false;
	pinConnectionPanning = { pin: "", node: "" };
}
function onMouseLeave(event: MouseEvent): void {
	event.preventDefault();
	document.querySelector('[vs-is-being-dragged="true"]')?.removeAttribute("vs-is-being-dragged");
	isMouseOut = true;
	isMouseDown = false;
	isMouseOnDraggableElement = false;
	isMouseOnCanvas = false;
	isPanningConnection = false;
	pinConnectionPanning = { pin: "", node: "" };
	VSCurrentConnectionPath.setAttribute("d", "");
}
function onMouseEnter(event: MouseEvent): void {
	event.preventDefault();
	lastMousePos = { x: event.clientX, y: event.clientY };
	isMouseOut = false;
}
function onMouseMove(event: MouseEvent): void {
	event.preventDefault();
	isMouseOut = false;
	mousePos = { x: event.clientX, y: event.clientY };
	mouseOffset = { x: (mousePos.x - lastMousePos.x) * (1 / Graph.zoom), y: (mousePos.y - lastMousePos.y) * (1 / Graph.zoom) };
	if (isMouseDown && !isMouseOut && !isMouseOnDraggableElement && isMouseOnCanvas) {
		let GraphOffset = { ...Graph.offset };
		GraphOffset.x += mouseOffset.x;
		GraphOffset.y += mouseOffset.y;
		Graph.offset = GraphOffset;
	} else if (isMouseDown && !isMouseOut && isMouseOnDraggableElement) {
		const element = document.querySelector('[vs-is-being-dragged="true"]');
		if (element instanceof HTMLElement) {
			let transform = extractTranslate(element.style.transform);
			let elementPostion: [number, number];
			if (transform !== null) {
				elementPostion = [transform[0] + mouseOffset.x, transform[1] + mouseOffset.y];
			} else {
				elementPostion = [mouseOffset.x, mouseOffset.y];
			}

			let elementUID = element.getAttribute("vs-node-uid");
			if (elementUID !== null) {
				NodeManager.moveNode(elementUID, elementPostion[0], elementPostion[1]);
			} else {
				element.style.transform = `translate(${elementPostion[0]}px, ${elementPostion[1]}px)`;
			}
		}
	} else if (isMouseDown && !isMouseOut && !isMouseOnDraggableElement && isPanningConnection) {
		let startPin = document.querySelector(`[vs-node-uid="${pinConnectionPanning.node}"][vs-pin-uid="${pinConnectionPanning.pin}"][vs-is-pin="true"]`);
		if (startPin !== null) {
			let pathStart = getPinPathPoint(startPin as HTMLElement);
			let pathEnd = convertCanvasPosToGraphPos([mousePos.x, mousePos.y]);

			const nodeUid = startPin.getAttribute("vs-node-uid");
			const pinUid = startPin.getAttribute("vs-pin-uid");

			VSCurrentConnectionPath.setAttribute("vs-connection-type", nodeUid && pinUid ? Graph.nodes[nodeUid].outputPin[pinUid]?.type || "" : "");
			VSCurrentConnectionPath.setAttribute("vs-connection-execution", nodeUid && pinUid ? (Graph.nodes[nodeUid].outputPin[pinUid]?.type == undefined).toString() : "");
			VSCurrentConnectionPath.setAttribute(
				"d",
				project_preferences.pathGenerator(pathStart[0], pathStart[1], pathEnd[0], pathEnd[1] - pathStroke / 1.2)
			); // why is /1.2?
		}
	}

	lastMousePos = { x: event.clientX, y: event.clientY };
}
function onContextMenu(event: MouseEvent): void {
	event.preventDefault();
	let pos = convertCanvasPosToGraphPos([event.clientX, event.clientY]);

	NodeManager.createNode(currentNode, pos[0], pos[1]);
}
function onWheel(event: WheelEvent): void {
	event.preventDefault();
	if (event.deltaY < 0) {
		Graph.zoom = Math.max(Graph.zoom - project_preferences.zoomSteps, project_preferences.zoomMin);
	} else if (event.deltaY > 0) {
		Graph.zoom = Math.min(Graph.zoom + project_preferences.zoomSteps, project_preferences.zoomMax);
	}
}
function updateZIndex(zindex: number): void {
	let nodes = document.querySelectorAll(".Node");
	nodes.forEach((node) => {
		let nd = node as HTMLElement;
		if (parseInt(nd.style.zIndex) >= zindex) {
			if (nd.style.zIndex === "") {
				nd.style.zIndex = "0";
			} else {
				nd.style.zIndex = (parseInt(nd.style.zIndex) - 1).toString();
			}
		}
	});
}
function extractTranslate(translateString: string): [number, number] | null {
	const match = /translate\((-?\d+\.?\d*)px, (-?\d+\.?\d*)px\)/.exec(translateString);
	if (match) {
		const x = parseFloat(match[1]);
		const y = parseFloat(match[2]);
		return [x, y];
	} else {
		return null;
	}
}
/**
 * convert e.clientX and e.clientY to graph coordinates
 */
function convertCanvasPosToGraphPos(pos: [number, number]): [number, number] {
	pos[0] = (pos[0] - VSCanvasDivs.getBoundingClientRect().x) / Graph.zoom;
	pos[1] = (pos[1] - VSCanvasDivs.getBoundingClientRect().y) / Graph.zoom;
	return pos;
}
export function getPinPathPoint(pin: HTMLElement): [number, number] {
	let pos = convertCanvasPosToGraphPos([
		pin.getBoundingClientRect().x + pin.getBoundingClientRect().width / 2,
		pin.getBoundingClientRect().y + pin.getBoundingClientRect().height / 2,
	]);
	pos[1] -= pathStroke;
	return pos;
}