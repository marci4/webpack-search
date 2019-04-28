import * as fs from "fs";
import {FileReference} from "./fileReference";

export class LicenseInformation {

	public readonly licensePath: string;

	/**
	 * Which files are referenced by this license
	 */
	public readonly fileReferences: FileReference[] = [];
	private licenseContent: string = null;

	public get licenseText(): string {
		return this.licenseContent;
	}

	constructor(licensePath: string, file: FileReference) {
		this.licensePath = licensePath;
		this.fileReferences.push(file);
		this.extractInformation();
	}

	private extractInformation(): void {
		if (this.licensePath !== null) {
			if (fs.existsSync(this.licensePath)) {
				this.licenseContent = fs.readFileSync(this.licensePath, "utf8");
			}
		}
	}
}
