import * as fs from "fs";
import {Configuration} from "../configuration/configuration";
import {Result} from "../results/result";

export class ResultExport {
	public static exportResult(configuration: Configuration, result: Result) {
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
