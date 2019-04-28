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
