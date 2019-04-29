import * as yargs from "yargs";
import {Analyzer} from "./analyzer/analyzer";
import {Configuration} from "./configuration/configuration";
import {Constants} from "./configuration/constants";
import {Exporter} from "./exporter/exporter";

export async function main(argv: string[]) {

	const arg = yargs
		.option(Constants.WORKINGDIRECTORY, {
			demand: true,
			desc: "Please specify the <working directory> of the exporter json.",
			type: "string",
		})
		.option(Constants.RESULT, {
			demand: true,
			desc: "Please specify where to write the json containing the exporter.",
			type: "string",
		})
		.option(Constants.STATS, {
			demand: true,
			desc: "Please specify the path to the statistic json <stats.json>.",
			type: "string",
		})
		.option(Constants.EXTRACTLICENSES, {
			default: true,
			demand: false,
			desc: "Extract all licenses.",
			type: "boolean",
		})
		.option(Constants.PACKAGEOUTPUT, {
			default: null,
			defaultDescription: "<working directory>/packages",
			demand: false,
			desc: "Specific folder where the extracted packages should be exported.",
			type: "string",
		})
		.help();
	let yargsResult = null;
	try {
		yargsResult =  arg.parse((argv).slice(2));
	} catch (err) {
		throw err;
	}
	const config = new Configuration(yargsResult);
	const error = config.isValid();
	if (error === null) {
		const result = Analyzer.analyze(config);
		Exporter.exportResults(config, result);
	} else {
		throw error;
	}
}
