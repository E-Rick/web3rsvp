import { ethers } from "hardhat";

const main = async () => {
  const rsvpContractFactory = await ethers.getContractFactory("Web3RSVP");
  const rsvpContract = await rsvpContractFactory.deploy();
  await rsvpContract.deployed();
  console.log("Contract deployed to:", rsvpContract.address);

  // Simulate different wallets interacting with contract. Get deployer wallet address and couple others for testing
  const [deployer, address1, address2] = await ethers.getSigners();

  // 1. Test creating a new event. Define the event data we are going to use. Use an IPFS CID
  let deposit = ethers.utils.parseEther("1");
  let maxCapacity = 3;
  let timestamp = 1718926200; // unixtimestamp. sequence of chars encoded information identifying when a certain event occured
  let eventDataCID =
    "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";


  // Create new event with mock data. Once transaction is done, txt.wait will return the data about the transaction
  // including an array of emitted events which we can log to console.
  let txn = await rsvpContract.createNewEvent(
    timestamp,
    deposit,
    maxCapacity,
    eventDataCID
  );
  let wait = await txn.wait();
  console.log("NEW EVENT CREATED:", wait.events[0].event, wait.events[0].args);

  let eventID = wait.events[0].args.eventID;
  console.log("EVENT ID:", eventID);

  txn = await rsvpContract.createNewRSVP(eventID, { value: deposit });
  wait = await txn.wait();
  console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args);

  txn = await rsvpContract
    .connect(address1)
    .createNewRSVP(eventID, { value: deposit });
  wait = await txn.wait();
  console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args);

  txn = await rsvpContract
    .connect(address2)
    .createNewRSVP(eventID, { value: deposit });
  wait = await txn.wait();
  console.log("NEW RSVP:", wait.events[0].event, wait.events[0].args);


  // ---- Confirm attendees
  // Call from deployer address too
  txn = await rsvpContract.confirmAllAttendees(eventID);
  wait = await txn.wait();
  wait.events.forEach((event) =>
    console.log("CONFIRMED:", event.args.attendeeAddress)
  );


  // wait 10 years
  await hre.network.provider.send("evm_increaseTime", [15778800000000]);

  txn = await rsvpContract.withdrawUnclaimedDeposits(eventID);
  wait = await txn.wait();
  console.log("WITHDRAWN:", wait.events[0].event, wait.events[0].args);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
