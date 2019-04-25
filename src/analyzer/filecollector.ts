import {AssetReference} from "../results/assetReference";
import {FileReference} from "../results/fileReference";
import {Files} from "../results/files";
import {Reason} from "../results/reason";

export class FileCollector {

	private static collectReasons(reasons: any[]): Reason[] {
		if (reasons === undefined || (!(reasons instanceof Array))) {
			return [];
		}
		const result = [];
		for (const reason of reasons) {
			result.push(new Reason(reason.moduleName, reason.moduleIdentifier));
		}
		return result;
	}

	private static collectAssets(assets: any[]): AssetReference[] {
		if (assets === undefined || (!(assets instanceof Array))) {
			return [];
		}
		const result = [];
		for (const asset of assets) {
			// TODO Maybe include some more info
			result.push(new AssetReference(asset.name, asset.emitted, asset.size));
		}
		return result;
	}
	public readonly files = new Files();

	constructor(json: any) {
		this.collectFiles(json);
	}

	public filesFound(): boolean {
		return this.files.modules.length > 0 || this.files.src.length > 0 || this.files.unknown.length > 0;
	}

	private collectFiles(json: any): void {
		this.collectChunks(json.chunks);
		if (json.children !== undefined || (!(json.children instanceof Array))) {
			for (const child of json.children) {
				this.collectFiles(child);
			}
		}
		this.collectModules(json.modules);
	}

	private collectChunks(chunks: any[]): void {
		if (chunks === undefined || (!(chunks instanceof Array))) {
			return;
		}
		for (const chunk of chunks) {
			this.collectModules(chunk.modules);
		}
	}

	private collectModules(modules: any[]): void {
		if (modules === undefined || (!(modules instanceof Array))) {
			return;
		}
		for (const module of modules) {
			const name = module.name;
			const fileReference = new FileReference(name, module.built, module.size);
			fileReference.assets = FileCollector.collectAssets(module.assets);
			fileReference.reasons = FileCollector.collectReasons(module.reasons);
			this.collectModules(module.modules);
			if (name.startsWith("./node_modules/")) {
				this.files.modules.push(fileReference);
			} else if (name.startsWith("./src/")) {
				this.files.src.push(fileReference);
			} else {
				// TODO Better handle multi & css
				this.files.unknown.push(fileReference);
			}
		}
	}
}
