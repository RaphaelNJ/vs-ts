import * as VsT from "./types";
import { existingIDs as importedExistingIDs } from "./uid_generator";
import { createProxy } from "./proxy";
import { onGraphChanged } from "../view/graph_update_handler";
import { initHtml } from "../view/generate_environement";
import { addEventsListeners } from "../view/event_listeners";

export let Graph: VsT.Graph = createProxy(
	{
		nodes: {},
		dataConnections: {},
		executionConnections: {},
		zoom: 0.999, // without it, there is this wierd bug that, if the scale == 1, all the <path> tags are a little bit offseted
		offset: {
			x: 0,
			y: 0,
		},
	},
	onGraphChanged
);

export function saveGraph(): string {
	return btoa(JSON.stringify({ Graph: Graph, existingIDs: importedExistingIDs }));
}
export function loadGraph(data: string): void {
	let load = JSON.parse(atob(data));

	Graph = createProxy(load.Graph,
		onGraphChanged
	);
	Object.assign(importedExistingIDs, load.existingIDs);
	addEventsListeners(initHtml());
}