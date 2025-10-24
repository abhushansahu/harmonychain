const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of HarmonyChain contracts...");

  // Get the contract factories
  const MusicRegistry = await hre.ethers.getContractFactory("MusicRegistry");
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const RoyaltyDistributor = await hre.ethers.getContractFactory("RoyaltyDistributor");
  const GovernanceDAO = await hre.ethers.getContractFactory("GovernanceDAO");

  // Deploy MusicRegistry
  console.log("📝 Deploying MusicRegistry...");
  const musicRegistry = await MusicRegistry.deploy();
  await musicRegistry.waitForDeployment();
  const musicRegistryAddress = await musicRegistry.getAddress();
  console.log("✅ MusicRegistry deployed to:", musicRegistryAddress);

  // Deploy NFTMarketplace
  console.log("🎨 Deploying NFTMarketplace...");
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.waitForDeployment();
  const nftMarketplaceAddress = await nftMarketplace.getAddress();
  console.log("✅ NFTMarketplace deployed to:", nftMarketplaceAddress);

  // Deploy RoyaltyDistributor
  console.log("💰 Deploying RoyaltyDistributor...");
  const royaltyDistributor = await RoyaltyDistributor.deploy(musicRegistryAddress);
  await royaltyDistributor.waitForDeployment();
  const royaltyDistributorAddress = await royaltyDistributor.getAddress();
  console.log("✅ RoyaltyDistributor deployed to:", royaltyDistributorAddress);

  // Deploy GovernanceDAO
  console.log("🗳️ Deploying GovernanceDAO...");
  const governanceDAO = await GovernanceDAO.deploy();
  await governanceDAO.waitForDeployment();
  const governanceDAOAddress = await governanceDAO.getAddress();
  console.log("✅ GovernanceDAO deployed to:", governanceDAOAddress);

  // Add some initial DAO members
  console.log("👥 Adding initial DAO members...");
  const [deployer] = await hre.ethers.getSigners();
  await governanceDAO.addMember(deployer.address, 10000);
  console.log("✅ Added deployer as DAO member with 10000 voting power");

  // Verify contracts on Harmony Explorer (if not localhost)
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("🔍 Verifying contracts on Harmony Explorer...");
    
    try {
      await hre.run("verify:verify", {
        address: musicRegistryAddress,
        constructorArguments: [],
      });
      console.log("✅ MusicRegistry verified");
    } catch (error) {
      console.log("❌ MusicRegistry verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: nftMarketplaceAddress,
        constructorArguments: [],
      });
      console.log("✅ NFTMarketplace verified");
    } catch (error) {
      console.log("❌ NFTMarketplace verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: royaltyDistributorAddress,
        constructorArguments: [musicRegistryAddress],
      });
      console.log("✅ RoyaltyDistributor verified");
    } catch (error) {
      console.log("❌ RoyaltyDistributor verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: governanceDAOAddress,
        constructorArguments: [],
      });
      console.log("✅ GovernanceDAO verified");
    } catch (error) {
      console.log("❌ GovernanceDAO verification failed:", error.message);
    }
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contracts: {
      MusicRegistry: musicRegistryAddress,
      NFTMarketplace: nftMarketplaceAddress,
      RoyaltyDistributor: royaltyDistributorAddress,
      GovernanceDAO: governanceDAOAddress,
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  console.log("\n📋 Deployment Summary:");
  console.log("====================");
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Chain ID: ${deploymentInfo.chainId}`);
  console.log(`Deployer: ${deploymentInfo.deployer}`);
  console.log("\nContract Addresses:");
  console.log(`MusicRegistry: ${deploymentInfo.contracts.MusicRegistry}`);
  console.log(`NFTMarketplace: ${deploymentInfo.contracts.NFTMarketplace}`);
  console.log(`RoyaltyDistributor: ${deploymentInfo.contracts.RoyaltyDistributor}`);
  console.log(`GovernanceDAO: ${deploymentInfo.contracts.GovernanceDAO}`);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("💡 Don't forget to update your environment variables with the new contract addresses.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
