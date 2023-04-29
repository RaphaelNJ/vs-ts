// +-----------------------------------+
// |                                   |
// |   Variables Declaration           |
// |                                   |
// +-----------------------------------+
import * as VsT from "../../types";

let nodeLookupTable: VsT.NodeLookupTable = {
	Enter: <VsT.NodeType>{
		id: "Enter",
		title: "Enter",
		description: "",
		otherProperties: {
			isClosable: false,
			isDraggable: true,
			isResizable: false,
			code: "{! cexe !}",
		},
		executionInputPin: [],
		executionOutputPin: [
			{
				id: "cexe",
				name: "Enter Execution",
				description: "The execution of the code will start here.",
			},
		],
		inputPin: [],
		outputPin: [],
	},
	Test: <VsT.NodeType>{
		id: "Enter",
		title: "A Test Node",
		description: "Anim ullamco ad nulla occaecat aliquip. Mollit id veniam deserunt eu tempor qui aute ullamco adipisicing culpa eu mollit. Excepteur laborum amet dolor consequat sit sunt ullamco veniam elit ad deserunt magna ut. Minim aute ipsum eu sint sit sit voluptate occaecat pariatur.",
		otherProperties: {
			isClosable: true,
			isDraggable: true,
			isResizable: false,
			code: "console.log('Hello world !'){! cexe !}",
		},
		executionInputPin: [
			{
				name: "Execute Code",
				description: "",
			},
		],
		executionOutputPin: [
			{
				id : "cexe",
				name: "Continue Execution",
				description: "",
			},
			{
				id : "2cexe",
				name: "2nd Continue Execution",
				description: "",
			},
			{
				id : "3cexe",
				name: "Execute Code",
				description: "",
			},
		],
		inputPin: [
			{
				id: 'a',
				type: "boolean",
				name: "To Log",
				description: "The message you want to log",
				defaultHardWrittenBareData: "true",
				defaultHardWrittenVariableData: "value",
			},
			{
				id: 'a',
				type: "object",
				name: "To Log",
				description: "The message you want to log",
				defaultHardWrittenBareData: "{'Hello World !': 2}",
				defaultHardWrittenVariableData: "value",
			},
			{
				id: 'a',
				type: "string",
				name: "To Log",
				description: "The message you want to log",
				defaultHardWrittenBareData: "Hello World !",
				defaultHardWrittenVariableData: "value",
			}
		],
		outputPin: [
			{
				id: 'a',
				type: "boolean",
				name: "To Log",
				description: "The message you want to log",
			},{
				id: 'a',
				type: "array",
				name: "To Log",
				description: "The message you want to log",
			},{
				id: 'a',
				type: "array",
				name: "To Log",
				description: "The message you want to log",
			},{
				id: 'a',
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
	SetStringVar: <VsT.NodeType>{
		id: 'setStringVar',
		title: "Affecter la variable de type string à...",
		description: "",
		otherProperties: {
			isClosable: true,
			isDraggable: true,
			isResizable: false,
			code: "console.log('Hello world !'){!cexe!}",
		},
		executionInputPin: [
			{
				name: "Execute Code",
				description: "",
			},
		],
		executionOutputPin: [
			{
				id: 'cexe',
				name: "Continue Execution",
				description: "",
			}
		],
		inputPin: [
			{
				id: 'a',
				type: "string",
				name: "La variable",
				description: "",
				defaultHardWrittenBareData: "",
				defaultHardWrittenVariableData: "",
			},
			
			{
				id: 'a',
				type: "string",
				name: "Sa Valeur",
				description: "",
				defaultHardWrittenBareData: "",
				defaultHardWrittenVariableData: "",
			}
		],
		outputPin: [],
	},
	Say: <VsT.NodeType>{
		id: 'say',
		title: "Dire Quelque Chose",
		description: "qqch à dire",
		otherProperties: {
			isClosable: true,
			isDraggable: true,
			isResizable: false,
			code: "console.log({= to_say =}){!cexe!}",
		},
		executionInputPin: [
			{
				name: "Execute Code",
				description: "",
			},
		],
		executionOutputPin: [
			{
				id: 'cexe',
				name: "Continue Execution",
				description: "",
			}
		],
		inputPin: [
			{
				id: 'to_say',
				type: "string",
				name: "A dire",
				description: "",
				defaultHardWrittenBareData: "Bonjour",
				defaultHardWrittenVariableData: "",
			}
		],
		outputPin: [],
	},
	Ask: <VsT.NodeType>{
		id: 'ask',
		title: "Demander Quelque Chose",
		description: "qqch à demander",
		otherProperties: {
			isClosable: true,
			isDraggable: true,
			isResizable: false,
			code: "{userPrompt: prompt({= title =})}{!cexe!}",
		},
		executionInputPin: [
			{
				name: "Execute Code",
				description: "",
			},
		],
		executionOutputPin: [
			{
				id: 'cexe',
				name: "Continue Execution",
				description: "",
			}
		],
		inputPin: [
			{
				id: "title",
				type: "string",
				name: "A demander",
				description: "",
				defaultHardWrittenBareData: "Quoi ?",
				defaultHardWrittenVariableData: "",
			}
		],
		outputPin: [
			{
				id: 'userPrompt',
				type: "string",
				name: "Réponse",
				description: "",
			}
		],
	},
	Return: <VsT.NodeType>{
		id: "return",
		title: "Return",
		description: "",
		otherProperties: {
			isClosable: false,
			isDraggable: true,
			isResizable: false,
			code: "",
		},
		executionInputPin: [
			{
				name: "Finish Your code here and return something",
				description: "",
			}
		],
		executionOutputPin: [],
		inputPin: [],
		outputPin: [],
	},
};

export { nodeLookupTable };
