/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import {Author} from "./author";

describe("Author", () => {
	it("Constructor", () => {
		const author0 = new Author("marci4", "admin@marci4.de");
		expect(author0.name).toEqual("marci4");
		expect(author0.email).toEqual("admin@marci4.de");
		const author1 = new Author("marci4", null);
		expect(author1.name).toEqual("marci4");
		expect(author1.email).toBeNull();
	});
	describe("Parse", () => {
		it("Undefined only", () => {
			const author = Author.parse(undefined);
			expect(author).toBeNull();
		});
		it("Null only", () => {
			const author = Author.parse(null);
			expect(author).toBeNull();
		});
		it("Array only", () => {
			const author = Author.parse(1);
			expect(author).toBeNull();
		});
		it("Name only", () => {
			const author = Author.parse("marci4");
			expect(author.name).toEqual("marci4");
			expect(author.email).toBeNull();
		});
		it("Name only in object", () => {
			const author = Author.parse({name: "marci4"});
			expect(author.name).toEqual("marci4");
			expect(author.email).toBeNull();
		});
		it("Name and email in object", () => {
			const author = Author.parse({name: "marci4", email: "admin@marci4.de"});
			expect(author.name).toEqual("marci4");
			expect(author.email).toEqual("admin@marci4.de");
		});
		it("Email only in object", () => {
			const author = Author.parse({ email: "admin@marci4.de"});
			expect(author.name).toBeNull();
			expect(author.email).toEqual("admin@marci4.de");
		});
	});
});
