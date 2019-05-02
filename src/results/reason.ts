/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

export class Reason {
	public readonly name: string;
	public readonly identifier: string;
	public readonly type: string;
	constructor(moduleName: string, moduleIdentifier: string, type: string) {
		this.name = moduleName;
		this.identifier = moduleIdentifier;
		this.type = type;
	}
}
