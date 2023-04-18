// +-----------------------------------+
// |                                   |
// |   Type Definitions                |
// |                                   |
// +-----------------------------------+

// +----------------- Les propriétées de chaques pins -----------------+
type PinType = string;
type DataInputPinDetails = {
	type: PinType;
	name: string;
	description: string;
	defaultHardWrittenBareData: string;
	defaultHardWrittenVariableData: string;
};
type DataOutputPinDetails = {
	type: PinType;
	name: string;
	description: string;
};
type ExecutionInputPinDetails = {
	name: string;
	description: string;
};
type ExecutionOutputPinDetails = {
	name: string;
	description: string;
};

// +----------------- LookupTable Des Nodes disponibles -----------------+
type NodeType = {
	title: string;
	description: string;
	executionInputPin: ExecutionInputPinDetails[];
	executionOutputPin: ExecutionOutputPinDetails[];
	inputPin: DataInputPinDetails[];
	outputPin: DataOutputPinDetails[];
	otherProperties: { [key: string]: any };
};
type NodeLookupTable = {
	[key: string]: NodeType;
};

// +----------------- Nodes et Connections Crées + Le Graph -----------------+
type DataInputPin = {
	details: DataInputPinDetails;
	hardWrittenBareData: string;
	hardWrittenVariableData: string;
	DataMode: number; // Dans quel mode est le pin. Modes possibles :
	//                      0: Connection (default) -> Il reçois sa donnée depuis une connection (existante ou non)
	//                      1: Variable -> Il reçoit sa donnée depuis une variable | dans ce cas là, on se réfère à hardWrittenVariableData
	//                      2: Bare -> Sa donnée est hardcodée | dans ce cas là, on se réfère à hardWrittenBareData
};
type VsNode = {
	title: string;
	description: string;
	pos: [
		number,
		number
	],
	executionInputPin: { [key: string]: ExecutionInputPinDetails };
	executionOutputPin: { [key: string]: ExecutionOutputPinDetails };
	inputPin: { [key: string]: DataInputPin };
	outputPin: { [key: string]: DataOutputPinDetails };
	otherProperties: { [key: string]: any };
};
type ExecutionConnection = {
	input: {
		node: string;
		pin: string;
	};
	output: {
		node: string;
		pin: string;
	};
};
type DataConnection = {
	type: PinType;
	input: {
		node: string;
		pin: string;
	};
	output: {
		node: string;
		pin: string;
	};
};
type Graph = {
	nodes: { [key: string]: VsNode };
	dataConnections: { [key: string]: DataConnection };
	executionConnections: { [key: string]: ExecutionConnection };
	zoom: number;
	offset: {
		x: number;
		y: number;
	}
};
type Preferences = {
	zoomSteps: number;
	zoomMin: number;
	zoomMax: number;
	nodeGenerator: Function; // callback that takes the type "NodeType" and returns a string of the html representation of the node.
	pathGenerator: Function; // callback that takes the x1, y1, x2, y2 and returns a string of the html representation of the path.
    technical : {
        uidLength: number;
    }
}

enum ModificationType {
	CREATED = "created",
	UPDATED = "updated",
	DELETED = "deleted",
}

export type {
	PinType,
	DataInputPinDetails,
	DataOutputPinDetails,
	ExecutionInputPinDetails,
	ExecutionOutputPinDetails,
	NodeType,
	NodeLookupTable,
	DataInputPin,
	VsNode,
	ExecutionConnection,
	DataConnection,
	Graph,
	Preferences,
};
export { ModificationType };