import * as VsT from "./types";
import { nodeLookupTable } from "./node_look_up_table";
import { Graph } from "./graph";
import * as uidTools from "./uid_generator";
import { project_preferences } from "../../preferences";
import * as Containers from "../view/events_managers/containers_events_manager";
import "toolcool-color-picker";
import ColorPicker from "toolcool-color-picker";

// +-----------------------------------+
// |                                   |
// |   Nodes Management                |
// |                                   |
// +-----------------------------------+

/**
 *
 * @param id the key in the nodeLookupTable
 * @param x the x coordinates of the node
 * @param y the y coordinates of the node
 * @returns the uid of the created node
 */
export function createNode(id: string, x: number, y: number): string {
	let uid = uidTools.generateUID();
	let executionInputPin: { [key: string]: VsT.ExecutionInputPinDetails } = {};
	let executionOutputPin: { [key: string]: VsT.ExecutionOutputPinDetails } = {};
	let outputPin: { [key: string]: VsT.DataOutputPinDetails } = {};
	let inputPin: { [key: string]: VsT.DataInputPin } = {};

	for (let i = 0; i < nodeLookupTable[id].executionInputPin.length; i++) {
		executionInputPin[uidTools.generateUID()] = nodeLookupTable[id].executionInputPin[i];
	}
	for (let i = 0; i < nodeLookupTable[id].executionOutputPin.length; i++) {
		executionOutputPin[uidTools.generateUID()] = nodeLookupTable[id].executionOutputPin[i];
	}
	for (let i = 0; i < nodeLookupTable[id].outputPin.length; i++) {
		outputPin[uidTools.generateUID()] = nodeLookupTable[id].outputPin[i];
	}
	for (let i = 0; i < nodeLookupTable[id].inputPin.length; i++) {
		inputPin[uidTools.generateUID()] = {
			details: nodeLookupTable[id].inputPin[i],
			hardWrittenBareData: nodeLookupTable[id].inputPin[i].defaultHardWrittenBareData,
			hardWrittenVariableData: nodeLookupTable[id].inputPin[i].defaultHardWrittenVariableData,
			DataMode: 0,
		};
	}
	Graph.nodes[uid] = {
		title: nodeLookupTable[id].title,
		description: nodeLookupTable[id].description,
		pos: [x, y],
		executionInputPin: executionInputPin,
		executionOutputPin: executionOutputPin,
		inputPin: inputPin,
		outputPin: outputPin,
		otherProperties: nodeLookupTable[id].otherProperties,
	};
	return uid;
}
export function deleteNode(id: string): void {
	const { inputPin, outputPin, executionInputPin, executionOutputPin } = Graph.nodes[id];

	const pins = [
		{ pin: inputPin, isInput: true },
		{ pin: outputPin, isInput: false },
		{ pin: executionInputPin, isInput: true },
		{ pin: executionOutputPin, isInput: false },
	];

	// Remove all connections and pins UIDs
	for (const { pin, isInput } of pins) {
		for (const key of Object.keys(pin)) {
			const connection = getPinConnectionUID(id, key, isInput);
			if (connection) {
				deleteConnection(connection.uid);
			}
			uidTools.removeUID(key);
		}
	}

	// Remove the node UID
	uidTools.removeUID(id);

	// Delete the node
	delete Graph.nodes[id];
}
export function moveNode(id: string, x: number, y: number): void {
	let nodePos = [Graph.nodes[id].pos[0] + x, Graph.nodes[id].pos[1] + y];
	Graph.nodes[id].pos = nodePos as [number, number];
}

// +-----------------------------------+
// |                                   |
// |   Containers Management           |
// |                                   |
// +-----------------------------------+

