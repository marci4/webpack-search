/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

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
});
