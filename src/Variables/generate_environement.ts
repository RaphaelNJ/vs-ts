import { VariablesList } from "../types";

export let VariableListContainer: HTMLElement;

export function initHtml(Container: HTMLElement, variablesList: VariablesList): HTMLElement {
	VariableListContainer = document.createElement("div");

	let table = `
	<table>
		<thead>
			<tr>
				<th>Nom</th>
				<th>Type</th>
				<th>Valeur</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody id="variableTBody">
	`;

	Object.keys(variablesList).forEach((e) => {
		table += `
		<tr id="varlist-${e}">
				<td>${e}</td>
				<td>${variablesList[e].type}</td>
				<td>${
					variablesList[e].type == "boolean"
						? `<input class="variables" vs-var-name="${e}" type="checkbox" ${variablesList[e].value == "true" ? "checked" : ""}>`
						: `<input class="variables" vs-var-name="${e}" type="text" value="${variablesList[e].value}">`
				}</td>
				<td><button vs-var-id="${e}" class="var-delete-btn ">X</button></td>
			</tr>`;
	});
	table += `<tr><td colspan="4"><button class="var-create-btn">+ Add</button></td></tr></tbody></table>`;

	VariableListContainer.innerHTML = table;

	Container.innerHTML = "";
    Container.style.overflow = "auto"
    Container.style.height = "100%"
	Container.append(VariableListContainer);

	return VariableListContainer;
}
