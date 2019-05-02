/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import {PackageLockInformation} from "./packageLockInformation";

describe("PackageLockInformation", () => {
	it("Constructor", () => {
		const packageLockInformation = new PackageLockInformation("name", "4.2.0.0", "/home/package/resolvedpath");
		expect(packageLockInformation.name).toEqual("name");
		expect(packageLockInformation.version).toEqual("4.2.0.0");
		expect(packageLockInformation.resolvedPath).toEqual("/home/package/resolvedpath");
	});
});
