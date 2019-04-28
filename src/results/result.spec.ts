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
