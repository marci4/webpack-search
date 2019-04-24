import {AssetReference} from "./assetReference";
import {Reason} from "./reason";

export class FileReference {
	public readonly name: string;
	public readonly built: boolean;
	public reasons: Reason[] = [];
	public assets: AssetReference[] = [];
	public readonly size: number;
	constructor(name: string, built: boolean, size: number) {
		this.name = name;
		this.built = built;
		this.size = size;
	}
}
