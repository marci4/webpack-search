import {AssetReference} from "./assetReference";
import {Licenses} from "./licenses";
import {Package} from "./package";

export class Result {
	public errors: Error[] = [];

	public packages: Package[] = [];
}
