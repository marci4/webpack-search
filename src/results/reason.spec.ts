import {Reason} from "./reason";

describe("Reason", () => {
	it("Constructor", () => {
		const reason = new Reason("name", "identifier", "type");
		expect(reason.name).toEqual("name");
		expect(reason.identifier).toEqual("identifier");
		expect(reason.type).toEqual("type");
	});
});
