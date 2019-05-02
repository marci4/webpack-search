/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import {Author} from "./author";
import {PackageInformation} from "./packageInformation";

describe("PackageInformation", () => {
	it("Constructor", () => {
		const author = Author.parse("marci4");
		const packageInformation = new PackageInformation("name", "4.2.0.0", "MIT", author, "/home/packagepath");
		expect(packageInformation.name).toEqual("name");
		expect(packageInformation.version).toEqual("4.2.0.0");
		expect(packageInformation.packageAuthor).toEqual(author);
		expect(packageInformation.packageLicense).toEqual("MIT");
		expect(packageInformation.packagePath).toEqual("/home/packagepath");
		expect(packageInformation.files.length).toEqual(0);
	});
});
