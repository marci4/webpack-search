import {Assets} from "./assets";
import {Licenses} from "./licenses";

export class Result {
	public errors: Error[];

	public licenses: Licenses;

	public assets: Assets;
}
