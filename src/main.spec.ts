// @ts-ignore
import {main} from "./main";

function mockExitImplementation(code?: number): never {
	throw new Error("" + code);
}

function mockConsoleImplementation(): void {
	// Ignore
}

describe("Main", () => {
	it("static main with missing arguments", (done) => {
		const mockExit = jest.spyOn(process, "exit").mockImplementation(mockExitImplementation);
		const mockError = jest.spyOn(console, "error").mockImplementation(mockConsoleImplementation);
		try {
			main(["hello"]).catch(() => done());
		} catch (e) {
			expect(e).toEqual("1");
		}
		expect(mockExit).toHaveBeenCalledWith(1);
		expect(mockError).toHaveBeenCalledTimes(2);
		done();
	});
});
