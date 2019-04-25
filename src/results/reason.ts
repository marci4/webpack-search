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
