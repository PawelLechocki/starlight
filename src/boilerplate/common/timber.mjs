import axios from 'axios';
import config from 'config';
import { getContractAddress } from './contract.mjs';
import logger from './logger.mjs';
// rough draft of timber service - we may not need treeids but kept in just in case
const { url } = config.merkleTree;
export const startEventFilter = async (contractName, address) => {
	try {
		// const treeId = functionName;
		const contractId = address;
		let contractAddress = address;
		if (!contractAddress) {
			contractAddress = await getContractAddress(contractName);
		}
		logger.http(
			`\nCalling /start for '${contractName}' tree and address '${contractAddress}'`
		);
		logger.info(`Using startEventFilter with ${contractAddress}, ${contractName}, ${contractId}`)
		const response = await axios.post(
			`${url}/start`,
			{
				contractAddress,
				contractName,
				contractId
				//treeId
			},
			{
				timeout: 3600000,
			}
		);
		logger.http('Timber Response:', response.data.data);
		return response.data.data;
	} catch (error) {
		throw new Error(error);
	}
};
export const getLeafIndex = async (contractName, leafValue, address, contractId) => {
	logger.http(
		`\nCalling /leaf/value for leafValue ${leafValue} of ${contractName} tree`
	);
	if (!contractId) {
		// eslint-disable-next-line no-param-reassign
		address = await getContractAddress(contractName);
	}	
	const value = leafValue.toString();
	// const treeId = functionName;
	const contractAddress = address;
	let leafIndex;
	let errorCount = 0;
	while (errorCount < 20) {
		try {
			logger.info(`Using getLeafIndex with ${contractName}, ${leafValue}, ${address}, ${contractId}`)
			const response = await axios.get(
				`${url}/leaf/value`,
				{
					data: {
						contractAddress,
						contractName,
						// treeId,
						value,
						contractId
					},
				},
				{
					timeout: 3600000,
				}
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
			await new Promise((resolve) => setTimeout(() => resolve(), 3000));
		}
	}
	return leafIndex;
};
export const getRoot = async (contractName, address) => {
	// const treeId = functionName;
	logger.http(`\nCalling /update for ${contractName} tree`);
	try {
		const contractId = address;
		let contractAddress = address;
		if (!contractAddress) {
			contractAddress = await getContractAddress(contractName);
		}

		logger.info(`Using getRoot with ${contractAddress}, ${contractName}, ${contractId}`);


		const response = await axios.patch(
			`${url}/update`,
			{
				contractAddress,
				contractName,
				// treeId,
				contractId
			},
			{
				timeout: 3600000,
			}
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
	logger.info(`Using getSiblingPath with ${contractName}, ${contractId}`)
	let contractAddress = contractId;
	logger.info('trying to fetch contract address with getContractAddress() (pls get rid of this)')
	if (!contractId) {
		contractAddress = await getContractAddress(contractName);
	}	

	if (leafIndex === undefined) {
		if (!leafValue) throw new Error(`No leafIndex xor leafValue specified.`);
		// eslint-disable-next-line no-param-reassign
		leafIndex = await getLeafIndex(contractName, leafValue, contractAddress, contractId);
	}
	let siblingPath;
	let errorCount = 0;
	while (errorCount < 20) {
		try {
			logger.info(`Sending a getSiblingPath request with ${contractName}, ${contractAddress}, ${contractId}`)

			const response = await axios.get(
				`${url}/siblingPath/${leafIndex}`, //
				{
					data: {
						contractAddress,
						contractName,
						// treeId,
						contractId
					},
				},
				{
					timeout: 360000,
				}
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
			await new Promise((resolve) => setTimeout(() => resolve(), 3000));
		}
	}
	return siblingPath;
};
export const getMembershipWitness = async (contractName, leafValue, contractId) => {
	logger.http(`\nCalling getMembershipWitness for ${contractName} tree`);
	logger.info(`Using getMembershipWitness with ${contractName}, ${leafValue}, ${contractId}`);
	try {
		const leafIndex = await getLeafIndex(contractName, leafValue, undefined, contractId);
		let path = await getSiblingPath(contractName, leafIndex, undefined, contractId);
		const root = path[0].value;
		path = path.map((node) => node.value);
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
