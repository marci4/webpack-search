import {Argv} from "yargs";
import {Constants} from "./constants";

export class Configuration {
	public readonly workingDirectoryPath: string;
	public readonly statsJsonPath: string;
	public readonly resultJsonPath: string;
	public readonly extractLicenses: boolean = true;
	constructor(args: any) {
		this.extractLicenses = args[Constants.EXTRACTLICENSES];
		this.statsJsonPath = args[Constants.STATS];
		this.workingDirectoryPath = args[Constants.WORKINGDIRECTORY];
		this.resultJsonPath = args[Constants.RESULT];
	}
}
