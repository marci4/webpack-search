import * as fs from "fs";
import {Configuration} from "../configuration/configuration";
import {Result} from "../results/result";

export class Writer {

	public static writeResult(configuration: Configuration, result: Result): void {
		const data = Writer.getData(configuration, result);
		fs.writeFileSync(configuration.resultJsonPath, data);
	}

	private static getData(configuration: Configuration, result: Result): string {
		return JSON.stringify(result);
	}
}
