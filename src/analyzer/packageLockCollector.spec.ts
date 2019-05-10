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
import {PackageLockCollector} from "./packageLockCollector";

describe("PackageLockCollector", () => {
	const localMock: any = [];
	localMock[Constants.WORKINGDIRECTORY] = "/tmp/home";
	const configuration = new Configuration(localMock as unknown as Argv);
	it("Empty working directory", () => {
		const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
			return false;
		});
		expect(PackageLockCollector.collectPackageLocks(configuration).length).toEqual(0);
		expect(mockFsExists).toBeCalledTimes(1);
		mockFsExists.mockRestore();
	});
	it("No package-lock.json", () => {
		const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation((tempPath) => {
			return tempPath === "/tmp/home";
		});
		const mockFsLstatSync = jest.spyOn(fs, "lstatSync").mockImplementation(() => {
			return {isDirectory() { return true; }} as fs.Stats;
		});
		expect(PackageLockCollector.collectPackageLocks(configuration).length).toEqual(0);
		expect(mockFsExists).toBeCalledTimes(2);
		expect(mockFsLstatSync).toBeCalledTimes(1);
		mockFsExists.mockRestore();
		mockFsLstatSync.mockRestore();
	});
	it("Extract package-lock-json", () => {
		const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
			return true;
		});
		const mockFsLstatSync = jest.spyOn(fs, "lstatSync").mockImplementation(() => {
			return {isDirectory() { return true; }} as fs.Stats;
		});
		const mockReadFileSync = jest.spyOn(fs, "readFileSync").mockImplementation(() => {
			return "{\"name\": \"test\",\"requires\": true,\"lockfileVersion\": 1,\"dependencies\": {\"test1\": {\"version\": \"7.0.0\",\"resolved\": \"https://registry.npmjs.org/test1/-/test1-7.0.0.tgz\"},\"test0\": {\"version\": \"0.0.7\",\"resolved\": \"https://registry.npmjs.org/test0/-/test0-0.0.7.tgz\"},\"test2\": {\"version\": \"1.3.3.7\",\"resolved\": \"https://registry.npmjs.org/test2/-/test2-1.3.3.7.tgz\"}}}";
		});
		const packageInformation =  PackageLockCollector.collectPackageLocks(configuration);
		expect(packageInformation.length).toEqual(3);
		expect(packageInformation[0].name).toEqual("test1");
		expect(packageInformation[0].version).toEqual("7.0.0");
		expect(packageInformation[0].resolvedPath).toEqual("https://registry.npmjs.org/test1/-/test1-7.0.0.tgz");
		expect(mockFsExists).toBeCalledTimes(2);
		expect(mockFsLstatSync).toBeCalledTimes(1);
		expect(mockReadFileSync).toBeCalledTimes(1);
		mockFsExists.mockRestore();
		mockFsLstatSync.mockRestore();
		mockReadFileSync.mockRestore();
	});
});
