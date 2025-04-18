const hre = require("hardhat");

async function main() {
  const GreenLedger = await hre.ethers.getContractFactory("GreenLedger");
  const greenLedger = await GreenLedger.deploy();

  await greenLedger.waitForDeployment();
  console.log(`✅ GreenLedger deployed at: ${greenLedger.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
