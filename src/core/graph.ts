import * as VsT from "./types";
import { existingIDs as importedExistingIDs } from "./uid_generator";
import { createProxy } from "./proxy";
import { onGraphChanged } from "../view/graph_update_handler";

export let Graph:VsT.Graph = createProxy({
	nodes: {},
	dataConnections: {},
	executionConnections: {},
}, onGraphChanged);

export function saveGraph(): string {
    return btoa(JSON.stringify({ Graph, existingIDs: importedExistingIDs }));
}
export function loadGraph(data: string): void {
	let existingIDs;
	({ Graph, existingIDs } = JSON.parse(atob(data)));
	
	Object.assign(importedExistingIDs, existingIDs);
}