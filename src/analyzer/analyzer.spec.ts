/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import {Argv} from "yargs";
import {Configuration} from "../configuration/configuration";
import {Constants} from "../configuration/constants";
import {Analyzer} from "./analyzer";
import {LicenseCollector} from "./licenseCollector";
import {PackageCollector} from "./packageCollector";
import {PackageLockCollector} from "./packageLockCollector";

describe("Analyzer", () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});
	const localMock: any = [];
	localMock[Constants.WORKINGDIRECTORY] = "/tmp/home";
	localMock[Constants.STATS] = "/tmp/stats_4-29.json";
	const configuration = new Configuration(localMock as unknown as Argv);
	it("Working directory", () => {
		const mockProcessChdir = jest.spyOn(process, "chdir").mockImplementation();
		const result = Analyzer.analyze(configuration);
		expect(result.errors.length).toEqual(1);
		expect(result.errors[0].message).toEqual("Invalid file: /tmp/stats_4-29.json");
		expect(mockProcessChdir).toBeCalledTimes(1);
		mockProcessChdir.mockRestore();
	});
	it("Working directory", () => {
		const mockProcessChdir = jest.spyOn(process, "chdir").mockImplementation();
		const result = Analyzer.analyze(configuration);
		expect(result.errors.length).toEqual(1);
		expect(result.errors[0].message).toEqual("Invalid file: /tmp/stats_4-29.json");
		expect(mockProcessChdir).toBeCalledTimes(1);
		mockProcessChdir.mockRestore();
	});
	it("Read json no entry", () => {
		const mockProcessChdir = jest.spyOn(process, "chdir").mockImplementation();
		const mockFsReadFileSync = jest.spyOn(fs, "readFileSync").mockImplementation(() => {
			return "{}";
		});
		const result = Analyzer.analyze(configuration);
		expect(result.errors.length).toEqual(0);
		expect(mockProcessChdir).toBeCalledTimes(1);
		expect(mockFsReadFileSync).toBeCalledTimes(1);
		mockProcessChdir.mockRestore();
		mockFsReadFileSync.mockRestore();
	});
	it("Read json", () => {
		const mockProcessChdir = jest.spyOn(process, "chdir").mockImplementation();
		const mockFsReadFileSync = jest.spyOn(fs, "readFileSync").mockImplementation(() => {
			return JSON.stringify({modules: [{name: "test", built: "true"}]});
		});
		const mockPackageCollector = jest.spyOn(PackageCollector, "collectPackages").mockImplementation();
		const mockLicenseCollector = jest.spyOn(LicenseCollector, "collectLicenses").mockImplementation();
		const mockPackageLockCollector = jest.spyOn(PackageLockCollector, "collectPackageLocks").mockImplementation();

		const result = Analyzer.analyze(configuration);
		expect(result.errors.length).toEqual(0);
		expect(mockProcessChdir).toBeCalledTimes(1);
		expect(mockFsReadFileSync).toBeCalledTimes(1);
		mockProcessChdir.mockRestore();
		mockFsReadFileSync.mockRestore();
		mockPackageCollector.mockRestore();
		mockLicenseCollector.mockRestore();
		mockPackageLockCollector.mockRestore();
	});
});
