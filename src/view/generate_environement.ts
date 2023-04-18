import { Graph } from "../core/graph";
import { project_preferences } from "../preferences";

export let VSCanvasContainer: HTMLElement;
export let VSCanvas: HTMLElement;
export let VSCanvasNavigation: HTMLElement;
export let VSCanvasDivs: HTMLElement;
export let VSCanvasSVGs: HTMLElement;
export let VSCConnectionsSVGs: HTMLElement;
export let VSCurrentConnectionPath: HTMLElement;

export function initHtml(): HTMLElement {
	VSCanvasContainer = document.createElement("div");
	VSCanvas = document.createElement("div");
	VSCanvasNavigation = document.createElement("div");
	VSCanvasDivs = document.createElement("div");
	VSCanvasSVGs = document.createElement("div");
	
	VSCanvasContainer.id = "VSCanvasContainer";
	VSCanvas.id = "VSCanvas";
	VSCanvasNavigation.id = "VSCanvasNavigation";
	VSCanvasDivs.id = "VSCanvasDivs";
	VSCanvasSVGs.id = "VSCanvasSVGs";

	let canvasSize = 100 * (1 / project_preferences.zoomMin);
	VSCanvas.style.width = canvasSize + "%";
	VSCanvas.style.minWidth = canvasSize + "%";
	VSCanvas.style.height = canvasSize + "%";
	VSCanvas.style.minHeight = canvasSize + "%";
	VSCanvasSVGs.style.position = "absolute";
	
	VSCanvasSVGs.innerHTML = '<svg id="VSCConnectionsSVGs"><path id="VSCurrentConnectionPath"></svg>';
	VSCanvasNavigation.appendChild(VSCanvasDivs);
	VSCanvasNavigation.appendChild(VSCanvasSVGs);
	VSCanvas.appendChild(VSCanvasNavigation);
	VSCanvasContainer.appendChild(VSCanvas);

	
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = "";
	document.querySelector<HTMLDivElement>("#app")!.appendChild(VSCanvasContainer);

	VSCConnectionsSVGs = document.getElementById("VSCConnectionsSVGs")!;
	VSCurrentConnectionPath = document.getElementById('VSCurrentConnectionPath')!

	VSCanvasNavigation.style.transform = "translate(0px, 0px)"; // without it, there is this wierd bug that, if the VSCanvasNavigation has no transform, the nodes are not "object-fit: cover;"
	refreshGraph();
	
	return VSCanvasContainer;
}

function refreshGraph(): void {
	VSCanvasNavigation.style.transform = `translate(${Graph.offset.x}px, ${Graph.offset.y}px)`;
	VSCanvas.style.scale = Graph.zoom.toString();
	VSCanvas.style.backgroundPosition = `${Graph.offset.x}px ${Graph.offset.y}px`;

	Object.keys(Graph.nodes).forEach(e => {
		VSCanvasDivs.innerHTML += project_preferences.nodeGenerator(Graph.nodes[e], e);
	})
}
