import { Graph, changeGraph } from "../Graph/core/graph";
import { variablesList } from "../Variables/variables_list";
import { loadPopup, deletePopup, loadFunction } from "../main";
import { functionsList, saveCurrentFunction } from "./functions_list";
import { currentFunction } from "./generate_environement";


export function addEventsListeners(): void {
	document.addEventListener("click", onClick);
}
function onClick(event: MouseEvent): void {
	if ((event.target as HTMLElement).classList.contains("fun-delete-btn")) {
		delete functionsList[(event.target as HTMLElement).getAttribute("vs-fun-id") as string];
		document.getElementById("funlist-" + (event.target as HTMLElement).getAttribute("vs-fun-id"))?.remove();
	} else if ((event.target as HTMLElement).classList.contains("fun-create-btn")) {
		loadPopup(
			"Ajouter une fonction",
			`
<p>nom :<input id="createFunctionName" class="function" type="text"></p>
<p>description :<input id="createFunctionDescription" class="function" type="text"></p>
<button class="fun-save-btn">Ajouter</button>
`
		);
	} else if ((event.target as HTMLElement).classList.contains("fun-save-btn")) {
		let funName = (document.getElementById("createFunctionName") as HTMLInputElement).value;

		if (funName == "main") {
			return;
		}
		functionsList[funName] = {
			description: (document.getElementById("createFunctionDescription") as HTMLInputElement).value,
			inputs: [],
			outputs: [],
			Graph: null,
			internalVariables: {},
		};
		let functionTBody = document.getElementById("functionTBody");
		if (functionTBody) {
			document.getElementById("funlist-" + funName)?.remove();
			functionTBody.innerHTML =
				`
            <tr id="funlist-${funName}">
                <td><button vs-fun-id="${funName}" class="fun-open-btn">${funName}</button></td>
				<td><button vs-fun-id="${funName}" class="fun-delete-btn">X</button></td>
			</tr>
            ` + functionTBody.innerHTML;
		}
		deletePopup();
	} else if ((event.target as HTMLElement).classList.contains("fun-open-btn")) {
        let curFunction = functionsList[currentFunction];
        curFunction.Graph = JSON.parse(JSON.stringify(Graph))
        curFunction.internalVariables = variablesList
        saveCurrentFunction(curFunction)
		loadFunction((event.target as HTMLElement).innerHTML);
	}
}
