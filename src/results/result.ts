import {AssetReference} from "./assetReference";
import {Licenses} from "./licenses";
import {PackageInformation} from "./packageInformation";

export class Result {
	public errors: Error[] = [];

	public packages: PackageInformation[] = [];
}
