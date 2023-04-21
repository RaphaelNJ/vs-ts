import { importedExistingIDs } from "./uid_generator";
import { changeFunctionsList, functionsList } from "./Functions/functions_list";
import { loadFunction } from "./main";

export function saveGraph(): string {
	return btoa(JSON.stringify({
        existingIDs: importedExistingIDs,
		functionsList: functionsList,
    }));
}
export function loadGraph(data: string): void {
	let load = JSON.parse(atob(data));
	Object.assign(importedExistingIDs, load.existingIDs);
	changeFunctionsList(load.functionsList);

	loadFunction("main");
}
