document.addEventListener("mousedown", () => {
	try {
		document.getElementById("ContextMenu").remove();
	} catch {}
});

export function ContextMenu(params) {
	let input = params;
	let arrengement = params.arrengement;
	let elements = params.elements;
	let template = SetTemplate(params.template);
	let embedVariables = params.embedVariables;
	let cssCodes = params.cssCodes;
	let CallBack = params.CallBack;

	if (CallBack === undefined) {
		CallBack = (e) => {};
	}

	if (cssCodes === undefined) {
		cssCodes = {};
	}
	if (cssCodes.codes === undefined) {
		cssCodes.codes = {};
	}
	if (cssCodes.defaultCode === undefined) {
		cssCodes.defaultCode = "";
	}
	let MenuBody = htmlToElem(ReplaceCode(template.html.body, { options: "<div class='CMJS:Options'></div>" }));

	let menuOptions = GenerateMenuOptions({ arrengement, template, elements, embedVariables }, CallBack, input);
	var menuSource = document.createElement("div");
	menuSource.style.position = "absolute";
	menuSource.style.display = "inline-flex";
	menuSource.style.transform = `translate(${params.x}px, ${params.y}px)`;
    menuSource.style.top = "0";
    menuSource.style.left = "0";
	menuSource.id = "ContextMenu";
	menuSource.appendChild(menuOptions);

	document.getElementsByTagName("html")[0].appendChild(menuSource);

	var style = document.createElement("style");
	style.innerHTML = ReplaceCode(template.css, cssCodes.codes, cssCodes.defaultCode);
	menuSource.appendChild(style);
	style.innerHTML += `.ContextMenuMenu{display:flex;flex-direction:column;position:relative}.content{width:100%}.ret{left:${
		document.getElementById("ContextMenu").children[0].offsetWidth + template.xOffset
	}px;position:absolute;display:none}.ret:hover{display:block}.options{display:inline-flex}.options:hover > *{display:block}`;
}

function GenerateMenuOptions(params, CallBack, input) {
	let arrengement = params.arrengement;
	let template = params.template;
	let embedVariables = params.embedVariables;
	let elements = params.elements;
	let node = params.node;

	if (node === undefined) {
		node = htmlToElem(ReplaceCode(template.html.body, { options: "<div class='CMJS:Options'></div>" }));
		node.classList.add("ContextMenuMenu");
	}
	let Options = node.getElementsByClassName("CMJS:Options")[0];

	arrengement.forEach((elt) => {
		var option = document.createElement("div");
		option.className = "options";
		var content = document.createElement("div");
		content.className = "content";

		if (typeof elt === "string") {
			let type = "";
			if (elements[elt].type !== undefined) {
				type = template.html[elements[elt].type];
			} else {
				type = template.html.custom[elements[elt].customType];
			}

			let elemCodes = makeEmbedVariable(embedVariables, elements[elt].codes);
			content.appendChild(htmlToElem(ReplaceCode(type, elemCodes, elements[elt].defaultCode)));
			option.appendChild(content);

			option.addEventListener("mousedown", (MouseEvent) => {
				CallBack({ isContainer: false, elt, input, MouseEvent });
			});

			Options.parentNode.appendChild(option);
		} else {
			var ret = document.createElement("div");
			ret.className = "ret";

			let elemCodes = makeEmbedVariable(embedVariables, elt.codes);
			content.appendChild(htmlToElem(ReplaceCode(template.html.container, elt.codes, elt.defaultCode)));
			ret.appendChild(GenerateMenuOptions({ arrengement: elt.options, template, embedVariables, elements }, CallBack, input));
			option.appendChild(content);
			option.appendChild(ret);

			option.addEventListener("mousedown", (MouseEvent) => {
				CallBack({ isContainer: true, elt, input, MouseEvent });
			});

			Options.parentNode.appendChild(option);
		}
	});
	Options.remove();
	return node;
}

function makeEmbedVariable(embedVariables, elements) {
	let elemCodes = {};

	for (const key in embedVariables) {
		if (embedVariables.hasOwnProperty(key)) {
			for (const variable in elements) {
				if (elements.hasOwnProperty(variable)) {
					if (key === variable) {
						elemCodes[variable] = ReplaceCode(embedVariables[key], { Variable: elements[variable] });
					} else {
						elemCodes[variable] = elements[variable];
					}
				}
			}
		}
	}
	return elemCodes;
}

function SetTemplate(template) {
	if (template !== undefined) {
		if (template.html !== undefined && template.xOffset !== undefined) {
			if (template.html.body !== undefined && template.html.element !== undefined && template.html.container !== undefined) {
				return template;
			}
		}
	}
	return {
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
	};
}

function ReplaceCode(text, codes, defaultCode) {
	let out = "";
	text.split("!{=").forEach((e, j) => {
		let string = e.split("{=")[0];
		e.split("{=").forEach((elt, i) => {
			if (i !== 0) {
				if (codes[elt.split("=}")[0].trim().split("|")[0]] !== undefined) {
					string += codes[elt.split("=}")[0].trim().split("|")[0]] + elt.split("=}").slice(1).join("=}");
				} else {
					if (elt.split("=}")[0].trim().split("|")[1] !== undefined) {
						string += elt.split("=}")[0].trim().split("|")[1] + elt.split("=}").slice(1).join("=}");
					} else {
						string += defaultCode + elt.split("=}").slice(1).join("=}");
					}
				}
			}
		});
		if (j === 0) {
			out += string;
		} else {
			out += "{=" + string;
		}
	});
	return out;
}

function htmlToElem(html) {
	let temp = document.createElement("template");
	html = html.trim();
	temp.innerHTML = html;
	return temp.content.firstChild;
}


// type CMElements = {
// 	[key: string]: {
// 		type: string;
// 		defaultCode: string;
// 		codes: {
// 			[key: string]: string;
// 		};
// 	};
// };
// type CMArrengement = [string | { defaultCode: string; codes: { [key: string]: string }; options: [CMArrengement] }];
// type CMTemplate = {
// 	Dark: {
// 		xOffset: number;
// 		html: {
// 			body: string;
// 			element: string;
// 			container: string;
// 			custom: {
// 				[key: string]: string;
// 			};
// 		};
// 		css: string;
// 	};
// };
// type CMEmbedVariables = {
// 	[key: string]: string;
// };
// type CMCallBackParameter = {
// 	isContainer: boolean;
// 	elt: any;
// 	input: ContextMenu;
// 	MouseEvent: MouseEvent;
// };
// type ContextMenu = {
// 	elements: CMElements;
// 	arrengement: CMArrengement;
// 	template: CMTemplate;
// 	embedVariables: CMEmbedVariables;
// 	x: number;
// 	y: number;
// 	cssCodes: {
// 		[key: string]: any;
// 	};
// 	CallBack: (arg: CMCallBackParameter) => void;
// };
