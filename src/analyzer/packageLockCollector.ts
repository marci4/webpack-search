/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import * as path from "path";
import {Configuration} from "../configuration/configuration";
import {PackageLockInformation} from "../results/packageLockInformation";

export namespace PackageLockCollector {

	export function collectPackageLocks(configuration: Configuration): PackageLockInformation[] {
		const workingDirectory = configuration.workingDirectoryPath;
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
