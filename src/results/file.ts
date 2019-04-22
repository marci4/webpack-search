export class File {
	public readonly name: string;
	public readonly built: boolean;
	constructor(name: string, built: boolean) {
		this.name = name;
		this.built = built;
	}
}
