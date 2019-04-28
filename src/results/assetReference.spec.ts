import {AssetReference} from "./assetReference";

describe("AssetReference", () => {
	it("Constructor", () => {
		const asset = new AssetReference("asset.name", true, 100);
		expect(asset.name).toEqual("asset.name");
		expect(asset.emitted).toBeTruthy();
		expect(asset.size).toEqual(100);
	});
});
