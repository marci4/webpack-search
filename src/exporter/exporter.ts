import {Configuration} from "../configuration/configuration";
import {Result} from "../results/result";
import {PackageLockExport} from "./packageLockExport";
import {ResultExport} from "./resultExport";

export class Exporter {

	public static exportResults(configuration: Configuration, result: Result) {
		if (configuration.packageOutput !== null) {
			PackageLockExport.exportReferencedPackages(configuration, result);
		}
		ResultExport.exportResult(configuration, result);
	}
}
