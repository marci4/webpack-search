/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import {Configuration} from "../configuration/configuration";
import {Constants} from "../configuration/constants";
import {Result} from "../results/result";
import {Exporter} from "./exporter";
import {PackageLockExport} from "./packageLockExport";
import {ResultExport} from "./resultExport";

describe("Exporter", () => {
	const mockExportReferencedPackages = jest.spyOn(PackageLockExport, "exportReferencedPackages").mockImplementation(() => {
		//
	});
	const mockExportResult = jest.spyOn(ResultExport, "exportResult").mockImplementation(() => {
		//
	});
	afterAll(() => {
		mockExportResult.mockRestore();
		mockExportReferencedPackages.mockRestore();
	});
	it("exportResults ResultOnly", () => {
		const result = new Result();
		const mock: any = [];
		mock[Constants.EXTRACTLICENSES] = true;
		mock[Constants.STATS] = "/tmp/stats.json";
		mock[Constants.RESULT] = "arg/exporter.txt";
		mock[Constants.WORKINGDIRECTORY] = "/tmp/home";
		mock[Constants.PACKAGEOUTPUT] = null;
		const configuration = new Configuration(mock);
		mockExportReferencedPackages.mockClear();
		mockExportResult.mockClear();
		Exporter.exportResults(configuration, result);
		expect(mockExportReferencedPackages).toHaveBeenCalledTimes(0);
		expect(mockExportResult).toHaveBeenCalledTimes(1);
	});

	it("exportResults Include Package Reference", () => {
		const result = new Result();
		const mock: any = [];
		mock[Constants.EXTRACTLICENSES] = true;
		mock[Constants.STATS] = "/tmp/stats.json";
		mock[Constants.RESULT] = "arg/exporter.txt";
		mock[Constants.WORKINGDIRECTORY] = "/tmp/home";
		mock[Constants.PACKAGEOUTPUT] = "/tmp/packagepath";
		const configuration = new Configuration(mock);
		mockExportReferencedPackages.mockClear();
		mockExportResult.mockClear();
		Exporter.exportResults(configuration, result);
		expect(mockExportReferencedPackages).toHaveBeenCalledTimes(1);
		expect(mockExportResult).toHaveBeenCalledTimes(1);
	});
});
