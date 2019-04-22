import {Files} from "../results/files";

export class FileCollector {
	public readonly files = new Files();
	private json: any;

	constructor(json: any) {
		this.json = json;
		this.collectFiles();
	}

	public filesFound(): boolean {
		return this.files.modules.length > 0 || this.files.src.length > 0 || this.files.unknown.length > 0;
	}

	private collectFiles(): void {
		// TODO include assets and other usefull information
		if (this.json.chunks !== undefined) {
			for (const chunk of this.json.chunks) {
				this.recursiveSearchByModule(chunk);
			}
		}
		if (this.json.children !== undefined) {
			for (const child of this.json.children) {
				for (const chunk of child.chunks) {
					this.recursiveSearchByModule(chunk);
				}
			}
		}
	}

	private recursiveSearchByModule(modules: any[]): void {
		for (const module of modules) {
			if (module.modules) {
				return this.recursiveSearchByModule(module.modules);
			}
			const name = module.name;
			if (name.startsWith("./node_modules/")) {
				this.files.modules.push(new File(name, module.built));
			} else if (name.startsWith("./src/")) {
				this.files.src.push(new File(name, module.built));
			} else {
				this.files.unknown.push(new File(name, module.built));
			}
		}
	}
}
