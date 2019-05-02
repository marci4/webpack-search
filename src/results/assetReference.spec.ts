/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import {AssetReference} from "./assetReference";

describe("AssetReference", () => {
	it("Constructor", () => {
		const asset = new AssetReference("asset.name", true, 100);
		expect(asset.name).toEqual("asset.name");
		expect(asset.emitted).toBeTruthy();
		expect(asset.size).toEqual(100);
	});
});
