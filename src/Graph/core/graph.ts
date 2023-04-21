import * as VsT from "../../types";
import { createProxy } from "./proxy";
import { onGraphChanged } from "../view/graph_update_handler";

export let Graph: VsT.Graph = createProxy(
	{
		nodes: {},
		dataConnections: {},
		executionConnections: {},
		containers: {},
		zoom: 0.999, // without it, there is this wierd bug that, if the scale == 1, all the <path> tags are a little bit offseted
		offset: {
			x: 0,
			y: 0,
		},
	},
	onGraphChanged
);

export function changeGraph(changedGraph: VsT.Graph): void {
	Graph = createProxy(changedGraph,onGraphChanged);
}