/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import {Licenses} from "./licenses";

describe("Licenses", () => {
	it("Constructor", () => {
		const licenses = new Licenses();
		expect(licenses.detectedLicenses.length).toEqual(0);
		expect(licenses.unknownLicenses.length).toEqual(0);
	});
});
