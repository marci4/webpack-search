/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import {Result} from "./result";

describe("Result", () => {
	it("Constructor", () => {
		const result = new Result();
		expect(result.errors.length).toEqual(0);
		expect(result.packageLocks.length).toEqual(0);
		expect(result.packages.length).toEqual(0);
		expect(result.licenses.length).toEqual(0);
	});
});
