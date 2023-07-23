import axios from 'axios';
import config from 'config';
import { getContractAddress } from './contract.mjs';
import logger from './logger.mjs';
// rough draft of timber service - we may not need treeids but kept in just in case
const { url } = config.merkleTree;
export const startEventFilter = async (contractName, contractAddress, contractId, block) => {
  try {
    // const treeId = functionName;
    logger.debug(
			`Using startEventFilter with ${contractName}, ${contractId}, ${contractAddress}, ${block}`
		);

    logger.http(
      `\nCalling /start for '${contractName}' tree and contractId ${contractId}, ${contractAddress}, ${block}'`
    );
    const response = await axios.post(
      `${url}/start`,
      {
        contractAddress,
        contractName,
        contractId,
				block
      },
      {
        timeout: 3600000,
      },
    );
    logger.http('Timber Response:', response.data.data);
    return response.data.data;
  } catch (error) {
    throw new Error(error);
  }
};
export const getLeafIndex = async (contractName, leafValue, contractId) => {
  logger.http(
    `\nCalling /leaf/value for leafValue ${leafValue} of ${contractName} tree`,
  );
  
  const value = leafValue.toString();
  // const treeId = functionName;

  let leafIndex;
  let errorCount = 0;
  while (errorCount < 20) {
    try {

      logger.debug(
				`Using getLeafIndex with ${contractName}, ${leafValue}, ${contractId}`
			);

      const response = await axios.get(
        `${url}/leaf/value`,
        {
          data: {
      
            contractName,
            // treeId,
            value,
            contractId,
          },
        },
        {
          timeout: 3600000,
        },
      );
      logger.http('Timber Response:', response.data.data);
      if (response.data.data !== null) {
        leafIndex = response.data.data.leafIndex;
        if (leafIndex) break;
        break;
      } else {
        throw new Error('leaf not found');
      }
    } catch (err) {
      errorCount++;
      logger.warn('Unable to get leaf - will try again in 3 seconds');
      await new Promise(resolve => setTimeout(() => resolve(), 3000));
    }
  }
  return leafIndex;
};
export const getRoot = async (contractName, contractId) => {
  // const treeId = functionName;
  logger.http(`\nCalling /update for ${contractName} tree`);
  try {
    logger.debug(
			`Using getRoot with ${contractId}, ${contractName}`
		);

    const response = await axios.patch(
      `${url}/update`,
      {

        contractName,
        contractId
      },
      {
        timeout: 3600000,
      },
    );
    logger.http('Timber Response:', response.data.data.latestRecalculation);
    if (response.data.data === null)
      throw new Error('\nNo record found in Timber');
    return response.data.data.latestRecalculation.root;
  } catch (error) {
    throw new Error(error);
  }
};
export const getSiblingPath = async (contractName, leafIndex, leafValue, contractId) => {
  logger.http(`\nCalling /siblingPath/${leafIndex} for ${contractName} tree`);
  // const treeId = functionName;
  logger.debug(`Using getSiblingPath with ${contractName}, ${contractId}`);

  if (leafIndex === undefined) {
    if (!leafValue) throw new Error(`No leafIndex xor leafValue specified.`);
    // eslint-disable-next-line no-param-reassign
    leafIndex = await getLeafIndex(contractName, leafValue, contractId);
  }
  let siblingPath;
  let errorCount = 0;
  while (errorCount < 20) {
    try {
      logger.debug(
				`Sending a getSiblingPath request with ${contractName}, ${contractId}`
			);

      const response = await axios.get(
        `${url}/siblingPath/${leafIndex}`, //
        {
          data: {
            contractName,
            contractId
            // treeId,
          },
        },
        {
          timeout: 360000,
        },
      );
      if (response.data.data !== null) {
        siblingPath = response.data.data;
        if (siblingPath) break;
        break;
      } else {
        throw new Error('leaf not found');
      }
    } catch (err) {
      errorCount++;
      logger.warn('Unable to get leaf - will try again in 3 seconds');
      await new Promise(resolve => setTimeout(() => resolve(), 3000));
    }
  }
  return siblingPath;
};
export const getMembershipWitness = async (contractName, leafValue, contractId) => {
  logger.http(`\nCalling getMembershipWitness for ${contractName} tree`);

  logger.debug(
		`Using getMembershipWitness with ${contractName}, ${leafValue}, ${contractId}`
	);
  try {
    const leafIndex = await getLeafIndex(contractName, leafValue, contractId);
    let path = await getSiblingPath(contractName, leafIndex, leafValue, contractId);
    const root = path[0].value;
    path = path.map(node => node.value);
    path.splice(0, 1);
    const witness = { index: leafIndex, path, root };
    return witness;
  } catch (error) {
    throw new Error(error);
  }
};
export default {
  getLeafIndex,
  getRoot,
  getSiblingPath,
  getMembershipWitness,
};
