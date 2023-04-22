import { nodeLookupTable } from "../Graph/core/node_look_up_table";
import { functionsList } from "./functions_list";
import * as VsT from "./../types";
import { addFunctionToCM } from "../Graph/view/invoke_cm";


export function addFunction(functionToAdd: string) {
	functionsList[functionToAdd];

	let toAdd: VsT.NodeType = {
		title: functionToAdd,
		description: functionsList[functionToAdd].description,
		executionInputPin: [
			{
				name: 'Enter the "' + functionToAdd + '" function',
				description: "",
			},
		],
		executionOutputPin: [
			{
				name: "Enter Execution",
				description: "The execution of the code will start here.",
			},
		],
		inputPin: [],
		outputPin: [],
        otherProperties: {
			isClosable: true,
			isDraggable: true,
			isResizable: false,
			code: "",
        }
	};
	functionsList[functionToAdd].outputs.forEach((e) => {
		toAdd.outputPin.push({
			type: e.type,
			name: e.name,
			description: "",
		});
	});
    functionsList[functionToAdd].inputs.forEach((e) => {
		toAdd.inputPin.push({
			type: e.type,
			name: e.name,
			description: "",
            defaultHardWrittenBareData: "",
            defaultHardWrittenVariableData: "",
		});
	});

	nodeLookupTable[functionToAdd] = toAdd;
    addFunctionToCM(functionToAdd);
}
