import {Author} from "./author";

export class License {
	public readonly author: Author;

	public readonly name: string;

	constructor(author: Author, name: string) {
		this.author = author;
		this.name = name;
	}
}
