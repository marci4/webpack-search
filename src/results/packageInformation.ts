import {Author} from "./author";
import {FileReference} from "./fileReference";

export class PackageInformation {

	public readonly version: string;
	public readonly name: string;
	public readonly packageLicense: string;
	public readonly packageAuthor: Author;
	public readonly packagePath: string;
	public readonly files: FileReference[];

	constructor(name: string, version: string, license: string, author: Author, packagePath: string) {
		this.name = name;
		this.version = version;
		this.packageLicense = license;
		this.packageAuthor = author;
		this.packagePath = packagePath;
	}

}
