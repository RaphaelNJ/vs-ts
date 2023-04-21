import { ModificationType } from "../../types";

// +-----------------------------------+
// |                                   |
// |   JSON Proxy                      |
// |                                   |
// +-----------------------------------+

/**
 *
 * @param target The JSON object you want to create a proxy on
 * @param callback the function to call when the JSON is changed
 * @param path do not use
 * @returns the proxy
 *
 * This function return a JSON object exacly the same as the JSON object that was passed in
 * but this one will call the callback function that was passed in whenever a value is changed.
 * The callback will take in 1st parameter the path of the changed property.
 * The 2nd parameter the modification type.
 * And the 3rd parameter is the new value of the property or null if it was deleted.
 */
export function createProxy<T extends object>(target: T, callback: Function, path: string = ""): T {
	return new Proxy(target, {
		get(target: T, property: string | symbol) {
			if (typeof property !== "string") {
				return undefined;
			}
			const value = target[property as keyof T];
			if (typeof value === "object" && value !== null) {
				return createProxy(value as any, callback, `${path}${path ? "." : ""}${property}`) as any;
			}
			return value;
		},
		set(target: T, property: string | symbol, value: any) {
			if (typeof property !== "string") {
				return false;
			}

			const modificationType =
				value === undefined ? ModificationType.DELETED : target.hasOwnProperty(property) ? ModificationType.UPDATED : ModificationType.CREATED;

			if (value === undefined) {
				delete target[property as keyof T];
			} else {
				target[property as keyof T] = value;
			}

			callback(`${path}${path ? "." : ""}${property}`, modificationType, value);
			return true;
		},
		deleteProperty(target: T, property: string | symbol) {
			if (typeof property !== "string") {
				return false;
			}

			const deleted = delete target[property as keyof T];
			if (deleted) {
				callback(`${path}${path ? "." : ""}${property}`, ModificationType.DELETED, null);
			}
			return deleted;
		},
	}) as T;
}
