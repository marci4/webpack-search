/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import {Configuration} from "../configuration/configuration";
import {AssetReference} from "../results/assetReference";
import {Author} from "../results/author";
import {ErrorMessage} from "../results/errorMessage";
import {FileReference} from "../results/fileReference";
import {LicenseInformation} from "../results/licenseInformation";
import {PackageInformation} from "../results/packageInformation";
import {PackageLockInformation} from "../results/packageLockInformation";
import {Reason} from "../results/reason";
import {Result} from "../results/result";
import {ResultExport} from "./resultExport";

describe("ResultExport", () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		mockFsUnlink = jest.spyOn(fs, "unlinkSync").mockImplementation(() => {
			//
		});
		mockFsWriteFile = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {
			//
		});
	});
	let mockFsUnlink: any;
	let mockFsWriteFile: any;
	afterAll(() => {
		mockFsUnlink.mockRestore();
		mockFsWriteFile.mockRestore();
	});
	it("exportResult", () => {
		const configuration = new Configuration({resultJsonPath: "/test/resultpath.json"});
		const result = new Result();
		const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
			return false;
		});
		result.errors.push(new ErrorMessage("Testerror 0"));
		result.errors.push(new ErrorMessage("Testerror 1"));
		const fileRef0 = new FileReference("/test/file0", false);
		fileRef0.assets.push(new AssetReference("Asset0", true, 42));
		fileRef0.assets.push(new AssetReference("Asset1", false, 1337));
		fileRef0.reasons.push(new Reason("Module0", "ModuleId0", "multi"));
		fileRef0.reasons.push(new Reason("Module1", "ModuleId1", "type"));
		fileRef0.assets.push(new AssetReference("Asset1", false, 1337));
		result.licenses.push(new LicenseInformation("/test/licensepath0", fileRef0));
		result.licenses.push(new LicenseInformation("/test/licensepath1", new FileReference("/test/file2", false)));
		result.packageLocks.push(new PackageLockInformation("PackageName", "1.1.0.0", "/test/package0"));
		result.packageLocks.push(new PackageLockInformation("PackageName1", "1.3.3.7", "/test/package4"));
		const fileRef1 = new FileReference("/test/file1", false);
		const fileRef2 = new FileReference("/test/file2", true);
		const package0 = new PackageInformation("Package0", "P1.1.0.0", "BEERWARE", Author.parse("marci4"), "/test/package0Path");
		package0.files.push(fileRef1);
		package0.files.push(fileRef2);
		const fileRef3 = new FileReference("/test/file3", false);
		const fileRef4 = new FileReference("/test/file4", true);
		const package1 = new PackageInformation("Package1", "P1.1.0.1", "MIT", Author.parse({name: "marci4", email: "admin@marci4.de"}), "/test/package1Path");
		package1.files.push(fileRef1);
		package1.files.push(fileRef2);
		package1.files.push(fileRef3);
		package1.files.push(fileRef4);
		result.packages.push(package1);
		result.packages.push(package0);

		mockFsWriteFile.mockClear();
		mockFsUnlink.mockClear();
		mockFsExists.mockClear();
		ResultExport.exportResult(configuration, result);
		expect(mockFsUnlink).toHaveBeenCalledTimes(0);
		expect(mockFsExists).toHaveBeenCalledTimes(1);
		expect(mockFsWriteFile).toHaveBeenCalledTimes(1);
		expect(mockFsWriteFile).toHaveBeenCalledWith(configuration.resultJsonPath, "{\"errors\":[{\"message\":\"Testerror 0\"},{\"message\":\"Testerror 1\"}],\"packages\":[{\"files\":[{\"assets\":[],\"name\":\"/test/file1\",\"built\":false},{\"assets\":[],\"name\":\"/test/file2\",\"built\":true},{\"assets\":[],\"name\":\"/test/file3\",\"built\":false},{\"assets\":[],\"name\":\"/test/file4\",\"built\":true}],\"name\":\"Package1\",\"version\":\"P1.1.0.1\",\"packageLicense\":\"MIT\",\"packageAuthor\":{\"name\":\"marci4\",\"email\":\"admin@marci4.de\"},\"packagePath\":\"/test/package1Path\"},{\"files\":[{\"assets\":[],\"name\":\"/test/file1\",\"built\":false},{\"assets\":[],\"name\":\"/test/file2\",\"built\":true}],\"name\":\"Package0\",\"version\":\"P1.1.0.0\",\"packageLicense\":\"BEERWARE\",\"packageAuthor\":{\"name\":\"marci4\",\"email\":null},\"packagePath\":\"/test/package0Path\"}],\"licenses\":[{\"fileReferences\":[{\"assets\":[{\"name\":\"Asset0\",\"emitted\":true,\"size\":42},{\"name\":\"Asset1\",\"emitted\":false,\"size\":1337},{\"name\":\"Asset1\",\"emitted\":false,\"size\":1337}],\"name\":\"/test/file0\",\"built\":false}],\"licenseContent\":null,\"licensePath\":\"/test/licensepath0\"},{\"fileReferences\":[{\"assets\":[],\"name\":\"/test/file2\",\"built\":false}],\"licenseContent\":null,\"licensePath\":\"/test/licensepath1\"}],\"packageLocks\":[{\"name\":\"PackageName\",\"version\":\"1.1.0.0\",\"resolvedPath\":\"/test/package0\"},{\"name\":\"PackageName1\",\"version\":\"1.3.3.7\",\"resolvedPath\":\"/test/package4\"}]}");
		mockFsExists.mockRestore();
	});
	it("exportResult noUnlink", () => {
		const configuration = new Configuration({resultJsonPath: null});
		const result = new Result();
		const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementationOnce(() => {
			return true;
		});
		mockFsWriteFile.mockClear();
		mockFsUnlink.mockClear();
		mockFsExists.mockClear();
		ResultExport.exportResult(configuration, result);
		expect(mockFsExists).toHaveBeenCalledTimes(1);
		expect(mockFsWriteFile).toHaveBeenCalledTimes(1);
		expect(mockFsUnlink).toHaveBeenCalledTimes(1);
		mockFsExists.mockRestore();
	});
});
