import { Graph } from "../../core/graph";
import { project_preferences } from "../../../preferences";

let isMouseDownOnGraph: boolean;
let mousePos: { x: number; y: number };
let mouseOffset: { x: number; y: number };
let lastMousePos: { x: number; y: number };

export function init(): void {
	isMouseDownOnGraph = false;
	mousePos = { x: 0, y: 0 };
	mouseOffset = { x: 0, y: 0 };
	lastMousePos = { x: 0, y: 0 };
}

export function onMouseDown(event: MouseEvent, target: HTMLElement): void {
    isMouseDownOnGraph = target.id == "VSCanvas" ? true : false;
}

export function onMouseUp(event: MouseEvent, target: HTMLElement): void {
    isMouseDownOnGraph = false;
}

export function onMouseLeave(event: MouseEvent, target: HTMLElement): void {
    isMouseDownOnGraph = false;
}

export function onMouseEnter(event: MouseEvent, target: HTMLElement): void {}

export function onMouseMove(event: MouseEvent, target: HTMLElement): void {
	mousePos = { x: event.clientX, y: event.clientY };
	mouseOffset = { x: (mousePos.x - lastMousePos.x) * (1 / Graph.zoom), y: (mousePos.y - lastMousePos.y) * (1 / Graph.zoom) };
	if (isMouseDownOnGraph && event.buttons == 1) {
		let GraphOffset = { ...Graph.offset };
		GraphOffset.x += mouseOffset.x;
		GraphOffset.y += mouseOffset.y;
		Graph.offset = GraphOffset;
	}
	lastMousePos = { x: event.clientX, y: event.clientY };
}

export function onContextMenu(event: MouseEvent, target: HTMLElement): void {}
export function onWheel(event: WheelEvent, target: HTMLElement): void {
	if (event.deltaY < 0) {
		Graph.zoom = Math.max(Graph.zoom - project_preferences.zoomSteps, project_preferences.zoomMin);
	} else if (event.deltaY > 0) {
		Graph.zoom = Math.min(Graph.zoom + project_preferences.zoomSteps, project_preferences.zoomMax);
	}
}
