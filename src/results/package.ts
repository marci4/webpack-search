import {Author} from "./author";

export class Package {

	public readonly version: string;
	public readonly name: string;
	public readonly license: string;
	public readonly author: Author;
	public readonly packagePath: string;
	public readonly additionalLicenses: string[];
	public readonly files: File[];

	constructor(name: any, version: any, license: string, author: Author, packagePath: string) {
		this.name = name;
		this.version = version;
		this.license = license;
		this.author = author;
		this.packagePath = packagePath;
	}

}
