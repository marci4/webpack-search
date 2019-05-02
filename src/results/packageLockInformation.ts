/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

export class PackageLockInformation {
	public readonly name: string;
	public readonly version: string;
	public readonly resolvedPath: string;

	constructor(name: string, version: string, resolvedPath: string) {
		this.name = name;
		this.version = version;
		this.resolvedPath = resolvedPath;
	}
}
