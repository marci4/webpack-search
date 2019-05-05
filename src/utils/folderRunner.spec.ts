/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import * as path from "path";
import {FileReference} from "../results/fileReference";
import {FolderRunner} from "./folderRunner";

describe("FolderRunner", () => {
	describe("checkFolder", () => {
		let mockPathResolve: any;
		let mockExistsSync: any;
		beforeEach(() => {
			mockPathResolve = jest.spyOn(path, "resolve").mockImplementation((...pathSegments: string[]) => {
				return pathSegments[0];
			});
			mockExistsSync = jest.spyOn(fs, "existsSync").mockImplementation(() => {
				return false;
			});
		});
		afterEach(() => {
			mockPathResolve.mockRestore();
			mockExistsSync.mockRestore();
		});
		it("Return on node_modules", () => {
			mockPathResolve.mockClear();
			const fileReference = new FileReference("file", true);
			expect(FolderRunner.checkFolder(fileReference, "./node_modules", () => {
				return true;
			})).toBeFalsy();
			expect(mockPathResolve).toHaveBeenCalledTimes(1);
		});
		it("Return on magic ngstyle fix", () => {
			mockPathResolve.mockClear();
			mockExistsSync.mockClear();
			const fileReference = new FileReference("file", true);
			expect(FolderRunner.checkFolder(fileReference, fileReference.name, () => {
				return true;
			})).toBeFalsy();
			expect(mockPathResolve).toHaveBeenCalledTimes(1);
			expect(mockExistsSync).toHaveBeenCalledTimes(2);
		});
		it("Return on magic ngstyle fix - go deeper", () => {
			mockPathResolve.mockClear();
			mockExistsSync.mockClear();
			const fileReference = new FileReference("/tmp/file", true);

			const mockPathDirName = jest.spyOn(path, "dirname").mockImplementation(() => {
				return "./node_modules";
			});
			mockExistsSync = jest.spyOn(fs, "existsSync").mockImplementation((tempFile) => {
				return tempFile !== "/tmp/file";
			});
			expect(FolderRunner.checkFolder(fileReference, fileReference.name, () => {
				return true;
			})).toBeFalsy();
			expect(mockPathResolve).toHaveBeenCalledTimes(2);
			expect(mockExistsSync).toHaveBeenCalledTimes(2);
			expect(mockPathDirName).toHaveBeenCalledTimes(2);
			mockPathDirName.mockRestore();
		});
		it("Return on isDirectory", () => {

			const fileReference = new FileReference("/tmp/file", true);

			const mockPathDirName = jest.spyOn(path, "dirname").mockImplementation(() => {
				return "./node_modules";
			});
			const mockFsLstatSync = jest.spyOn(fs, "lstatSync").mockImplementation(() => {
				return {isDirectory() { return true; }} as fs.Stats;
			});
			mockExistsSync = jest.spyOn(fs, "existsSync").mockImplementation((tempFile) => {
				return tempFile === "/tmp/file";
			});
			mockPathResolve.mockClear();
			mockExistsSync.mockClear();
			mockPathDirName.mockClear();
			expect(FolderRunner.checkFolder(fileReference, fileReference.name, () => {
				return true;
			})).toBeTruthy();
			expect(mockPathResolve).toHaveBeenCalledTimes(1);
			expect(mockExistsSync).toHaveBeenCalledTimes(1);
			expect(mockPathDirName).toHaveBeenCalledTimes(0);
			mockPathDirName.mockRestore();
			mockFsLstatSync.mockRestore();
		});
		it("Normal go deeper", () => {
			const fileReference = new FileReference("/tmp/file", true);

			const mockPathDirName = jest.spyOn(path, "dirname").mockImplementation(() => {
				return "./node_modules";
			});
			const mockFsLstatSync = jest.spyOn(fs, "lstatSync").mockImplementation(() => {
				return {isDirectory() { return false; }} as fs.Stats;
			});
			mockExistsSync = jest.spyOn(fs, "existsSync").mockImplementation((tempFile) => {
				return tempFile === "/tmp/file";
			});
			mockPathDirName.mockClear();
			mockPathResolve.mockClear();
			mockExistsSync.mockClear();
			expect(FolderRunner.checkFolder(fileReference, fileReference.name, () => {
				return true;
			})).toBeFalsy();

			expect(mockPathResolve).toHaveBeenCalledTimes(2);
			expect(mockExistsSync).toHaveBeenCalledTimes(1);
			expect(mockPathDirName).toHaveBeenCalledTimes(1);
			mockPathDirName.mockRestore();
			mockFsLstatSync.mockRestore();
		});
	});
});
