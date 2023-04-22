import { FunctionProps, FunctionsList } from "../types";
import { currentFunction } from "./generate_environement";

export let functionsList: FunctionsList = {
	"main": {
		description: "the main function",
		inputs: [],
		outputs: [],
		Graph: null,
		internalVariables: {},
	},
    // "function 1": {
	// 	description: "function 1",
	// 	inputs: [
	// 		{
	// 			name: "string",
	// 			description: "string",
	// 			type: "string",
	// 			defaultValue: "string",
	// 		},
	// 	],
	// 	outputs: [
	// 		{
	// 			name: "string",
	// 			description: "string",
	// 			type: "string",
	// 		},
	// 	],
	// 	Graph: null,
	// 	internalVariables: {
	// 		string: {
	// 			type: "string",
	// 			value: "string",
	// 		},
	// 	},
	// },
};

export function saveCurrentFunction(changedFunction: FunctionProps): void {
	functionsList[currentFunction] = changedFunction;

}

export function changeFunctionsList(changedFunctionsList: FunctionsList): void {
	functionsList = changedFunctionsList;
}