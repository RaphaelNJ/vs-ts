import { Graph } from "../../core/graph";
import * as GraphManager from "../../core/graph_manager";
import { verifIfISChildOfAProperty, getIdOfParentWithProperty } from "../html_tools";

let isMouseDown = false;
let lastMousePos = { x: 0, y: 0 };
let mousePos = { x: 0, y: 0 };
let mouseOffset = { x: 0, y: 0 };
let containerBeingDragged: HTMLElement | null = null;
let containerBeingResized: HTMLElement | null = null;

export function onMouseDown(event: MouseEvent, target: HTMLElement): void {
	let uid = target.getAttribute("vs-container-uid")?.toString();
	if (target.classList.contains("ContainerDraggablePart") && uid != undefined) {
		containerBeingDragged = document.getElementById(uid);
		isMouseDown = true;
		lastMousePos = { x: event.clientX, y: event.clientY };
	}
	if (target.classList.contains("ContainerResizer") && uid != undefined) {
		containerBeingResized = document.getElementById(uid);
		isMouseDown = true;
		lastMousePos = { x: event.clientX, y: event.clientY };
	}
	if (target.classList.contains("ContainerCloseButton")) {
		if (uid !== undefined) {
			GraphManager.deleteContainer(uid);
		}
	}
}
export function onMouseUp(event: MouseEvent, target: HTMLElement): void {
	let uid = getIdOfParentWithProperty(target, "vs-element-type", "container");
	if (uid != null) {
		let container = document.getElementById(uid);
		if (container != null) {
			Graph.containers[uid].size = [
				parseInt(window.getComputedStyle(container).getPropertyValue("width").replaceAll("px", "")),
				parseInt(window.getComputedStyle(container).getPropertyValue("height").replaceAll("px", "")),
			];
		}
	}
	isMouseDown = false;
	containerBeingDragged = null;
	containerBeingResized = null;
}
export function onMouseLeave(event: MouseEvent, target: HTMLElement): void {
	isMouseDown = false;
	containerBeingDragged = null;
	containerBeingResized = null;
}
export function onMouseEnter(event: MouseEvent, target: HTMLElement): void {}
export function onMouseMove(event: MouseEvent, target: HTMLElement): void {
	if (isMouseDown) {
		let mousePos = { x: event.clientX, y: event.clientY };
		let mouseOffset = { x: (mousePos.x - lastMousePos.x) * (1 / Graph.zoom), y: (mousePos.y - lastMousePos.y) * (1 / Graph.zoom) };
		if (containerBeingDragged != null) {
			GraphManager.moveContainer(containerBeingDragged.id, mouseOffset.x, mouseOffset.y);
		}
		if (containerBeingResized != null) {
			GraphManager.resizeContainer(containerBeingResized.id, mouseOffset.x, mouseOffset.y);
		}
		lastMousePos = { x: event.clientX, y: event.clientY };
	}
}
export function onContextMenu(event: MouseEvent, target: HTMLElement): void {}
export function onWheel(event: MouseEvent, target: HTMLElement): void {}
export function onChange(event: Event, target: HTMLElement): void {
	let uid = getIdOfParentWithProperty(target, "vs-element-type", "container");
	if (uid != null) {
		let elementFunction = target.getAttribute("vs-element-function");
		if (elementFunction != null && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
			if (elementFunction == "title") {
				Graph.containers[uid].title = target.value;
			} else if (elementFunction == "description") {
				Graph.containers[uid].description = target.value;
			}
		}
	}
}
export function onColorChanged(uid: string, value: string, type: string): void {
	if (type == "primary") {
		Graph.containers[uid].primaryColor = value;
	} else if (type == "secondary") {
		Graph.containers[uid].secondaryColor = value;
	}
}
