import {Author} from "./author";
import {License} from "./license";

describe("License", () => {
	it("Constructor", () => {
		const author = Author.parse("test");
		const license = new License(author, "MIT");
		expect(license.author).toEqual(author);
		expect(license.name).toEqual("MIT");
	});
});
