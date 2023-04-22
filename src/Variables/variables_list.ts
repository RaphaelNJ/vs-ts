import { VariablesList } from "../types";
import { initHtml } from "./generate_environement";

export let variablesList: VariablesList = {}

export function changeVariablesList(changedVariablesList: VariablesList): void {
	variablesList = changedVariablesList;
}