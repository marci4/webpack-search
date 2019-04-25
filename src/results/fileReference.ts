import {AssetReference} from "./assetReference";
import {Reason} from "./reason";

export class FileReference {
	public readonly name: string;
	public readonly built: boolean;
	public reasons: Reason[] = [];
	public assets: AssetReference[] = [];
	constructor(name: string, built: boolean) {
		this.name = name;
		this.built = built;
	}
}
