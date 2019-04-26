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
