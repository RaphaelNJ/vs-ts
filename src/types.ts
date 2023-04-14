//  +------------------------+
//  |                        |
//  |    Type Definitions    |
//  |                        |
//  +------------------------+

// +----------------- Les propriétées de chaques pins -----------------+
type PinType = string;
type DataInputPinDetails = {
	type: PinType;
	name: string;
	description: string;
	hardWrittenBareData: string;
	hardWrittenVariableData: string;
	DataMode: number; // Dans quel mode est le pin. Modes possibles :
	//                      0: Connection (default) -> Il reçois sa donnée depuis une connection (existante ou non)
	//                      1: Variable -> Il reçoit sa donnée depuis une variable | dans ce cas là, on se réfère à hardWrittenVariableData
	//                      2: Bare -> Sa donnée est hardcodée | dans ce cas là, on se réfère à hardWrittenBareData
};
type DataOutputPinDetails = {
	type: PinType;
	name: string;
	description: string;
};
type ExecutionInputPinDetails = {
	type: PinType;
	name: string;
};
type ExecutionOutputPinDetails = {
	type: PinType;
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
	code: string;
	isClosable: boolean;
	isDraggable: boolean;
	isResizable: boolean;
	isSelectable: boolean;
};
type NodeLookupTable = {
	[key: string]: NodeType;
};

// +----------------- Nodes et Connections Crées + Le Graph -----------------+
type DataInputPin = {
	id: number;
	type: DataInputPinDetails;
};
type DataOutputPin = {
	id: number;
	type: DataOutputPinDetails;
};
type ExecutionInputPin = {
	id: number;
	type: ExecutionInputPinDetails;
};
type ExecutionOutputPin = {
	id: number;
	type: ExecutionOutputPinDetails;
};
type VsNode = {
	id: number;
	title: string;
	description: string;
	code: string;
	isClosable: boolean;
	isDraggable: boolean;
	isResizable: boolean;
	isSelectable: boolean;
	x: number;
	y: number;
	executionInputPin: ExecutionInputPin[];
	executionOutputPin: ExecutionOutputPin[];
	inputPin: DataInputPin[];
	outputPin: DataOutputPin[];
};
type ExecutionConnection = {
	input: ExecutionInputPin;
	output: ExecutionOutputPin;
};
type DataConnection = {
	type: PinType;
	input: DataInputPin;
	output: DataOutputPin;
};
type Graph = {
	nodes: VsNode[];
	dataConnections: DataConnection[];
	executionConnections: ExecutionConnection[];
};

export type {
    PinType,
    DataInputPinDetails,
    DataOutputPinDetails,
    ExecutionInputPinDetails,
    ExecutionOutputPinDetails,
    NodeType,
    NodeLookupTable,
    DataInputPin,
    DataOutputPin,
    ExecutionInputPin,
    ExecutionOutputPin,
    VsNode,
    ExecutionConnection,
    DataConnection,
    Graph
}