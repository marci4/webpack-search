export class Author {

	public static parse(author: any): Author {
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
