import {Constants} from "./constants";

describe("Values", () => {
	it("Extract Licenses", () => {
		expect(Constants.EXTRACTLICENSES).toEqual("extractLicenses");
	});
	it("Working Directory", () => {
		expect(Constants.WORKINGDIRECTORY).toEqual("workingDirectory");
	});
	it("Result", () => {
		expect(Constants.RESULT).toEqual("result");
	});
	it("Stat", () => {
		expect(Constants.STATS).toEqual("stats");
	});
	it("Eackage Output", () => {
		expect(Constants.PACKAGEOUTPUT).toEqual("packageOutput");
	});
	it("Extract Packackges", () => {
		expect(Constants.EXTRACTPACKAGES).toEqual("extractPackackges");
	});
});
