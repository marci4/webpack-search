/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

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
