export class AssetReference {
	public readonly size: number;
	public readonly emitted: boolean;
	public readonly name: string;

	constructor(name: string, emitted: boolean, size: number) {
		this.name = name;
		this.emitted = emitted;
		this.size = size;
	}
}
