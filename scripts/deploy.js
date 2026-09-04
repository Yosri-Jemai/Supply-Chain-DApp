import hre from "hardhat";

async function main() {
  const { ethers } = await hre.network.connect();

  const Tracking = await ethers.getContractFactory("Tracking");

  const tracking = await Tracking.deploy();

  await tracking.waitForDeployment();

  console.log(`Tracking deployed to: ${await tracking.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//0x5FbDB2315678afecb367f032d93F642f64180aa3