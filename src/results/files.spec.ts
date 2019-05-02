/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import {Files} from "./files";

describe("Files", () => {
	it("Constructor", () => {
		const files = new Files();
		expect(files.nonExisting.length).toEqual(0);
		expect(files.src.length).toEqual(0);
		expect(files.modules.length).toEqual(0);
		expect(files.unknown.length).toEqual(0);
	});
});
