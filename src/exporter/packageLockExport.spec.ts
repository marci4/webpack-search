/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import * as path from "path";
import {Argv} from "yargs";
import {Configuration} from "../configuration/configuration";
import {Constants} from "../configuration/constants";
import {Author} from "../results/author";
import {ErrorMessage} from "../results/errorMessage";
import {PackageInformation} from "../results/packageInformation";
import {PackageLockInformation} from "../results/packageLockInformation";
import {Result} from "../results/result";
import {PackageLockExport} from "./packageLockExport";

describe("PackageLockExport", () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});
	describe("exportReferencedPackages", () => {
		let mockMkdirSync: any;
		let mockFsUnlink: any;
		let mockPathJoin: any;
		let mockPathBasename: any;
		beforeEach(() => {
			jest.restoreAllMocks();
			mockMkdirSync = jest.spyOn(fs, "mkdirSync").mockImplementation(() => {
				// Empty
			});
			mockFsUnlink = jest.spyOn(fs, "unlinkSync").mockImplementation(() => {
				//
			});
			mockPathJoin = jest.spyOn(path, "join").mockImplementation((...paths: string[]) => {
				let pathJoinResult = "";
				for (const pathEntry of paths) {
					pathJoinResult += pathEntry;
				}
				return pathJoinResult;
			});
			mockPathBasename = jest.spyOn(path, "basename").mockImplementation((tempPath) => {
				return tempPath;
			});

		});
		afterEach(() => {
			mockFsUnlink.mockRestore();
			mockMkdirSync.mockRestore();
			mockPathJoin.mockRestore();
			mockPathBasename.mockRestore();
		});
		it("Create export folder", () => {
			const localMock: any = [];
			localMock[Constants.WORKINGDIRECTORY] = "/tmp/home";
			const configuration = new Configuration(localMock as unknown as Argv);
			const result = new Result();
			const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
				return false;
			});
			mockFsExists.mockClear();
			mockMkdirSync.mockClear();
			mockFsUnlink.mockClear();
			PackageLockExport.exportReferencedPackages(configuration, result);
			expect(mockFsExists).toHaveBeenCalledTimes(1);
			expect(mockMkdirSync).toHaveBeenCalledTimes(1);
			expect(mockFsUnlink).toHaveBeenCalledTimes(0);
			mockFsExists.mockRestore();
		});
		it("Clear existing folder", () => {
			const localMock: any = [];
			localMock[Constants.WORKINGDIRECTORY] = "/tmp/home";
			const configuration = new Configuration(localMock as unknown as Argv);
			const result = new Result();
			const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
				return true;
			});
			const mockReaddirSync = jest.spyOn(fs, "readdirSync").mockImplementation(() => {
				return [{name: "tmp/result"}, {name: "tmp/result2"}] as fs.Dirent[];
			});
			mockFsExists.mockClear();
			mockFsUnlink.mockClear();
			mockMkdirSync.mockClear();
			mockReaddirSync.mockClear();
			mockPathJoin.mockClear();
			PackageLockExport.exportReferencedPackages(configuration, result);
			expect(mockFsExists).toHaveBeenCalledTimes(1);
			expect(mockMkdirSync).toHaveBeenCalledTimes(0);
			expect(mockPathJoin).toHaveBeenCalledTimes(2);
			expect(mockFsUnlink).toHaveBeenCalledTimes(2);
			expect(mockReaddirSync).toHaveBeenCalledTimes(1);
			mockFsExists.mockRestore();
			mockReaddirSync.mockRestore();
		});
		it("Check for wrong package information", () => {
			const localMock: any = [];
			localMock[Constants.PACKAGEOUTPUT] = "/tmp/home";
			const configuration = new Configuration(localMock as unknown as Argv);
			const result = new Result();
			result.packages.push(new PackageInformation(null, null, null, null, null));
			const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
				return false;
			});
			mockFsExists.mockClear();
			mockMkdirSync.mockClear();
			mockFsUnlink.mockClear();
			PackageLockExport.exportReferencedPackages(configuration, result);
			expect(mockFsExists).toHaveBeenCalledTimes(1);
			expect(mockMkdirSync).toHaveBeenCalledTimes(1);
			expect(mockFsUnlink).toHaveBeenCalledTimes(0);
			expect(result.errors.length).toEqual(1);
			expect(result.errors[0].message).toEqual("Referenced package is null. Name: null Version: null");
			mockFsExists.mockRestore();
		});
		it("Check for unknown package reference", () => {
			const localMock: any = [];
			localMock[Constants.PACKAGEOUTPUT] = "/tmp/home";
			const configuration = new Configuration(localMock as unknown as Argv);
			const result = new Result();
			result.packages.push(new PackageInformation("Package0", "1.1.0.0", "BEERWARE", Author.parse("marci4"), "/path/package0"));
			const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
				return false;
			});
			mockFsExists.mockClear();
			mockMkdirSync.mockClear();
			mockFsUnlink.mockClear();
			PackageLockExport.exportReferencedPackages(configuration, result);
			expect(mockFsExists).toHaveBeenCalledTimes(1);
			expect(mockMkdirSync).toHaveBeenCalledTimes(1);
			expect(mockFsUnlink).toHaveBeenCalledTimes(0);
			expect(result.errors.length).toEqual(1);
			expect(result.errors[0].message).toEqual("Could not find the referenced package in the package-lock.json. Name: Package0 Version: 1.1.0.0");
			mockFsExists.mockRestore();
		});
		it("Handle error during download", () => {
			const localMock: any = [];
			localMock[Constants.PACKAGEOUTPUT] = "/tmp/home";
			const configuration = new Configuration(localMock as unknown as Argv);
			const result = new Result();
			result.packages.push(new PackageInformation("Package0", "1.1.0.0", "BEERWARE", Author.parse("marci4"), "/path/package0"));
			result.packageLocks.push(new PackageLockInformation("Package0", "1.1.0.0", "http://localhost:1337"));
			const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
				return false;
			});
			const mockDownloadFile = jest.spyOn(PackageLockExport, "downloadFile").mockImplementation((url: string, dest: string, callback: (error: ErrorMessage) => void) => {
				callback(new ErrorMessage("Error during download: " + url + " " + dest));
			});
			mockFsExists.mockClear();
			mockMkdirSync.mockClear();
			mockFsUnlink.mockClear();
			mockDownloadFile.mockClear();
			mockPathBasename.mockClear();
			mockPathJoin.mockClear();
			PackageLockExport.exportReferencedPackages(configuration, result);
			expect(mockFsExists).toHaveBeenCalledTimes(1);
			expect(mockMkdirSync).toHaveBeenCalledTimes(1);
			expect(mockFsUnlink).toHaveBeenCalledTimes(0);
			expect(mockDownloadFile).toHaveBeenCalledTimes(1);
			expect(mockPathBasename).toHaveBeenCalledTimes(1);
			expect(mockPathJoin).toHaveBeenCalledTimes(1);
			expect(result.errors.length).toEqual(1);
			expect(result.errors[0].message).toEqual("Error during download: http://localhost:1337 /tmp/homehttp://localhost:1337");
			mockFsExists.mockRestore();
			mockDownloadFile.mockRestore();
		});
		it("Handle normal download", () => {
			const localMock: any = [];
			localMock[Constants.PACKAGEOUTPUT] = "/tmp/home";
			const configuration = new Configuration(localMock as unknown as Argv);
			const result = new Result();
			result.packages.push(new PackageInformation("Package0", "1.1.0.0", "BEERWARE", Author.parse("marci4"), "/path/package0"));
			result.packageLocks.push(new PackageLockInformation("Package0", "1.1.0.0", "http://localhost:1337"));
			const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
				return false;
			});
			const mockDownloadFile = jest.spyOn(PackageLockExport, "downloadFile").mockImplementation(() => {
				return true;
			});
			mockFsExists.mockClear();
			mockMkdirSync.mockClear();
			mockFsUnlink.mockClear();
			mockDownloadFile.mockClear();
			mockPathBasename.mockClear();
			mockPathJoin.mockClear();
			PackageLockExport.exportReferencedPackages(configuration, result);
			expect(mockFsExists).toHaveBeenCalledTimes(1);
			expect(mockMkdirSync).toHaveBeenCalledTimes(1);
			expect(mockFsUnlink).toHaveBeenCalledTimes(0);
			expect(mockDownloadFile).toHaveBeenCalledTimes(1);
			expect(mockPathBasename).toHaveBeenCalledTimes(1);
			expect(mockPathJoin).toHaveBeenCalledTimes(1);
			expect(result.errors.length).toEqual(0);
			mockFsExists.mockRestore();
			mockDownloadFile.mockRestore();
		});
	});
});
