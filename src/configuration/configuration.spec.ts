import * as path from "path";
import {Argv} from "yargs";
import {Configuration} from "./configuration";
import {Constants} from "./constants";

const mock: any = [];
mock[Constants.EXTRACTLICENSES] = true;
mock[Constants.STATS] = "/tmp/stats.json";
mock[Constants.RESULT] = "arg/exporter.txt";
mock[Constants.WORKINGDIRECTORY] = "/home";
describe("constructor", () => {
	it("Extract from yargs", () => {
		mock[Constants.EXTRACTPACKAGES] = true;
		mock[Constants.PACKAGEOUTPUT] = "/tmp/packages";
		const configuration = new Configuration(mock as unknown as Argv);
		expect(configuration.statsJsonPath).toEqual(mock[Constants.STATS]);
		expect(configuration.resultJsonPath).toEqual(mock[Constants.RESULT]);
		expect(configuration.extractLicenses).toEqual(mock[Constants.EXTRACTLICENSES]);
		expect(configuration.workingDirectoryPath).toEqual(mock[Constants.WORKINGDIRECTORY]);
		expect(configuration.extractPackages).toEqual(mock[Constants.EXTRACTPACKAGES]);
		expect(configuration.packageOutput).toEqual(mock[Constants.PACKAGEOUTPUT]);
	});
	it("Update when extractPackages is effective", () => {
		mock[Constants.EXTRACTPACKAGES] = true;
		mock[Constants.PACKAGEOUTPUT] = null;
		const configuration = new Configuration(mock as unknown as Argv);
		expect(configuration.extractPackages).toEqual(mock[Constants.EXTRACTPACKAGES]);
		expect(configuration.packageOutput).toEqual(path.join(mock[Constants.WORKINGDIRECTORY], "packages"));
	});
	it("Update when packageOutput is provided", () => {
		mock[Constants.EXTRACTPACKAGES] = false;
		mock[Constants.PACKAGEOUTPUT] = "/tmp/packages";
		const configuration = new Configuration(mock as unknown as Argv);
		expect(configuration.extractPackages).toEqual(true);
		expect(configuration.packageOutput).toEqual(mock[Constants.PACKAGEOUTPUT]);
	});
});
