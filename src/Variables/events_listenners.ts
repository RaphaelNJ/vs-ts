import { loadPopup, deletePopup } from "../main";
import { variablesList } from "./variables_list";

export function addEventsListeners(VariableListContainer: HTMLElement): void {
	VariableListContainer.addEventListener("change", onChange);
	document.addEventListener("click", onClick);
}
function onClick(event: MouseEvent): void {
	if ((event.target as HTMLElement).classList.contains("var-delete-btn")) {
		delete variablesList[(event.target as HTMLElement).getAttribute("vs-var-id") as string];
		document.getElementById("varlist-" + (event.target as HTMLElement).getAttribute("vs-var-id"))?.remove();
	} else if ((event.target as HTMLElement).classList.contains("var-create-btn")) {
		loadPopup(
			"Ajouter une variable",
			`
		<input id="createVariableName" class="variables" type="text">
		<select id="createVariableType" >
			<option value="boolean" >Boolean</option>
			<option value="string" >String</option>
			<option value="array" >Array</option>
			<option value="number" >Number</option>
			<option value="object" >Object</option>
		</select>
		<button class="var-save-btn">Ajouter</button>
		`
		);
	} else if ((event.target as HTMLElement).classList.contains("var-save-btn")) {
		let varName = (document.getElementById("createVariableName") as HTMLInputElement).value;
		let varType = (document.getElementById("createVariableType") as HTMLSelectElement).value;
		variablesList[varName] = {
			type: varType,
			value: "",
		};
		deletePopup();
		const variableTBody = document.getElementById("variableTBody");

		if (variableTBody) {
			document.getElementById("varlist-"+varName)?.remove();
			variableTBody.innerHTML = `
<tr id="varlist-${varName}">
<td>${varName}</td>
<td>${varType}</td>
<td>${
varType == "boolean"
? `<input class="variables" vs-var-name="${varName}" type="checkbox" checked>`
: `<input class="variables" vs-var-name="${varName}" type="text" value="">`
}</td>
<td><button vs-var-id="${varName}" class="var-delete-btn ">X</button></td>
</tr>
`+variableTBody.innerHTML;
	}
}
}
function onChange(event: Event): void {
	let varName = (event.target as HTMLElement).getAttribute("vs-var-name") || "";
	if (variablesList[varName]) {
		variablesList[varName].value = (event.target as HTMLInputElement).value;
	}
}
