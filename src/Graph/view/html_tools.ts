/**
* Returns an array of all the parent HTMLElements for the given HTMLElement.
* @param {HTMLElement} a The HTMLElement to get the parents for.
* @returns {HTMLElement[]} An array of parent HTMLElements, including the initial HTMLElement.
*/
export function getParents(a: HTMLElement): HTMLElement[] {
	var els = [];
	els.push(a);
	while (true) {
		els.push(a);
		if (a.parentNode) {
			a = a.parentNode as HTMLElement;
		}
		if (a.tagName == "BODY") {
			break;
		}
	}
	return els;
}
/**
 * Verifies if an HTML element is a child of a parent element with a specific attribute.
 * @param {HTMLElement} a - The HTML element to check.
 * @param {string} b - The name of the attribute to search for.
 * @returns {string | null} The value of the attribute if found, or null otherwise.
 */
export function verifIfISChildOfAProperty(a: HTMLElement, b: string): string | null {
	let parents = getParents(a);
	for (let i = 0; i < parents.length; i++) {
		if (parents[i].getAttribute(b) != null) {
			return parents[i].getAttribute(b);
		}
	}
	return null;
}

export function getIdOfParentWithProperty(a: HTMLElement, b: string, c: string): string | null {
	let parents = getParents(a);
	for (let i = 0; i < parents.length; i++) {
		if (parents[i].getAttribute(b) == c) {
			return parents[i].id;
		}
	}
	return null;
}