export function createDefaultContainer(posX: number, posY: number): string {
	let uid = uidTools.generateUID();
	Graph.containers[uid] = {
		pos: [posX, posY],
		title: project_preferences.containers.defaultTitle,
		description: project_preferences.containers.defaultDescription,
		primaryColor: project_preferences.containers.defaultPrimaryColor,
		secondaryColor: project_preferences.containers.defaultSecondaryColor,
		size: project_preferences.containers.defaultSize,
		otherProperties: project_preferences.containers.defaultOtherProperties,
	};
	return uid;
}
export function createContainer(
	posX: number,
	posY: number,
	sizeX: number,
	sizeY: number,
	title: string,
	description: string,
	primaryColor: string,
	secondaryColor: string,
	otherProperties: { [key: string]: any }
): string {
	let uid = uidTools.generateUID();
	Graph.containers[uid] = {
		pos: [posX, posY],
		title: title,
		description: description,
		primaryColor: primaryColor,
		secondaryColor: secondaryColor,
		size: [sizeX, sizeY],
		otherProperties: otherProperties,
	};
	return uid;
}
export function deleteContainer(uid: string): void {
	uidTools.removeUID(uid);
	delete Graph.containers[uid];
}
export function moveContainer(uid: string, x: number, y: number): void {
	let containerPos = [Graph.containers[uid].pos[0] + x, Graph.containers[uid].pos[1] + y];
	Object.keys(Graph.nodes).forEach((e) => {
		let node = document.getElementById(e);
		if (node != null) {
			let nodeSize = node.getBoundingClientRect();
			if (
				checkIfNodeIsStickedToContainer(
					Graph.containers[uid].pos[0],
					Graph.containers[uid].pos[1],
					Graph.containers[uid].size[0],
					Graph.containers[uid].size[1],
					Graph.nodes[e].pos[0],
					Graph.nodes[e].pos[1],
					nodeSize.width,
					nodeSize.height
				)
			) {
				moveNode(e, x, y);
			}
		}
	});
	Graph.containers[uid].pos = containerPos as [number, number];
}
export function resizeContainer(uid: string, x: number, y: number): void {
	let containerSize = [Graph.containers[uid].size[0] + x, Graph.containers[uid].size[1] + y];
	Graph.containers[uid].size = containerSize as [number, number];
}

export function setContainerColorListener(uid: string) {
	let primaryColorPicker = document.getElementById(uid + "-pcolor") as ColorPicker;
	let secondaryColorPicker = document.getElementById(uid + "-scolor") as ColorPicker;
	primaryColorPicker.addEventListener("change", (evt: Event) => {
		const customEvent = evt as CustomEvent;
		Containers.onColorChanged(uid, customEvent.detail.rgba, "primary");
	});
	secondaryColorPicker.addEventListener("change", (evt: Event) => {
		const customEvent = evt as CustomEvent;
		Containers.onColorChanged(uid, customEvent.detail.rgba, "secondary");
	});
}

export function checkIfNodeIsStickedToContainer(aX: number, aY: number, aW: number, aH: number, bX: number, bY: number, bW: number, bH: number) {
	// Check if squares are colliding along the X-axis
	const xAxisCollision = aX + aW >= bX && bX + bW >= aX;

	// Check if squares are colliding along the Y-axis
	const yAxisCollision = aY + aH >= bY && bY + bH >= aY;

	// If there's a collision in both X and Y axes, then the squares are colliding
	return xAxisCollision && yAxisCollision;
}

// +-----------------------------------+
// |                                   |
// |   Connections Management          |
// |                                   |
// +-----------------------------------+

/**
 * - if return = 0 -> not a valid connection
 * - if return = 1 -> valid execution connection
 * - if return = 2 -> valid data connection
 */
export function checkHypotheticalConnection(outputNodeUID: string, outputPinUID: string, inputNodeUID: string, inputPinUID: string): number {
	if (outputNodeUID == inputNodeUID) {
		return 0;
	}
	if (outputPinUID == inputPinUID) {
		return 0;
	}
	if (Graph.nodes[outputNodeUID] == undefined || Graph.nodes[inputNodeUID] == undefined) {
		return 0;
	}
	let data = 0;
	let execution = 0;

	data += Graph.nodes[outputNodeUID].outputPin[outputPinUID] == undefined ? 0 : 1;
	data += Graph.nodes[inputNodeUID].inputPin[inputPinUID] == undefined ? 0 : 1;
	execution += Graph.nodes[outputNodeUID].executionOutputPin[outputPinUID] == undefined ? 0 : 1;
	execution += Graph.nodes[inputNodeUID].executionInputPin[inputPinUID] == undefined ? 0 : 1;

	if (execution < 2 && data < 2) {
		return 0;
	}

	if (execution == 2) {
		return 1;
	}
	if (data == 2) {
		if (Graph.nodes[outputNodeUID].outputPin[outputPinUID].type != Graph.nodes[inputNodeUID].inputPin[inputPinUID].details.type) {
			return 0;
		}
		return 2;
	}
	return 0;
}

