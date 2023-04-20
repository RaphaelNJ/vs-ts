import { Graph } from "../../core/graph";
import * as GraphManager from "../../core/graph_manager";
import { VSCurrentConnectionPath } from "../generate_environement";
import { getIdOfParentWithProperty } from "../html_tools";

let isMouseDown: boolean;
let pathStroke: number;
let nodeBeingDragged: HTMLElement | null;
let mousePos: { x: number; y: number };
let mouseOffset: { x: number; y: number };
let lastMousePos: { x: number; y: number };

export function init(): void {
	isMouseDown = false;
	pathStroke = parseInt(window.getComputedStyle(VSCurrentConnectionPath).getPropertyValue("stroke-width").replaceAll("px", ""));
	nodeBeingDragged = null;
	mousePos = { x: 0, y: 0 };
	mouseOffset = { x: 0, y: 0 };
	lastMousePos = { x: 0, y: 0 };
}

export function onMouseDown(event: MouseEvent, target: HTMLElement): void {
	isMouseDown = true;
	let uid = getIdOfParentWithProperty(target, "vs-element-type", "node");

	if (event.button == 0 && uid !== null) {
		let node = document.getElementById(uid);
		if (target.classList.contains("NodeCloseButton")) {
			if (uid) {
				GraphManager.deleteNode(uid);
			}
		}
		if (node != null) {
			if (target.getAttribute("vs-is-draggable") == "true") {
				nodeBeingDragged = node;
				isMouseDown = true;
				lastMousePos = { x: event.clientX, y: event.clientY };
			}
			updateZIndex(node.style.zIndex == "" ? 0 : parseInt(node.style.zIndex));
			node.style.zIndex = (node.childElementCount + 1).toString();
		}
	}
}

export function onMouseUp(event: MouseEvent, target: HTMLElement): void {
	isMouseDown = false;
	nodeBeingDragged = null;
}

export function onMouseLeave(event: MouseEvent, target: HTMLElement): void {
	isMouseDown = false;
	nodeBeingDragged = null;
}

export function onMouseEnter(event: MouseEvent, target: HTMLElement): void {
	lastMousePos = { x: event.clientX, y: event.clientY };
}

export function onMouseMove(event: MouseEvent, target: HTMLElement): void {
	mousePos = { x: event.clientX, y: event.clientY };
	mouseOffset = { x: (mousePos.x - lastMousePos.x) * (1 / Graph.zoom), y: (mousePos.y - lastMousePos.y) * (1 / Graph.zoom) };
	if (isMouseDown && nodeBeingDragged != null) {
		GraphManager.moveNode(nodeBeingDragged.id, mouseOffset.x, mouseOffset.y);
	}
	lastMousePos = { x: event.clientX, y: event.clientY };
}

export function onContextMenu(event: MouseEvent, target: HTMLElement): void {}

export function onWheel(event: WheelEvent, target: HTMLElement): void {}

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

