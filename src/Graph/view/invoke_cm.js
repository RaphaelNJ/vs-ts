import { ContextMenu } from "./context_menu"; // Modification ici

let DefaultsCM = {
	OsWindows: {
		xOffset: -4,
		html: {
			body: `<div class="menu">{= options =}</div>`,
			element: `<div class="container" {= containerParams| =}><div class="menu-option" {= menu-optionParams| =}><div class="menu-image" {= menu-imageParams| =}>{= imgSrc =}</div><div class="menu-content" {= menu-contentParams| =}><div class="menu-prefix" {= menu-prefixParams| =}>{= text =}</div><div class="menu-suffix" {= menu-suffixParams| =}>{= suffix =}</div></div></div>`,
			container: `<div class="container" {= containerParams| =}><div class="menu-option" {= menu-optionParams| =}><div class="menu-image" {= menu-imageParams| =}>{= imgSrc =}</div><div class="menu-content" {= menu-contentParams| =}><div class="menu-prefix" {= menu-prefixParams| =}>{= text =}</div><div class="menu-suffix" {= menu-suffixParams| =}>{= suffix =}</div></div></div>`,
			custom: {
				separator: `<hr>`,
			},
		},
		css: "hr{border: 1px solid grey; border-radius: 5px; margin: 2px 3px}.menu{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f5f5f5;box-shadow:2px 2px 1px rgba(0,0,0,0.2);border:1px gray solid;cursor:default;width:230px;-webkit-user-select:none;-webkit-touch-callout:none;-moz-user-select:none;-ms-user-select:none;user-select:none;animation-name:opacityOn;animation-duration:100ms;opacity:1;padding:3px 1px}.container{list-style:none;padding:1px}.menu-option{display:inline-flex;align-items:center;width:100%}.menu-suffix{margin-right:5px}.menu-content{display:inline-flex;justify-content:space-between;margin-left:3px;width:100%}.menu-image{width:1.1rem;height:1.1rem;margin:0 3px;border:none}.container:hover{background:rgba(0,0,0,0.2)}@keyframes opacityOn{from{opacity:0}to{opacity:1}}",
	},
	OsApple: {
		xOffset: 0,
		html: {
			body: `<div class="menu">{= options =}</div>`,
			element: `<div class="container" {= containerParams| =}>{= text =}</div>`,
			container: `<div class="container" {= containerParams| =}><div class="menu-option" {= menu-optionParams| =}><div class="menu-content" {= menu-contentParams| =}><div class="menu-prefix" {= menu-prefixParams| =}>{= text =}</div><div class="menu-suffix" {= menu-suffixParams| =}>{= suffix =}</div></div></div></div>`,
			custom: {
				separator: `<hr>`,
			},
		},
		css: "",
	},
	MsEdge: {},
	Chrome: {},
	Firefox: {},
	Dark: {
		xOffset: -1,
		html: {
			body: `<div class="menu">{= options =}</div>`,
			element: `<div class="container" {= containerParams| =}>{= text =}</div>`,
			container: `<div class="container" {= containerParams| =}><div class="menu-option" {= menu-optionParams| =}><div class="menu-content" {= menu-contentParams| =}><div class="menu-prefix" {= menu-prefixParams| =}>{= text =}</div><div class="menu-suffix" {= menu-suffixParams| =}>{= suffix =}</div></div></div></div>`,
			custom: {
				separator: `<hr>`,
			},
		},
		css: ".menu{font-family:{= fontFamily|Arial,Helvetica,sans-serif =};background-color:#000;border-bottom:1px #000 solid;cursor:default;width:200px;color:#d6d6d6;-webkit-user-select:none;-webkit-touch-callout:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.container{background-color:#252525;list-style:none;padding:5px 1px;padding-left:5px;margin:1px;margin-bottom:0}.menu-option{display:inline-flex;align-items:center;width:100%}.menu-suffix{margin-right:5px;color:green}.menu-content{display:inline-flex;justify-content:space-between;width:100%}.menu-image{width:1.1rem;height:1.1rem;margin:0 3px;border:none}.container:hover{background-color:#2f2f2f}hr{border:none;margin:0;margin-bottom:1px}",
	},
};

let template = DefaultsCM.Dark;

let embedVariables = {
	imgSrc: '<img class="menu-image" src="{= Variable =}">',
};

let elements = {
	Enter: {
		type: "element",
		defaultCode: "",
		codes: {
			text: "Enter Node",
		},
	},
	Test: {
		type: "element",
		defaultCode: "",
		codes: {
			text: "Test Node",
		},
	},
	Container: {
		type: "element",
		defaultCode: "",
		codes: {
			text: "Container",
		},
	},
	Say: {
		type: "element",
		defaultCode: "",
		codes: {
			text: "Say",
		},
	},
	Ask: {
		type: "element",
		defaultCode: "",
		codes: {
			text: "Ask",
		},
	},
	sameString: {
		type: "element",
		defaultCode: "",
		codes: {
			text: "sameString",
		},
	},
	IfElse: {
		type: "element",
		defaultCode: "",
		codes: {
			text: "IfElse",
		},
	},
	SetStringVar: {
		type: "element",
		defaultCode: "",
		codes: {
			text: "SetStringVar",
		},
	},
	AddStrings: {
		type: "element",
		defaultCode: "",
		codes: {
			text: "AddStrings",
		},
	}
};

let arrengement = [
	"Test",
	"Container",
	"Say",
	"Ask",
	"sameString",
	"IfElse",
	"SetStringVar",
	"AddStrings",
	{
		defaultCode: "",
		codes: {
			text: "Functions",
			suffix: ">",
		},
		options: [],
	},
];

export function addFunctionToCM(Name) {
	elements[Name] = {
		type: "element",
		defaultCode: "",
		codes: {
			text: Name,
		},
	};
	arrengement[8].options.forEach((e, i) => {
		if (e == Name) {
			delete arrengement[8].options[i];
		}
	});
	arrengement[8].options.push(Name);
}

export function invokeCM(x, y, cb) {
	ContextMenu({
		elements: elements,
		arrengement: arrengement,
		template: template,
		embedVariables: embedVariables,
		x,
		y,
		cssCodes: {
			codes: {
				fontFamily: "'Courier New', Courier, monospace",
			},
		},
		CallBack: (out) => {
			cb(out);
		},
	});
}
