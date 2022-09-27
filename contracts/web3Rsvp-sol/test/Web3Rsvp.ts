import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Contract, ContractFactory } from 'ethers';
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Sign } from "crypto";

describe("Web3Rsvp", () => {
  let deployer: SignerWithAddress
  let wallet1: SignerWithAddress
  let wallet2: SignerWithAddress
  let Web3RsvpContract: Contract
  let Web3RsvpContractFactory: ContractFactory

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneEventWeb3RsvpFixture() {
    // 1. Test creating a new event. Define the event data we are going to use. Use an IPFS CID
    const deposit = ethers.utils.parseEther("1");
    const MAX_CAPACITY = 3;
    const TIMESTAMP = 1718926200; // unixtimestamp. sequence of chars encoded information identifying when a certain event occured
    const eventDataCID = "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";

    // Simulate different wallets interacting with contract. Get deployer wallet address and couple others for testing
    // Contracts are deployed using the first signer/account by default
    [deployer, wallet1, wallet2] = await ethers.getSigners();

    Web3RsvpContractFactory = await ethers.getContractFactory("Web3RSVP");
    Web3RsvpContract = await Web3RsvpContractFactory.deploy();
    // await rsvpContract.deployed();

    return { Web3RsvpContract, deployer, wallet1, wallet2, eventDataCID, MAX_CAPACITY, deposit }
  }


  describe("Create new RSVP", function () {
    it("Create 3 new RSVPs", async function () {
      const { rsvpContract, deployer, wallet, wallet2, eventDataCID, deposit, MAX_CAPACITY } = await loadFixture(deployOneEventWeb3RsvpFixture);

      expect(await rsvpContract.createNewEvent(eventDataCID, { value: deposit }, MAX_CAPACITY).to.equal())

      expect(await rsvpContract.address)
      expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Should set the right owner", async function () {
      const { lock, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      const { lock, lockedAmount } = await loadFixture(
        deployOneYearLockFixture
      );

      expect(await ethers.provider.getBalance(lock.address)).to.equal(
        lockedAmount
      );
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      // We don't use the fixture here because we want a different deployment
      const latestTime = await time.latest();
      const Lock = await ethers.getContractFactory("Lock");
      await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
        "Unlock time should be in the future"
      );
    });
  });

  // describe("Confirm Attendee")


  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
