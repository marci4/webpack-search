/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as yargs from "yargs";
import {Analyzer} from "./analyzer/analyzer";
import {Configuration} from "./configuration/configuration";
import {Constants} from "./configuration/constants";
import {Exporter} from "./exporter/exporter";

export async function main(argv: string[]): Promise<void> {

	const arg = yargs
		.option(Constants.WORKINGDIRECTORY, {
			demand: true,
			desc: "Specify the working directory>of the exporter json.",
			type: "string",
		})
		.option(Constants.RESULT, {
			demand: true,
			desc: "Specify where to write the json containing the analyze result.",
			type: "string",
		})
		.option(Constants.STATS, {
			demand: true,
			desc: "Specify the path to the stats json.",
			type: "string",
		})
		.option(Constants.EXTRACTLICENSES, {
			default: true,
			demand: false,
			desc: "Extract all licenses and report them in the result.",
			type: "boolean",
		})
		.option(Constants.PACKAGEOUTPUT, {
			default: null,
			demand: false,
			desc: "Specific folder where the referenced packages should be downloaded to.",
			type: "string",
		})
		.help();
	let yargsResult = null;
	try {
		yargsResult = arg.parse((argv).slice(2));
	} catch (err) {
		return Promise.reject(err);
	}
	const config = new Configuration(yargsResult);
	const error = config.isValid();
	if (error === null) {
		const result = Analyzer.analyze(config);
		Exporter.exportResults(config, result);
	} else {
		return Promise.reject(error);
	}
	return Promise.resolve();
}
