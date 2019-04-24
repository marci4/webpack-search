export class Reason {
	public readonly name: string;
	public readonly identifier: string;

	constructor(moduleName: string, moduleIdentifier: string) {
		this.name = moduleName;
		this.identifier = moduleIdentifier;
	}
}
