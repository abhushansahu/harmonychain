const { ethers } = require("hardhat");

async function main() {
  console.log("Starting HarmonyChain contract deployment...");

  // Get the contract factories
  const MusicRegistry = await ethers.getContractFactory("MusicRegistry");
  const LicenseManager = await ethers.getContractFactory("LicenseManager");
  const RoyaltyDistributor = await ethers.getContractFactory("RoyaltyDistributor");
  const GovernanceDAO = await ethers.getContractFactory("GovernanceDAO");

  // Deploy MusicRegistry
  console.log("Deploying MusicRegistry...");
  const musicRegistry = await MusicRegistry.deploy();
  await musicRegistry.deployed();
  console.log("MusicRegistry deployed to:", musicRegistry.address);

  // Deploy LicenseManager (requires payment token and treasury)
  // For now, we'll use a mock USDC token address
  const mockUSDC = "0xA0b86a33E6441c8C3C7B8C4C8C8C8C8C8C8C8C8C8"; // Mock USDC address
  const treasury = "0x1234567890123456789012345678901234567890"; // Treasury address

  console.log("Deploying LicenseManager...");
  const licenseManager = await LicenseManager.deploy(mockUSDC, treasury);
  await licenseManager.deployed();
  console.log("LicenseManager deployed to:", licenseManager.address);

  // Deploy RoyaltyDistributor
  console.log("Deploying RoyaltyDistributor...");
  const royaltyDistributor = await RoyaltyDistributor.deploy(mockUSDC, treasury);
  await royaltyDistributor.deployed();
  console.log("RoyaltyDistributor deployed to:", royaltyDistributor.address);

  // Deploy GovernanceDAO (requires governance token)
  const mockGovernanceToken = "0xB0c86a33E6441c8C3C7B8C4C8C8C8C8C8C8C8C8C8"; // Mock governance token
  console.log("Deploying GovernanceDAO...");
  const governanceDAO = await GovernanceDAO.deploy(mockGovernanceToken);
  await governanceDAO.deployed();
  console.log("GovernanceDAO deployed to:", governanceDAO.address);

  // Set up initial configurations
  console.log("Setting up initial configurations...");

  // Set track owners in LicenseManager (for testing)
  await licenseManager.setTrackOwner(1, ethers.constants.AddressZero);
  await licenseManager.setTrackOwner(2, ethers.constants.AddressZero);

  console.log("Deployment completed successfully!");
  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("MusicRegistry:", musicRegistry.address);
  console.log("LicenseManager:", licenseManager.address);
  console.log("RoyaltyDistributor:", royaltyDistributor.address);
  console.log("GovernanceDAO:", governanceDAO.address);
  console.log("\n=== NEXT STEPS ===");
  console.log("1. Verify contracts on block explorer");
  console.log("2. Update frontend with contract addresses");
  console.log("3. Set up IPFS node");
  console.log("4. Configure API endpoints");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
