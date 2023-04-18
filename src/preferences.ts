import { Graph } from "./core/graph";
import { Preferences } from "./core/types";
import { VsNode } from "./core/types";
import { generateUID } from "./core/uid_generator";

let nodeGenerator = (Node: VsNode, nodeUID: string): string => {
	let inputPins = "";
	let outputPins = "";

	Object.keys(Node.executionInputPin).forEach((pin) => {
		inputPins += `<div class="NodePin ExecutionPin" vs-is-pin="true" vs-pin-name="${Node.executionInputPin[pin].name}" vs-is-exe-pin="true" vs-pin-uid="${pin}" vs-node-uid="${nodeUID}"></div>`;
	});
	Object.keys(Node.inputPin).forEach((pin) => {
		inputPins += `<div class="NodePin" vs-is-pin="true" vs-pin-name="${Node.inputPin[pin].details.name}" vs-is-exe-pin="false" vs-pin-type="${Node.inputPin[pin].details.type}" vs-pin-uid="${pin}" vs-node-uid="${nodeUID}"></div>`;
	});
	Object.keys(Node.executionOutputPin).forEach((pin) => {
		outputPins += `<div class="NodePin ExecutionPin" vs-is-pin="true" vs-pin-name="${Node.executionOutputPin[pin].name}" vs-is-exe-pin="true" vs-pin-uid="${pin}" vs-node-uid="${nodeUID}"></div>`;
	});
	Object.keys(Node.outputPin).forEach((pin) => {
		outputPins += `<div class="NodePin" vs-is-pin="true" vs-pin-name="${Node.outputPin[pin].name}" vs-is-exe-pin="false" vs-pin-type="${Node.outputPin[pin].type}" vs-pin-uid="${pin}" vs-node-uid="${nodeUID}"></div>`;
	});

	return `<div class="Node" id="${nodeUID}" style="transform: translate(${Node.pos[0]}px, ${Node.pos[1]}px)">
	<header vs-is-draggable="true" vs-node-uid="${nodeUID}">
    <div class="NodeHeader" vs-is-draggable="true" vs-node-uid="${nodeUID}">
        ${Node.title}
    </div>${Node.otherProperties.isClosable ? `<button class="NodeCloseButton" vs-node-uid="${nodeUID}" vs-is-closable="true">X</button>` : ""}
</header>
<article class="NodeArticle">
    <div class="inputs pins">${inputPins}</div>
    <div class="content">
        ${Node.description}
    </div>
    <div class="outputs pins">${outputPins}</div>
</article></div>`;
};

let pathGenerator = (x1: number, y1: number, x2: number, y2: number): string => {
	let x1d = x1 - -Math.abs(x1 - x2) * 0.75;
	let x2d = x2 + -Math.abs(x1 - x2) * 0.75;
	return `M ${x1} ${y1} C ${x1d} ${y1} ${x2d} ${y2} ${x2} ${y2}`;
};

export let project_preferences: Preferences = {
	zoomSteps: 0.1,
	zoomMin: 0.1,
	zoomMax: 3,
	nodeGenerator: nodeGenerator,
	pathGenerator: pathGenerator,
	technical: {
		uidLength: 7,
	},
};
