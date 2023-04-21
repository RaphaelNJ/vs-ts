import { VariablesList } from "../types";
import { initHtml } from "./generate_environement";

export let variablesList: VariablesList = {
	"test" : {type: "array", value : "test"},
	"test2" : {type: "string", value : "test2"},
	"test3" : {type: "boolean", value : "true"},
}

export function changeVariablesList(changedVariablesList: VariablesList): void {
	variablesList = changedVariablesList;
}