import { ModificationType } from "../core/types";

export function onGraphChanged(path: string, modificationType: ModificationType): void {
    console.log(path, modificationType);
}