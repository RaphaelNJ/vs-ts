import { Graph } from "../core/graph";
import { project_preferences } from "../preferences";
import { VSCanvasDivs } from "./generate_environement";
import * as GraphManager from "../core/graph_manager";
import { verifIfISChildOfAProperty } from "./html_tools";

import {invokeCM} from "./invoke_cm"

import * as GraphEvents from "./events_managers/graph_events_manager";
import * as NodesEvents from "./events_managers/nodes_events_manager";
import * as PinsEvents from "./events_managers/pins_events_manager";
import * as ContainersEvents from "./events_managers/containers_events_manager";

// for dev pupuses:
let currentNode = "Test";

export function addEventsListeners(VSCanvasContainer: HTMLElement): void {
	VSCanvasContainer.addEventListener("mousedown", onMouseDown);
	VSCanvasContainer.addEventListener("mouseup", onMouseUp);
	VSCanvasContainer.addEventListener("mouseleave", onMouseLeave);
	VSCanvasContainer.addEventListener("mouseenter", onMouseEnter);
	VSCanvasContainer.addEventListener("mousemove", onMouseMove);
	VSCanvasContainer.addEventListener("contextmenu", onContextMenu);
	VSCanvasContainer.addEventListener("wheel", onWheel);
	VSCanvasContainer.addEventListener("change", onChange);

	GraphEvents.init();
	NodesEvents.init();
	PinsEvents.init();
	ContainersEvents.init();
}
function onMouseDown(event: MouseEvent): void {
	const target = event.target! as HTMLElement;
	NodesEvents.onMouseDown(event, target);
	GraphEvents.onMouseDown(event, target);
	PinsEvents.onMouseDown(event, target);
	ContainersEvents.onMouseDown(event, target);
}
function onMouseUp(event: MouseEvent): void {
	const target = event.target! as HTMLElement;
	ContainersEvents.onMouseUp(event, target);
	NodesEvents.onMouseUp(event, target);
	GraphEvents.onMouseUp(event, target);
	PinsEvents.onMouseUp(event, target);
	ContainersEvents.onMouseUp(event, target);
}
function onMouseLeave(event: MouseEvent): void {
	const target = event.target! as HTMLElement;
	NodesEvents.onMouseLeave(event, target);
	GraphEvents.onMouseLeave(event, target);
	PinsEvents.onMouseLeave(event, target);
	ContainersEvents.onMouseLeave(event, target);
}
function onMouseEnter(event: MouseEvent): void {
	const target = event.target! as HTMLElement;
	NodesEvents.onMouseEnter(event, target);
	GraphEvents.onMouseEnter(event, target);
	PinsEvents.onMouseEnter(event, target);
	ContainersEvents.onMouseEnter(event, target);
}
function onMouseMove(event: MouseEvent): void {
	const target = event.target! as HTMLElement;
	ContainersEvents.onMouseMove(event, target);
	NodesEvents.onMouseMove(event, target);
	GraphEvents.onMouseMove(event, target);
	PinsEvents.onMouseMove(event, target);
	ContainersEvents.onMouseMove(event, target);
}
function onContextMenu(event: MouseEvent): void {
	const target = event.target! as HTMLElement;
	NodesEvents.onContextMenu(event, target);
	PinsEvents.onContextMenu(event, target);
	invokeCM(event.clientX, event.clientY, (out: any) => {
		let pos = convertCanvasPosToGraphPos([out.input.x, out.input.y]);
		if(out.elt == "Container") {
			GraphManager.createDefaultContainer(pos[0], pos[1]);
		} else {
			GraphManager.createNode(out.elt,pos[0], pos[1]);
		}
	});
	event.preventDefault()
}
function onWheel(event: WheelEvent): void {
	const target = event.target! as HTMLElement;
	GraphEvents.onWheel(event, target);
	PinsEvents.onWheel(event, target);
	event.preventDefault()
}
function onChange(event: Event): void {
	const target = event.target! as HTMLElement;
	ContainersEvents.onChange(event, target);
}
export function convertCanvasPosToGraphPos(pos: [number, number]): [number, number] {
	pos[0] = (pos[0] - VSCanvasDivs.getBoundingClientRect().x) / Graph.zoom;
	pos[1] = (pos[1] - VSCanvasDivs.getBoundingClientRect().y) / Graph.zoom;
	return pos;
}