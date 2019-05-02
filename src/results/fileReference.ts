/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import {AssetReference} from "./assetReference";
import {Reason} from "./reason";

export class FileReference {
	public readonly name: string;
	public readonly built: boolean;
	public reasons: Reason[] = [];
	public assets: AssetReference[] = [];
	constructor(name: string, built: boolean) {
		this.name = name;
		this.built = built;
	}
}
