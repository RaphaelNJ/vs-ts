export let existingIDs: string[] = [];
export let importedExistingIDs: string[] = [];

export function makeID(length: number): string {
	let result = "";
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

export function generateUID(): string {
	let ID = makeID(7);
	while (existingIDs.includes(ID)) {
		ID = makeID(7);
	}
	existingIDs.push(ID);
	return ID;
}
export function removeUID(id: string): void {
	existingIDs = existingIDs.filter((i) => i !== id);
}
export function checkUID(id: string): boolean {
	return existingIDs.includes(id);
}
