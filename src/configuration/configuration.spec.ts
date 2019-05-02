/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as path from "path";
import {Argv} from "yargs";
import {Configuration} from "./configuration";
import {Constants} from "./constants";

const mock: any = [];
mock[Constants.EXTRACTLICENSES] = true;
mock[Constants.STATS] = "/tmp/stats.json";
mock[Constants.RESULT] = "arg/exporter.txt";
mock[Constants.WORKINGDIRECTORY] = "/tmp/home";
describe("Configuration", () => {
	describe("constructor", () => {
		it("Extract from yargs", () => {
			mock[Constants.PACKAGEOUTPUT] = "/tmp/packages";
			const configuration = new Configuration(mock as unknown as Argv);
			expect(configuration.statsJsonPath).toEqual(mock[Constants.STATS]);
			expect(configuration.resultJsonPath).toEqual(mock[Constants.RESULT]);
			expect(configuration.extractLicenses).toEqual(mock[Constants.EXTRACTLICENSES]);
			expect(configuration.workingDirectoryPath).toEqual(mock[Constants.WORKINGDIRECTORY]);
			expect(configuration.packageOutput).toEqual(mock[Constants.PACKAGEOUTPUT]);
		});
		it("Update when extractPackages is effective", () => {
			mock[Constants.PACKAGEOUTPUT] = null;
			const configuration = new Configuration(mock as unknown as Argv);
			expect(configuration.packageOutput).toBeNull();
		});
		it("Update when packageOutput is provided", () => {
			mock[Constants.PACKAGEOUTPUT] = "/tmp/packages";
			const configuration = new Configuration(mock as unknown as Argv);
			expect(configuration.packageOutput).toEqual(mock[Constants.PACKAGEOUTPUT]);
		});
	});
	describe("isValid", () => {
		it("invalid statsJsonPath", () => {
			const localMock: any = [];
			localMock[Constants.STATS] = "/tmp/stats.json";
			localMock[Constants.RESULT] = "/tmp/result.json";
			localMock[Constants.WORKINGDIRECTORY] = "/tmp/home";
			let configuration = new Configuration(localMock as unknown as Argv);
			expect(configuration.isValid().toString()).toEqual("Error: Unknown path: Type: stats Path: " + localMock[Constants.STATS]);
			localMock[Constants.STATS] = path.join("test", "configuration");
			configuration = new Configuration(localMock as unknown as Argv);
			expect(configuration.isValid().toString()).toEqual("Error: Unknown path: Type: stats Path: " + localMock[Constants.STATS]);
			localMock[Constants.STATS] = path.join("test", "configuration", "stats.json");
			configuration = new Configuration(localMock as unknown as Argv);
			expect(configuration.isValid().toString()).toEqual("Error: Unknown path: Type: workingDirectory Path: " + localMock[Constants.WORKINGDIRECTORY]);
		});
		it("invalid resultJsonPath", () => {
			const localMock: any = [];
			localMock[Constants.STATS] = path.join("test", "configuration", "stats.json");
			localMock[Constants.WORKINGDIRECTORY] = "/tmp/home";
			localMock[Constants.RESULT] = path.join("test", "configuration");
			let configuration = new Configuration(localMock as unknown as Argv);
			expect(configuration.isValid().toString()).toEqual("Error: Unknown path: Type: result Path: " + localMock[Constants.RESULT]);
			localMock[Constants.RESULT] = path.join("test", "configuration", "result.json");
			configuration = new Configuration(localMock as unknown as Argv);
			expect(configuration.isValid().toString()).toEqual("Error: Unknown path: Type: workingDirectory Path: " + localMock[Constants.WORKINGDIRECTORY]);
		});
		it("invalid working Directory", () => {
			const localMock: any = [];
			localMock[Constants.STATS] = path.join("test", "configuration", "stats.json");
			localMock[Constants.RESULT] = path.join("test", "configuration", "result.json");
			localMock[Constants.WORKINGDIRECTORY] = "/tmp/home";
			localMock[Constants.PACKAGEOUTPUT] = null;
			let configuration = new Configuration(localMock as unknown as Argv);
			expect(configuration.isValid().toString()).toEqual("Error: Unknown path: Type: workingDirectory Path: " + localMock[Constants.WORKINGDIRECTORY]);
			localMock[Constants.WORKINGDIRECTORY] = path.join("test", "configuration", "result.json");
			configuration = new Configuration(localMock as unknown as Argv);
			expect(configuration.isValid().toString()).toEqual("Error: Unknown path: Type: workingDirectory Path: " + localMock[Constants.WORKINGDIRECTORY]);
			localMock[Constants.WORKINGDIRECTORY] = path.join("test", "configuration");
			configuration = new Configuration(localMock as unknown as Argv);
			expect(configuration.isValid()).toBeNull();
		});
		it("invalid package output", () => {
			const localMock: any = [];
			localMock[Constants.STATS] = path.join("test", "configuration", "stats.json");
			localMock[Constants.RESULT] = path.join("test", "configuration", "result.json");
			localMock[Constants.WORKINGDIRECTORY] = path.join("test", "configuration");
			localMock[Constants.PACKAGEOUTPUT] = path.join("test", "configuration", "stats.json");
			let configuration = new Configuration(localMock as unknown as Argv);
			expect(configuration.isValid().toString()).toEqual("Error: Unknown path: Type: packageOutput Path: " + localMock[Constants.PACKAGEOUTPUT]);
			localMock[Constants.PACKAGEOUTPUT] = null;
			configuration = new Configuration(localMock as unknown as Argv);
			expect(configuration.isValid()).toBeNull();
			localMock[Constants.PACKAGEOUTPUT] = path.join("test", "configuration");
			configuration = new Configuration(localMock as unknown as Argv);
			expect(configuration.isValid()).toBeNull();
		});
	});
});
