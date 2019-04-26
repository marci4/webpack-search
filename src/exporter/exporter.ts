import {Configuration} from "../configuration/configuration";
import {Result} from "../results/result";
import {PackageLockExport} from "./packageLockExport";

export class Exporter {

	public static exportResults(configuration: Configuration, result: Result) {
		if (configuration.extractPackages) {
			PackageLockExport.exportReferencedPackages(configuration, result);
		}
	}
}
