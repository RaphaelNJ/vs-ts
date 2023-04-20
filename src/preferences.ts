import { Preferences } from "./core/types";
import { VsNode, Container } from "./core/types";

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
</article></div>`.replaceAll("\n","").replaceAll('\t',"");
};
let containerGenerator = (Container: Container, containerUID: string): string => {
	return `
	<div vs-element-type="container" vs-keep-mouse-down="containier" id="${containerUID}"
	style="transform: translate(${Container.pos[0]}px, ${Container.pos[1]}px);
	width: ${Container.size[0]}px; height: ${Container.size[1]}px;
	--primary-color: ${Container.primaryColor};
	--secondary-color: ${Container.secondaryColor};"
	class="Container ContainerDraggablePart" vs-container-uid="${containerUID}">
			<p>
				<input vs-element-function="title" class="ContainerTitle" placeholder="Title" value="${Container.title}"></input>${Container.otherProperties.isClosable ? `<button class="ContainerCloseButton" vs-container-uid="${containerUID}" vs-is-closable="true">X</button>` : ""}
			</p>
			<textarea vs-element-function="description" class="ContainerDescription" rows="3"  placeholder="Description">${Container.description}</textarea>
			<div class="ContainerColors">
				<div>
					<toolcool-color-picker id="${containerUID}-pcolor" color="${Container.primaryColor}" id="color-picker-1"></toolcool-color-picker>
				</div>
				<div>
					<toolcool-color-picker id="${containerUID}-scolor" color="${Container.secondaryColor}" id="color-picker-1"></toolcool-color-picker>
				</div>
		</div>
		<div class="ContainerResizer" vs-container-uid="${containerUID}"></div>
	</div>`.replaceAll("\n","").replaceAll("\t","");
};

/**
 * Generates an SVG path string based on four coordinates.
 * 
 * @param {number} x1 - The x-coordinate of the starting point.
 * @param {number} y1 - The y-coordinate of the starting point.
 * @param {number} x2 - The x-coordinate of the ending point.
 * @param {number} y2 - The y-coordinate of the ending point.
 * @returns {string} The generated SVG path string.
 */
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
	containerGenerator: containerGenerator,
	technical: {
		uidLength: 7,
	},
	containers: {
		defaultTitle: "Untitled Container",
		defaultDescription: "Put your own description here",
		defaultPrimaryColor: "rgba(41, 241, 41, 0.5)",
		defaultSecondaryColor: "rgba(41, 241, 241, 1)",
		defaultSize: [400, 400],
		defaultOtherProperties: {
			isClosable: true,
		},
	},
};
