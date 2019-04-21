import * as yargs from "yargs";
import {Analyzer} from "./analyzer";
import {Configuration} from "./configuration/configuration";
import {Constants} from "./configuration/constants";

export async function main(argv?: string[]) {

	const arg = yargs
		.option(Constants.WORKINGDIRECTORY, {
			demand: true,
			desc: "Please specify the <working directory> of the result json.",
			type: "string",
		})
		.option(Constants.RESULT, {
			demand: true,
			desc: "Please specify where to write the json containing the result.",
			type: "string",
		})
		.option(Constants.STATS, {
			demand: true,
			desc: "Please specify the path to the statistic json <stats.json>",
			type: "string",
		})
		.option(Constants.EXTRACTLICENSES, {
			default: true,
			demand: "false",
			desc: "Extract all licenses",
			type: "boolean",
		})
		.help();
	try {
		arg.parse((argv || process.argv).slice(2));
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
	const config = new Configuration(arg);
	const result = Analyzer.analyze(config);
}
