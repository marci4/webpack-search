/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import {Configuration} from "../configuration/configuration";
import {Result} from "../results/result";

export namespace ResultExport {
	export function exportResult(configuration: Configuration, result: Result) {
		if (fs.existsSync(configuration.resultJsonPath)) {
			fs.unlinkSync(configuration.resultJsonPath);
		}
		fs.writeFileSync(configuration.resultJsonPath, JSON.stringify(result, (key, value) => {
			if (key === "reasons") {
				return undefined;
			}
			return value;
		}));
	}
}
