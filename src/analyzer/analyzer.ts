/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import {Configuration} from "../configuration/configuration";
import {ErrorMessage} from "../results/errorMessage";
import {Result} from "../results/result";
import {FileCollector} from "./fileCollector";
import {LicenseCollector} from "./licenseCollector";
import {PackageCollector} from "./packageCollector";
import {PackageLockCollector} from "./packageLockCollector";

export namespace Analyzer {

	export function analyze(configuration: Configuration): Result {
		const result = new Result();
		// Update the working directory to fit for the specific stats_4-29.json
		process.chdir(configuration.workingDirectoryPath);
		let json;
		try {
			json = JSON.parse(fs.readFileSync(configuration.statsJsonPath, "utf8"));
		} catch (e) {
			result.errors.push(new ErrorMessage("Invalid file: " + configuration.statsJsonPath));
		}
		if (result.errors.length !== 0) {
			return result;
		}
		const fileCollector = new FileCollector(json);
		if (!fileCollector.filesFound()) {
			return result;
		}
		result.packages = PackageCollector.collectPackages(fileCollector);
		result.licenses = LicenseCollector.collectLicenses(fileCollector);
		result.packageLocks = PackageLockCollector.collectPackageLocks(configuration);
		return result;
	}
}
