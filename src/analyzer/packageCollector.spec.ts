/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import {Stats} from "fs";
import * as path from "path";
import {FileReference} from "../results/fileReference";
import {Files} from "../results/files";
import {PackageInformation} from "../results/packageInformation";
import {FolderRunner} from "../utils/folderRunner";
import {FileCollector} from "./fileCollector";
import {PackageCollector} from "./packageCollector";

describe("PackageCollector", () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});
	describe("collectPackages", () => {
		beforeEach(() => {
			jest.restoreAllMocks();
		});
		it("Check with empty modules", () => {
			const fileCollector = {files: new Files()} as FileCollector;
			expect(PackageCollector.collectPackages(fileCollector).length).toEqual(0);
		});
		it("Check with modules", () => {
			const fileCollector = {files: new Files()} as FileCollector;
			fileCollector.files.modules.push(new FileReference("/tmp/testfile0", false));
			fileCollector.files.modules.push(new FileReference("/tmp/testfile1", false));
			const mockCheckFileReference = jest.spyOn(PackageCollector, "checkFileReference").mockImplementation();
			expect(PackageCollector.collectPackages(fileCollector).length).toEqual(0);
			expect(mockCheckFileReference).toBeCalledTimes(2);
			mockCheckFileReference.mockRestore();
		});
	});
	describe("extractPackageInfo", () => {
		beforeEach(() => {
			jest.restoreAllMocks();
		});
		it("Unknown file", () => {
			const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
				return false;
			});
			expect(PackageCollector.extractPackageInfo("/tmp")).toBeNull();
			expect(mockFsExists).toBeCalledTimes(1);
			mockFsExists.mockRestore();
		});
		it("No directory", () => {
			const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
				return true;
			});
			const mockFsLstatSync = jest.spyOn(fs, "lstatSync").mockImplementation(() => {
				const result = new Stats();
				result.isDirectory = jest.fn().mockImplementation(() => {
					return false;
				});
				return result;
			});
			mockFsExists.mockClear();
			mockFsLstatSync.mockClear();
			expect(PackageCollector.extractPackageInfo("/tmp")).toBeNull();
			expect(mockFsExists).toBeCalledTimes(1);
			expect(mockFsLstatSync).toBeCalledTimes(1);
			mockFsExists.mockRestore();
			mockFsLstatSync.mockRestore();
		});
		it("No package.json", () => {
			const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation((tempPath) => {
				return tempPath === "/tmp";
			});
			const mockFsLstatSync = jest.spyOn(fs, "lstatSync").mockImplementation(() => {
				const result = new Stats();
				result.isDirectory = jest.fn().mockImplementation(() => {
					return true;
				});
				return result;
			});
			mockFsExists.mockClear();
			mockFsLstatSync.mockClear();
			expect(PackageCollector.extractPackageInfo("/tmp")).toBeNull();
			expect(mockFsExists).toBeCalledTimes(2);
			expect(mockFsLstatSync).toBeCalledTimes(1);
			mockFsExists.mockRestore();
			mockFsLstatSync.mockRestore();
		});
		it("Read package.json", () => {
			const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
				return true;
			});
			const mockFsLstatSync = jest.spyOn(fs, "lstatSync").mockImplementation(() => {
				const mockStats = new Stats();
				mockStats.isDirectory = jest.fn().mockImplementation(() => {
					return true;
				});
				return mockStats;
			});
			const mockFsReadFileSync = jest.spyOn(fs, "readFileSync").mockImplementation(() => {
				return "{\"name\": \"test\",\"version\": \"1.1.0\",\"author\": \"marci4\",\"license\": \"MIT\"}";
			});

			mockFsExists.mockClear();
			mockFsLstatSync.mockClear();
			mockFsReadFileSync.mockClear();
			const result = PackageCollector.extractPackageInfo("/tmp");
			const expected = JSON.parse("{\"files\": [], \"name\": \"test\", \"packageAuthor\": {\"email\": null, \"name\": \"marci4\"}, \"packageLicense\": \"MIT\"," +
				" \"version\": \"1.1.0\"}");
			expect(result.files).toEqual(expected.files);
			expect(result.name).toEqual(expected.name);
			expect(result.packageAuthor.name).toEqual(expected.packageAuthor.name);
			expect(result.packageAuthor.email).toEqual(expected.packageAuthor.email);
			expect(result.packageLicense).toEqual(expected.packageLicense);
			expect(result.version).toEqual(expected.version);
			// Somehow path.join does produce once with \\tmp and once without \\
			expect(result.packagePath.endsWith(path.join("tmp", "package.json"))).toBeTruthy();
			expect(mockFsReadFileSync).toBeCalledTimes(1);
			expect(mockFsExists).toBeCalledTimes(2);
			expect(mockFsLstatSync).toBeCalledTimes(1);
			mockFsReadFileSync.mockRestore();
			mockFsExists.mockRestore();
			mockFsLstatSync.mockRestore();
		});
	});
	describe("checkFileReference", () => {
		beforeEach(() => {
			jest.restoreAllMocks();
		});
		it("Packageinfo is null", () => {
			const mockCheckFolder = jest.spyOn(FolderRunner, "checkFolder").mockImplementation((file, currentFilePath, callback: (currentFolder: string) => {}) => {
				const tempFile = file;
				const currentFile = currentFilePath;
				callback("/tmp");
				return false;
			});
			const mockExtractPackageInfo = jest.spyOn(PackageCollector, "extractPackageInfo").mockImplementation(() => {
				return null;
			});
			const packageData: PackageInformation[] = [];
			const fileReference = new FileReference("/tmp/test0", false);
			PackageCollector.checkFileReference(fileReference, fileReference.name, packageData);
			expect(mockCheckFolder).toHaveBeenCalledTimes(1);
			expect(mockExtractPackageInfo).toHaveBeenCalledTimes(1);
			mockCheckFolder.mockRestore();
			mockExtractPackageInfo.mockRestore();
		});
		it("Angular package", () => {
			const mockCheckFolder = jest.spyOn(FolderRunner, "checkFolder").mockImplementation((file, currentFilePath, callback: (currentFolder: string) => {}) => {
				const tempFile = file;
				const currentFile = currentFilePath;
				callback("/tmp");
				return false;
			});
			const mockExtractPackageInfo = jest.spyOn(PackageCollector, "extractPackageInfo").mockImplementation(() => {
				return new PackageInformation("@angular/material/tabcontrol", "1.1.0.0", null, null, null);
			});
			const packageData: PackageInformation[] = [];
			const fileReference = new FileReference("/tmp/test0", false);
			PackageCollector.checkFileReference(fileReference, fileReference.name, packageData);
			expect(mockCheckFolder).toHaveBeenCalledTimes(1);
			expect(mockExtractPackageInfo).toHaveBeenCalledTimes(1);
			mockCheckFolder.mockRestore();
			mockExtractPackageInfo.mockRestore();
		});
		it("Normal package not existing", () => {
			const mockCheckFolder = jest.spyOn(FolderRunner, "checkFolder").mockImplementation((file, currentFilePath, callback: (currentFolder: string) => {}) => {
				const tempFile = file;
				const currentFile = currentFilePath;
				callback("/tmp");
				return false;
			});
			const mockExtractPackageInfo = jest.spyOn(PackageCollector, "extractPackageInfo").mockImplementation(() => {
				return new PackageInformation("@angular/core", "1.1.0.0", null, null, null);
			});
			const packageData: PackageInformation[] = [];
			const fileReference = new FileReference("/tmp/test0", false);
			PackageCollector.checkFileReference(fileReference, fileReference.name, packageData);
			expect(mockCheckFolder).toHaveBeenCalledTimes(1);
			expect(mockExtractPackageInfo).toHaveBeenCalledTimes(1);
			mockCheckFolder.mockRestore();
			mockExtractPackageInfo.mockRestore();
		});
		it("Normal package existing", () => {
			const mockCheckFolder = jest.spyOn(FolderRunner, "checkFolder").mockImplementation((file, currentFilePath, callback: (currentFolder: string) => {}) => {
				const tempFile = file;
				const currentFile = currentFilePath;
				callback("/tmp");
				return true;
			});
			const mockExtractPackageInfo = jest.spyOn(PackageCollector, "extractPackageInfo").mockImplementation(() => {
				const result =  new PackageInformation("@angular/core", "1.1.0.0", null, null, null);
				result.files.push(new FileReference("/tmp/test1", false));
				return result;
			});
			const packageData: PackageInformation[] = [];
			packageData.push(new PackageInformation("@angular/core", "1.1.0.0", null, null, null));
			packageData[0].files.push(new FileReference("/tmp/existingFile", true));
			const fileReference = new FileReference("/tmp/test0", false);
			PackageCollector.checkFileReference(fileReference, fileReference.name, packageData);
			expect(packageData.length).toEqual(1);
			expect(packageData[0].files.length).toEqual(2);
			expect(mockCheckFolder).toHaveBeenCalledTimes(1);
			expect(mockExtractPackageInfo).toHaveBeenCalledTimes(1);
			mockCheckFolder.mockRestore();
			mockExtractPackageInfo.mockRestore();
		});
		it("Normal package existing", () => {
			const mockCheckFolder = jest.spyOn(FolderRunner, "checkFolder").mockImplementation((file, currentFilePath, callback: (currentFolder: string) => {}) => {
				const tempFile = file;
				const currentFile = currentFilePath;
				callback("/tmp");
				return true;
			});
			const mockExtractPackageInfo = jest.spyOn(PackageCollector, "extractPackageInfo").mockImplementation(() => {
				const result =  new PackageInformation("@angular/core", "1.1.0.0", null, null, null);
				result.files.push(new FileReference("/tmp/test1", false));
				return result;
			});
			const packageData: PackageInformation[] = [];
			packageData.push(new PackageInformation("@angular/core", "1.1.0.0", null, null, null));
			packageData[0].files.push(new FileReference("/tmp/existingFile", true));
			const fileReference = new FileReference("/tmp/test0", false);
			PackageCollector.checkFileReference(fileReference, fileReference.name, packageData);
			expect(packageData.length).toEqual(1);
			expect(packageData[0].files.length).toEqual(2);
			expect(mockCheckFolder).toHaveBeenCalledTimes(1);
			expect(mockExtractPackageInfo).toHaveBeenCalledTimes(1);
			mockCheckFolder.mockRestore();
			mockExtractPackageInfo.mockRestore();
		});
	});
});
