/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import {Author} from "./author";
import {FileReference} from "./fileReference";

export class PackageInformation {

	public readonly version: string;
	public readonly name: string;
	public readonly packageLicense: string;
	public readonly packageAuthor: Author;
	public readonly packagePath: string;
	public readonly files: FileReference[] = [];

	constructor(name: string, version: string, license: string, author: Author, packagePath: string) {
		this.name = name;
		this.version = version;
		this.packageLicense = license;
		this.packageAuthor = author;
		this.packagePath = packagePath;
	}

}
