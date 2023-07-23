import mongo from "./mongo.mjs";
import config from "config";
import axios from "axios";
import logger from "./logger.mjs";

const { MONGO_URL, COMMITMENTS_DB, INFO_COLLECTION } = config;

export default async function getContractInfo(contractId) {
  // Connect to the DB
  const connection = await mongo.connection(MONGO_URL);
  const db = connection.db(COMMITMENTS_DB);

  const info = await db.collection(`${INFO_COLLECTION}_${contractId}`).findOne({
    contractId: contractId,
  });

  // Check if doc exists in zapp's mongo
  if (info) {
    return info;
  } else {
    logger.debug("Contract info entry not detected. Fetching from API.");
    const contractInfo = await axios.get(process.env.CONTRACT_API_ENDPOINT + contractId);
    const info = {
      contractId: contractId,
      contractAddress: contractInfo.data.address,
      deploymentBlock: contractInfo.data.deploymentBlock,
      network: contractInfo.data.network,
    };
    await db.collection(`${INFO_COLLECTION}_${contractId}`).insertOne(info);
    return info;
  }
}