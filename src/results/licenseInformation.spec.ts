import * as path from "path";
import {FileReference} from "./fileReference";
import {LicenseInformation} from "./licenseInformation";

describe("LicenseInformation", () => {
	it("Constructor with null file reference", () => {
		const licenseInformation = new LicenseInformation(null, null);
		expect(licenseInformation.fileReferences.length).toEqual(1);
		expect(licenseInformation.fileReferences[0]).toBeNull();
		expect(licenseInformation.licensePath).toBeNull();
		expect(licenseInformation.licenseText).toBeNull();
	});
	it("Constructor with null license but file reference", () => {
		const file = new FileReference("file.name", true);
		const licenseInformation = new LicenseInformation(null, file);
		expect(licenseInformation.fileReferences.length).toEqual(1);
		expect(licenseInformation.fileReferences[0]).toEqual(file);
		expect(licenseInformation.licensePath).toBeNull();
		expect(licenseInformation.licenseText).toBeNull();
	});
	it("Constructor unknown licensePath", () => {
		const file = new FileReference("file.name", true);
		const licenseInformation = new LicenseInformation("test.txt", file);
		expect(licenseInformation.licenseText).toBeNull();
	});
	it("Constructor unknown licensePath", () => {
		const file = new FileReference("file.name", true);
		//
		const licenseInformation = new LicenseInformation(path.join("test", "result", "licenseInformation", "license.txt"), file);
		expect(licenseInformation.licenseText).toEqual("Test-License");
	});
});
