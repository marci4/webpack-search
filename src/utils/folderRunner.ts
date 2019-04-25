import * as fs from "fs";
import * as path from "path";
import {FileReference} from "../results/fileReference";

export class FolderRunner {

	// Since we only use chunk.modules here, we only get ./node_modules
	public static checkFolder(file: FileReference, currentFilePath: string, callback: (currentFolder: string) => void) {
		if (!fs.existsSync(currentFilePath) || currentFilePath === "./node_modules") {
			return;
		}
		if (fs.lstatSync(currentFilePath).isDirectory()) {
			const currentFolder = path.resolve(currentFilePath);
			callback(currentFolder);
		}
		// We need to go deeper
		this.checkFolder(file, path.dirname(currentFilePath), callback);
	}
}
