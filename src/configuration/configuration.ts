import * as path from "path";
import {Constants} from "./constants";

export class Configuration {
	public readonly workingDirectoryPath: string;
	public readonly statsJsonPath: string;
	public readonly resultJsonPath: string;
	public readonly extractLicenses: boolean;
	public readonly extractPackages: boolean;
	public readonly packageOutput: string;
	constructor(args: any) {
		this.extractLicenses = args[Constants.EXTRACTLICENSES];
		this.statsJsonPath = args[Constants.STATS];
		this.workingDirectoryPath = args[Constants.WORKINGDIRECTORY];
		this.resultJsonPath = args[Constants.RESULT];
		this.extractPackages = args[Constants.EXTRACTPACKAGES];
		this.packageOutput = args[Constants.PACKAGEOUTPUT];
		if (this.packageOutput === null) {
			this.packageOutput = path.join(this.workingDirectoryPath, "packages");
		} else {
			this.extractPackages = true;
		}
	}
}
