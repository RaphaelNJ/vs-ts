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
		otherProperties: {
			isClosable: false,
			isDraggable: true,
			isResizable: false,
			code: "",
		},
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
	Test: <VsT.NodeType>{
		title: "A Test Node",
		description: "Anim ullamco ad nulla occaecat aliquip. Mollit id veniam deserunt eu tempor qui aute ullamco adipisicing culpa eu mollit. Excepteur laborum amet dolor consequat sit sunt ullamco veniam elit ad deserunt magna ut. Minim aute ipsum eu sint sit sit voluptate occaecat pariatur.",
		otherProperties: {
			isClosable: true,
			isDraggable: true,
			isResizable: false,
			code: "console.log('Hello world !')",
		},
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
			{
				name: "2nd Continue Execution",
				description: "",
			},
			{
				name: "Execute Code",
				description: "",
			},
		],
		inputPin: [
			{
				type: "boolean",
				name: "To Log",
				description: "The message you want to log",
				defaultHardWrittenBareData: "true",
				defaultHardWrittenVariableData: "value",
			},
			{
				type: "object",
				name: "To Log",
				description: "The message you want to log",
				defaultHardWrittenBareData: "{'Hello World !': 2}",
				defaultHardWrittenVariableData: "value",
			},
			{
				type: "string",
				name: "To Log",
				description: "The message you want to log",
				defaultHardWrittenBareData: "Hello World !",
				defaultHardWrittenVariableData: "value",
			}
		],
		outputPin: [
			{
				type: "boolean",
				name: "To Log",
				description: "The message you want to log",
			},{
				type: "array",
				name: "To Log",
				description: "The message you want to log",
			},{
				type: "array",
				name: "To Log",
				description: "The message you want to log",
			},{
				type: "string",
				name: "To Log",
				description: "The message you want to log",
			},
			{
				type: "object",
				name: "To Log",
				description: "The message you want to log",
			},
			{
				type: "number",
				name: "To Log",
				description: "The message you want to log",
			}],
	},
};

export { nodeLookupTable };
