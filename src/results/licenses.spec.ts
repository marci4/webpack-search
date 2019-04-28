import {Licenses} from "./licenses";

describe("Licenses", () => {
	it("Constructor", () => {
		const licenses = new Licenses();
		expect(licenses.detectedLicenses.length).toEqual(0);
		expect(licenses.unknownLicenses.length).toEqual(0);
	});
});
