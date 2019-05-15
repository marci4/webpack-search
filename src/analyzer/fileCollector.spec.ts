/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import * as path from "path";
import {FileCollector} from "./fileCollector";

describe("FileCollector", () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});
	it("Constructor", () => {
		const fileCollector = new FileCollector({});
		expect(fileCollector.filesFound()).toBeFalsy();
	});
	it("Analyze real file", () => {
		let json;
		try {
			json = JSON.parse(fs.readFileSync(path.join("test", "fileCollector", "stats_4-29.json"), "utf8"));
		} catch (e) {
			expect(e).not.toThrow();
		}
		let result;
		try {
			result = JSON.parse(fs.readFileSync(path.join("test", "fileCollector", "result_4-29.json"), "utf8"));
		} catch (e) {
			expect(e).not.toThrow();
		}

		const fileCollector = new FileCollector(json);
		expect(fileCollector.filesFound()).toBeTruthy();
		expect(fileCollector.files).toEqual(result);
	});
	xit("Update result and stats", () => {
		let json;
		try {
			json = JSON.parse(fs.readFileSync(path.join("test", "fileCollector", "stats_4-29.json"), "utf8"));
		} catch (e) {
			expect(e).not.toThrow();
		}
		let result;
		try {
			result = JSON.parse(fs.readFileSync(path.join("test", "fileCollector", "result_4-29.json"), "utf8"));
		} catch (e) {
			expect(e).not.toThrow();
		}
		const fileCollector = new FileCollector(json);
		fs.writeFileSync(path.join("test", "fileCollector", "stats_4-29.json"), JSON.stringify(json, ((key, value) => {
			if (key === "source") {
				return undefined;
			}
			return value;
		})));
		fs.writeFileSync(path.join("test", "fileCollector", "result_4-29.json"), JSON.stringify(fileCollector.files));
	});
});
