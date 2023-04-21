import { FunctionsList } from "../types";

export let FunctionsListContainer: HTMLElement;
export let currentFunction: string;

export function initHtml(Container: HTMLElement, functionsList: FunctionsList): HTMLElement {
	FunctionsListContainer = document.createElement("div");
	currentFunction = "main";

	let table = `
	<table>
		<thead>
			<tr>
				<th>Nom</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody id="functionTBody">
	`;

	Object.keys(functionsList).forEach((e) => {
		table += `
		<tr id="funlist-${e}">
				<td><button vs-fun-id="${e}" class="fun-open-btn">${e}</button></td>
				${e == "main" ? "" : `<td><button vs-fun-id="${e}" class="fun-delete-btn">X</button></td>`}
			</tr>`;
	});
	table += `<tr><td colspan="4"><button class="fun-create-btn">+ Add</button></td></tr></tbody></table>`;

	FunctionsListContainer.innerHTML = table;

	Container.innerHTML = "";
    Container.style.overflow = "auto"
    Container.style.height = "100%"
	Container.append(FunctionsListContainer);

	return FunctionsListContainer;
}

export function changeCurrentFunction(changedCurrentFunction: string): void {
	currentFunction = changedCurrentFunction;
}