/**
 * @param isInput mettre true pour les connexions d'entrée et false pour les connexions de sortie
 * return a object with:
 * - the uid key as the uid the asked connection
 * - the type of the connection ("data" or "execution")
 * or null if the connection don't exist
 */
export function getPinConnectionUID(nodeUID: string, pinUID: string, isInput: boolean): { type: string; uid: string } | null {
	const dataConnections = isInput ? "input" : "output";
	const dataConnection = Object.keys(Graph.dataConnections).find((key) => {
		return Graph.dataConnections[key][dataConnections].node === nodeUID && Graph.dataConnections[key][dataConnections].pin === pinUID;
	});

	if (dataConnection) {
		return {
			type: "data",
			uid: dataConnection,
		};
	}

	const executionConnections = isInput ? "input" : "output";
	const executionConnection = Object.keys(Graph.executionConnections).find((key) => {
		return (
			Graph.executionConnections[key][executionConnections].node === nodeUID && Graph.executionConnections[key][executionConnections].pin === pinUID
		);
	});

	if (executionConnection) {
		return {
			type: "execution",
			uid: executionConnection,
		};
	}

	return null;
}

/**
 * return the uid of the created connection or null if the connection is invalid
 */
export function createConnection(outputNodeUID: string, outputPinUID: string, inputNodeUID: string, inputPinUID: string): string | null {
	let connectionType = checkHypotheticalConnection(outputNodeUID, outputPinUID, inputNodeUID, inputPinUID);
	if (connectionType == 0) {
		return null;
	} else {
		let connectionUID = uidTools.generateUID();
		let formerConnections = [];
		formerConnections.push(getPinConnectionUID(outputNodeUID, outputPinUID, false));
		formerConnections.push(getPinConnectionUID(inputNodeUID, inputPinUID, true));
		formerConnections.forEach((e) => {
			if (e !== null) {
				deleteConnection(e.uid);
			}
		});
		if (connectionType == 1) {
			Graph.executionConnections[connectionUID] = {
				output: {
					node: outputNodeUID,
					pin: outputPinUID,
				},
				input: {
					node: inputNodeUID,
					pin: inputPinUID,
				},
			};
		} else if (connectionType == 2) {
			Graph.dataConnections[connectionUID] = {
				type: Graph.nodes[outputNodeUID].outputPin[outputPinUID].type,
				output: {
					node: outputNodeUID,
					pin: outputPinUID,
				},
				input: {
					node: inputNodeUID,
					pin: inputPinUID,
				},
			};
			Graph.nodes[inputNodeUID].inputPin[inputPinUID].DataMode = 0;
		}
		return connectionUID;
	}
}
export function deleteConnection(connectionUID: string): void {
	if (Graph.dataConnections[connectionUID] !== undefined) {
		delete Graph.dataConnections[connectionUID];
		uidTools.removeUID(connectionUID);
	} else if (Graph.executionConnections[connectionUID] !== undefined) {
		delete Graph.executionConnections[connectionUID];
		uidTools.removeUID(connectionUID);
	}
}
export function getNodeConnections(nodeUID: string): { isInput: boolean; isData: boolean; uid: string }[] {
	const { inputPin, outputPin, executionInputPin, executionOutputPin } = Graph.nodes[nodeUID];
	const pins = [
		{ pin: inputPin, isInput: true, isData: true },
		{ pin: outputPin, isInput: false, isData: true },
		{ pin: executionInputPin, isInput: true, isData: false },
		{ pin: executionOutputPin, isInput: false, isData: false },
	];

	let connections: { isInput: boolean; isData: boolean; uid: string }[] = [];

	for (const { pin, isInput, isData } of pins) {
		for (const key of Object.keys(pin)) {
			const connection = getPinConnectionUID(nodeUID, key, isInput);
			if (connection) {
				connections.push({
					uid: connection.uid,
					isInput: isInput,
					isData: isData,
				});
			}
		}
	}
	return connections;
}
