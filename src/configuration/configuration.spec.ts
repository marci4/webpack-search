import {Argv} from "yargs";
import {Configuration} from "./configuration";
import {Constants} from "./constants";

const mock: any = [];
mock[Constants.EXTRACTLICENSES] = true;
mock[Constants.STATS] = "/tmp/stats.json";
mock[Constants.RESULT] = "arg/result.txt";
mock[Constants.WORKINGDIRECTORY] = "/home";
describe("constructor", () => {
	it("Extract from yargs", () => {
		const configuration = new Configuration(mock as unknown as Argv);
		expect(configuration.statsJsonPath).toEqual(mock[Constants.STATS]);
		expect(configuration.resultJsonPath).toEqual(mock[Constants.RESULT]);
		expect(configuration.extractLicenses).toEqual(mock[Constants.EXTRACTLICENSES]);
		expect(configuration.workingDirectoryPath).toEqual(mock[Constants.WORKINGDIRECTORY]);
	});
});
