/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import {PathLike} from "fs";
import * as path from "path";
import {FileReference} from "../results/fileReference";
import {Files} from "../results/files";
import {LicenseInformation} from "../results/licenseInformation";
import {FolderRunner} from "../utils/folderRunner";
import {FileCollector} from "./fileCollector";
import {LicenseCollector} from "./licenseCollector";

describe("LicenseCollector", () => {
	describe("collectLicenses", () => {
		it("Check with empty modules", () => {
			const fileCollector = {files: new Files()} as FileCollector;
			expect(LicenseCollector.collectLicenses(fileCollector).length).toEqual(0);
		});
		it("Check with modules", () => {
			const fileCollector = {files: new Files()} as FileCollector;
			fileCollector.files.modules.push(new FileReference("/tmp/testfile0", false));
			fileCollector.files.modules.push(new FileReference("/tmp/testfile1", false));
			const mockCheckFileReference = jest.spyOn(LicenseCollector, "checkFileReference").mockImplementation();
			expect(LicenseCollector.collectLicenses(fileCollector).length).toEqual(0);
			expect(mockCheckFileReference).toBeCalledTimes(2);
			mockCheckFileReference.mockRestore();
		});
	});
	describe("checkFileReference", () => {
		it("LicenseInfo is null", () => {
			const mockCheckFolder = jest.spyOn(FolderRunner, "checkFolder").mockImplementation((file, currentFilePath, callback: (currentFolder: string) => {}) => {
				const tempFile = file;
				const currentFile = currentFilePath;
				callback("/tmp");
				return false;
			});
			const mockExtractPackageInfo = jest.spyOn(LicenseCollector, "checkFileReference").mockImplementation(() => {
				return null;
			});
			const licenseData: LicenseInformation[] = [];
			const fileReference = new FileReference("/tmp/test0", false);
			LicenseCollector.checkFileReference(fileReference, fileReference.name, licenseData);
			expect(mockCheckFolder).toHaveBeenCalledTimes(0);
			expect(mockExtractPackageInfo).toHaveBeenCalledTimes(1);
			mockCheckFolder.mockRestore();
			mockExtractPackageInfo.mockRestore();
		});
		it("Normal license not existing", () => {
			const mockCheckFolder = jest.spyOn(FolderRunner, "checkFolder").mockImplementation((file, currentFilePath, callback: (currentFolder: string) => {}) => {
				const tempFile = file;
				const currentFile = currentFilePath;
				callback("/tmp");
				return false;
			});
			const mockExtractPackageInfo = jest.spyOn(LicenseCollector, "checkForAdditionalLicenses").mockImplementation(() => {
				return ["\\tmp\\reLICENSE.md", "\\tmp\\aaaalicenceREADME", "\\tmp\\teLiSenSekd" ];
			});
			const licenseData: LicenseInformation[] = [];
			const fileReference = new FileReference("/tmp/test0", false);
			LicenseCollector.checkFileReference(fileReference, fileReference.name, licenseData);
			expect(mockCheckFolder).toHaveBeenCalledTimes(1);
			expect(mockExtractPackageInfo).toHaveBeenCalledTimes(1);
			mockCheckFolder.mockRestore();
			mockExtractPackageInfo.mockRestore();
		});
		it("Normal license existing", () => {
			const mockCheckFolder = jest.spyOn(FolderRunner, "checkFolder").mockImplementation((file, currentFilePath, callback: (currentFolder: string) => {}) => {
				const tempFile = file;
				const currentFile = currentFilePath;
				callback("/tmp");
				return false;
			});
			const mockExtractPackageInfo = jest.spyOn(LicenseCollector, "checkForAdditionalLicenses").mockImplementation(() => {
				return ["\\tmp\\reLICENSE.md", "\\tmp\\aaaalicenceREADME", "\\tmp\\teLiSenSekd" ];
			});
			const licenseData: LicenseInformation[] = [];
			const fileReference0 = new FileReference("/tmp/testreference", false);
			licenseData.push({licensePath: "\\tmp\\reLICENSE.md", fileReferences: [fileReference0]} as LicenseInformation);
			const fileReference = new FileReference("/tmp/test0", false);
			LicenseCollector.checkFileReference(fileReference, fileReference.name, licenseData);
			expect(mockCheckFolder).toHaveBeenCalledTimes(1);
			expect(mockExtractPackageInfo).toHaveBeenCalledTimes(1);
			mockCheckFolder.mockRestore();
			mockExtractPackageInfo.mockRestore();
		});
		it("Normal license existing missing license", () => {
			const mockCheckFolder = jest.spyOn(FolderRunner, "checkFolder").mockImplementation((file, currentFilePath, callback: (currentFolder: string) => {}) => {
				const tempFile = file;
				const currentFile = currentFilePath;
				callback("/tmp");
				return false;
			});
			const mockExtractPackageInfo = jest.spyOn(LicenseCollector, "checkForAdditionalLicenses").mockImplementation(() => {
				return ["\\tmp\\reLICENSE.md", "\\tmp\\aaaalicenceREADME", "\\tmp\\teLiSenSekd" ];
			});
			const licenseData: LicenseInformation[] = [];
			const fileReference0 = new FileReference("/tmp/testreference", false);
			licenseData.push({licensePath: "\\tmp\\reLICENSE.md", fileReferences: [fileReference0]} as LicenseInformation);
			licenseData.push({licensePath: null, fileReferences: []} as LicenseInformation);
			const fileReference = new FileReference("/tmp/test0", false);
			LicenseCollector.checkFileReference(fileReference, fileReference.name, licenseData);
			expect(mockCheckFolder).toHaveBeenCalledTimes(1);
			expect(mockExtractPackageInfo).toHaveBeenCalledTimes(1);
			mockCheckFolder.mockRestore();
			mockExtractPackageInfo.mockRestore();
		});
	});
	describe("checkForAdditionalLicenses", () => {
		it("Unknown file", () => {
			const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
				return false;
			});
			expect(LicenseCollector.checkForAdditionalLicenses("/tmp")).toEqual([]);
			expect(mockFsExists).toBeCalledTimes(1);
			mockFsExists.mockRestore();
		});
		it("No directory", () => {
			const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
				return true;
			});
			const mockReaddirSync = jest.spyOn(fs, "readdirSync").mockImplementation(() => {
				return [];
			});
			const mockFsLstatSync = jest.spyOn(fs, "lstatSync").mockImplementation(() => {
				return {
					isDirectory() {
						return false;
					},
				} as fs.Stats;
			});
			mockFsExists.mockClear();
			mockFsLstatSync.mockClear();
			mockReaddirSync.mockClear();
			expect(LicenseCollector.checkForAdditionalLicenses("/tmp")).toEqual([]);
			expect(mockFsExists).toBeCalledTimes(1);
			expect(mockFsLstatSync).toBeCalledTimes(1);
			expect(mockReaddirSync).toBeCalledTimes(0);
			mockReaddirSync.mockRestore();
			mockFsExists.mockRestore();
			mockFsLstatSync.mockRestore();
		});
		it("Find licenses", () => {
			const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementationOnce(() => {
				return true;
			});
			const mockReaddirSync = jest.spyOn(fs, "readdirSync").
				mockImplementationOnce(() => {
				return ["tmp", "reLICENSE.md", "aaaalicenceREADME", "teLiSenSekd"] as unknown as fs.Dirent[];
			});
			const mockFsLstatSync = jest.spyOn(fs, "lstatSync").mockImplementation(() => {
				return {
					isDirectory() {
						return true;
					},
				} as fs.Stats;
			});
			const mockPathResolve = jest.spyOn(path, "resolve").mockImplementation((...pathSegments: string[]) => {
				return pathSegments[0];
			});
			mockFsExists.mockClear();
			mockFsLstatSync.mockClear();
			mockReaddirSync.mockClear();
			mockPathResolve.mockClear();
			expect(LicenseCollector.checkForAdditionalLicenses("/tmp")).toEqual(["\\tmp\\reLICENSE.md", "\\tmp\\aaaalicenceREADME", "\\tmp\\teLiSenSekd" ]);
			expect(mockFsExists).toBeCalledTimes(1);
			expect(mockFsLstatSync).toBeCalledTimes(1);
			expect(mockReaddirSync).toBeCalledTimes(1);
			mockReaddirSync.mockRestore();
			mockFsExists.mockRestore();
			mockPathResolve.mockRestore();
			mockFsLstatSync.mockRestore();
		});
	});
});
