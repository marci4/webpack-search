import * as fs from "fs";
import {Constants} from "./constants";

export class Configuration {
	public readonly workingDirectoryPath: string;
	public readonly statsJsonPath: string;
	public readonly resultJsonPath: string;
	public readonly extractLicenses: boolean;
	public readonly packageOutput: string;

	constructor(args: any) {
		this.extractLicenses = args[Constants.EXTRACTLICENSES];
		this.statsJsonPath = args[Constants.STATS];
		this.workingDirectoryPath = args[Constants.WORKINGDIRECTORY];
		this.resultJsonPath = args[Constants.RESULT];
		this.packageOutput = args[Constants.PACKAGEOUTPUT];
	}

	public isValid(): Error | null {
		if (!fs.existsSync(this.statsJsonPath) || fs.lstatSync(this.statsJsonPath).isDirectory()) {
			return Error("Unknown path: Type: " + Constants.STATS + " Path: " + this.statsJsonPath);
		}
		if (fs.existsSync(this.resultJsonPath)  && fs.lstatSync(this.resultJsonPath).isDirectory()) {
			return Error("Unknown path: Type: " + Constants.RESULT + " Path: " + this.resultJsonPath);
		}
		if (!fs.existsSync(this.workingDirectoryPath) || !fs.lstatSync(this.workingDirectoryPath).isDirectory()) {
			return Error("Unknown path: Type: " + Constants.WORKINGDIRECTORY + " Path: " + this.workingDirectoryPath);
		}
		if (this.packageOutput !== null && (fs.existsSync(this.packageOutput) && !fs.lstatSync(this.packageOutput).isDirectory())) {
			return Error("Unknown path: Type: " + Constants.PACKAGEOUTPUT + " Path: " + this.packageOutput);
		}
		return null;
	}
}
