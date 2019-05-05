/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import {Configuration} from "../configuration/configuration";
import {Result} from "../results/result";
import {PackageLockExport} from "./packageLockExport";
import {ResultExport} from "./resultExport";

export namespace Exporter {

	export function exportResults(configuration: Configuration, result: Result) {
		if (configuration.packageOutput !== null) {
			PackageLockExport.exportReferencedPackages(configuration, result);
		}
		ResultExport.exportResult(configuration, result);
	}
}
