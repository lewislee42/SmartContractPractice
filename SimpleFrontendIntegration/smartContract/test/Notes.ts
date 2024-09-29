import { expect } from "chai"; 
import hre from "hardhat";

describe("Notes", function () {
	async function deployment() {
		const [owner, etherAccount] = await hre.ethers.getSigners();
		const Notes = await hre.ethers.getContractFactory("Notes");
		const notes = await Notes.deploy();
		return { notes, owner, etherAccount };
	}

	describe("Writting Note", async function () {
		it("Should write a note successfully", async function () {
			const { notes } = await deployment();
			const testPhrase = "TESTING"

			await notes.writeNote(testPhrase);
			expect(await notes.checkOwnNote()).to.equal(testPhrase);
		});
	});
});
