const ProductNFT = artifacts.require("ProductNFT");
const MarketplaceEscrow = artifacts.require("MarketplaceEscrow");

module.exports = async function (deployer) {
  // 1. ลงสัญญา NFT
  await deployer.deploy(ProductNFT);
  const nft = await ProductNFT.deployed();

  // 2. ลงสัญญา Escrow และผูกกับ NFT
  await deployer.deploy(MarketplaceEscrow, nft.address);
};