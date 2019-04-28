import * as fs from "fs";
import * as path from "path";
import {FileReference} from "../results/fileReference";

export class FolderRunner {

	// Since we only use chunk.modules here, we only get ./node_modules
	public static checkFolder(file: FileReference, currentFilePath: string, callback: (currentFolder: string) => boolean): boolean {
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
