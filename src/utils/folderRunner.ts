/*
 Copyright (c) 2019 Marcel Prestel
 "THE BEER-WARE LICENSE" (Revision 42):
 <admin@marci4.de> wrote this file. As long as you retain this notice you
 can do whatever you want with this stuff. If we meet some day, and you think
 this stuff is worth it, you can buy me a beer in return.
 */

import * as fs from "fs";
import * as path from "path";
import {FileReference} from "../results/fileReference";

export namespace FolderRunner {

	// Since we only use chunk.modules here, we only get ./node_modules
	export function checkFolder(file: FileReference, currentFilePath: string, callback: (currentFolder: string) => boolean): boolean {
		const currentFolder = path.resolve(currentFilePath);
		if (currentFilePath === "./node_modules") {
			return false;
		}
		// Lets do some magic for stupid *.ngfactory.js or *.ngstyle.js
		if (!fs.existsSync(currentFolder)) {
			if (!fs.existsSync(path.dirname(currentFolder))) {
				// Cant do much here...
				return false;
			} else {
				// We need to go deeper
				return this.checkFolder(file, path.dirname(currentFilePath), callback);
			}
		}
		if (fs.lstatSync(currentFolder).isDirectory()) {
			if (callback(currentFolder)) {
				return true;
			}
		}
		// We need to go deeper
		return this.checkFolder(file, path.dirname(currentFilePath), callback);
	}
}
