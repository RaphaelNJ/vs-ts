// +-----------------------------------+
// |                                   |
// |   Variables Declaration           |
// |                                   |
// +-----------------------------------+
import * as VsT from "./types";

let nodeLookupTable: VsT.NodeLookupTable = {
	Enter: <VsT.NodeType>{
		title: "Enter",
		description: "",
		code: "",
		otherProperties: {
			isClosable: false,
			isDraggable: true,
			isResizable: false,
		},
		x: 10,
		y: 10,
		executionInputPin: [],
		executionOutputPin: [
			{
				name: "Enter Execution",
				description: "The execution of the code will start here.",
			},
		],
		inputPin: [],
		outputPin: [],
	},
	Log: <VsT.NodeType>{
		title: "Log 'Hello world !'",
		description: "Log 'Hello world !'",
		code: "console.log('Hello world !')",
		otherProperties: {
			isClosable: true,
			isDraggable: true,
			isResizable: false,
		},
		x: 10,
		y: 10,
		executionInputPin: [
			{
				name: "Execute Code",
				description: "",
			},
		],
		executionOutputPin: [
			{
				name: "Continue Execution",
				description: "",
			},
		],
		inputPin: [],
		outputPin: [],
	},
};

export { nodeLookupTable };
