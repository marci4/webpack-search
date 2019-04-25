import {FileReference} from "./fileReference";

export class LicenseInformation {

	public readonly licensePath: string;

	/**
	 * Which files are referenced by this license
	 */
	public readonly fileReference: FileReference[] = [];
}
