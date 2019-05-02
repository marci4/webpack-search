/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

export class Author {

	/**
	 * Try to parse the input provided by the package.json
	 * @param author {string|any}
	 */
	public static parse(author: string|any): Author {
		if (author === null || author === undefined) {
			return null;
		}
		if (typeof author === "string") {
			return new Author(author, null);
		}
		if (author instanceof Object) {
			const name = author.name ? author.name : null;
			const email = author.email ? author.email : null;
			return new Author(name, email);
		}
		return null;
	}

	public readonly name: string;
	public readonly email: string | null;

	constructor(name: string, email: string | null) {
		this.name = name;
		this.email = email;
	}
}
