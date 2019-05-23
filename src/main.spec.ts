/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import {Stats} from "fs";
import {Analyzer} from "./analyzer/analyzer";
import {Exporter} from "./exporter/exporter";
import {main} from "./main";
import {Result} from "./results/result";

function mockExitImplementation(code?: number): never {
	throw new Error("" + code);
}

function mockConsoleImplementation(): void {
	// Ignore
}

describe("Main", () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});
	it("static main with missing arguments", async () => {
		const mockExit = jest.spyOn(process, "exit").mockImplementation(mockExitImplementation);
		const mockError = jest.spyOn(console, "error").mockImplementation(mockConsoleImplementation);
		try {
			await main(["hello"]);
		} catch (e) {
			expect(e).toEqual(new Error("1"));
		}
		expect(mockExit).toHaveBeenCalledTimes(1);
		expect(mockError).toHaveBeenCalledTimes(3);
		mockError.mockRestore();
		mockError.mockRestore();
	});
	it("static main with good arguments but invalid configuration", async () => {
		const mockExit = jest.spyOn(process, "exit").mockImplementation(mockExitImplementation);
		const mockError = jest.spyOn(console, "error").mockImplementation(mockConsoleImplementation);
		const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
			return false;
		});
		try {
			await main(["node", "license-n-package-collector", "--workingDirectory=D:\\temp", "--result=D:\\result.json", "--stats=stats.json"]);
		} catch (e) {
			mockError.mockRestore();
			mockExit.mockRestore();
			mockFsExists.mockRestore();
			expect(e).toEqual(new Error("Unknown path: Type: stats Path: stats.json"));
			return;
		}
		expect(true).toBeFalsy();
	});
	it("static main with good arguments and valid configuration", async () => {
		const mockExit = jest.spyOn(process, "exit").mockImplementation(mockExitImplementation);
		const mockError = jest.spyOn(console, "error").mockImplementation(mockConsoleImplementation);
		const mockFsExists = jest.spyOn(fs, "existsSync").mockImplementation(() => {
			return true;
		});
		const mockFsLstatSync = jest.spyOn(fs, "lstatSync").mockImplementation((lstatPath) => {
			const result = new Stats();
			result.isDirectory = jest.fn().mockImplementation(() => {
				return lstatPath === "D:\\temp";
			});
			return result;
		});
		const mockAnalyze = jest.spyOn(Analyzer, "analyze").mockImplementation(() => {
			return new Result();
		});
		const mockExport = jest.spyOn(Exporter, "exportResults").mockImplementation(() => {
			// Empty
		});
		try {
			await main(["node", "license-n-package-collector", "--workingDirectory=D:\\temp", "--result=D:\\result.json", "--stats=stats.json"]);
		} catch (e) {
			expect(true).toBeFalsy();
		}
		expect(mockExit).toHaveBeenCalledTimes(0);
		expect(mockAnalyze).toHaveBeenCalledTimes(1);
		expect(mockExport).toHaveBeenCalledTimes(1);
		expect(mockError).toHaveBeenCalledTimes(0);
		mockAnalyze.mockRestore();
		mockExport.mockRestore();
		mockError.mockRestore();
		mockFsLstatSync.mockRestore();
		mockExit.mockRestore();
		mockFsExists.mockRestore();
	});

});
