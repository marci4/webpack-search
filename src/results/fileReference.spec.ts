/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import {AssetReference} from "./assetReference";
import {FileReference} from "./fileReference";
import {Reason} from "./reason";

describe("FileReference", () => {
	it("Constructor", () => {
		const file = new FileReference("file.name", true);
		expect(file.name).toEqual("file.name");
		expect(file.built).toBeTruthy();
		expect(file.assets.length).toEqual(0);
		expect(file.reasons.length).toEqual(0);
	});
	it("Reasons", () => {
		const file = new FileReference("file", false);
		const reason = new Reason("moduleName", "moduleIdentifier", "type");
		file.reasons.push(reason);
		expect(file.reasons.length).toEqual(1);
		expect(file.reasons[0]).toEqual(reason);
	});
	it("Assets", () => {
		const file = new FileReference("file", false);
		const asset = new AssetReference("asset.name", true, 100);
		file.assets.push(asset);
		expect(file.assets.length).toEqual(1);
		expect(file.assets[0]).toEqual(asset);
	});
});
