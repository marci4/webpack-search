import * as fs from "fs";
import * as path from "path";
import {Configuration} from "../configuration/configuration";
import {PackageLockInformation} from "../results/packageLockInformation";

export class PackageLockCollector {

	public static collectPackageLocks(configuration: Configuration): PackageLockInformation[] {
		return this.extractPackageLockInfos(configuration.workingDirectoryPath);
	}

	private static extractPackageLockInfos(workingDirectory: string): PackageLockInformation[] {
		const result: PackageLockInformation[] = [];
		if (fs.existsSync(workingDirectory)) {
			if (fs.lstatSync(workingDirectory).isDirectory()) {
				const packagePath = path.join(workingDirectory, "package-lock.json");
				if (fs.existsSync(packagePath)) {
					const json = JSON.parse(fs.readFileSync(packagePath, "utf8"));
					const dependencyKeys = Object.keys(json.dependencies);
					for (const dependencyKey of dependencyKeys) {
						const dependency = json.dependencies[dependencyKey];
						result.push(new PackageLockInformation(dependencyKey, dependency.version, dependency.resolved));
					}
				}
			}
		}
		return result;
	}
}
