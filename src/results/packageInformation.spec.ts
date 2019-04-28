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
