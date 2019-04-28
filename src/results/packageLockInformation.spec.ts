import {PackageLockInformation} from "./packageLockInformation";

describe("PackageLockInformation", () => {
	it("Constructor", () => {
		const packageLockInformation = new PackageLockInformation("name", "4.2.0.0", "/home/package/resolvedpath");
		expect(packageLockInformation.name).toEqual("name");
		expect(packageLockInformation.version).toEqual("4.2.0.0");
		expect(packageLockInformation.resolvedPath).toEqual("/home/package/resolvedpath");
	});
});
