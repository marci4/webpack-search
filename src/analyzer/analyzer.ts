import * as fs from "fs";
import {Configuration} from "../configuration/configuration";
import {Result} from "../results/result";
import {FileCollector} from "./filecollector";
import {PackageCollector} from "./packageCollector";

export class Analyzer {

	public static analyze(configuration: Configuration): Result {
		const result = new Result();
		Analyzer.setWorkingDirectory(configuration, result);
		const json = Analyzer.readStatsJson(configuration, result);
		if (result.errors.length !== 0) {
			return result;
		}
		const fileCollector = new FileCollector(json);
		if (!fileCollector.filesFound()) {
			return result;
		}
		const packages = PackageCollector.collectPackages(fileCollector);
		return result;
	}

	private static setWorkingDirectory(configuration: Configuration, result: Result): void {
		if (!fs.existsSync(configuration.workingDirectoryPath)) {
			result.errors.push(new Error("Invalid working directory: ${configuration.workingDirectoryPath}"));
		}
		// Update the working directory to fit for the specific stats.json
		process.chdir(configuration.workingDirectoryPath);
	}

	private static readStatsJson(configuration: Configuration, result: Result): any {
		let json;
		try {
			json = JSON.parse(fs.readFileSync(configuration.statsJsonPath, "utf8"));
		} catch (e) {
			result.errors.push(new Error("Invalid file: ${file}"));
			return null;
		}
		return json;
	}
}
