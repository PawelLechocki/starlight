import { service_add } from "./api_services.mjs";

import { service_remove } from "./api_services.mjs";

import {
	service_allCommitments,
	service_getCommitmentsByState,
} from "./api_services.mjs";

import express from "express";

const router = express.Router();

// eslint-disable-next-line func-names
router.post("/add", service_add);

// eslint-disable-next-line func-names
router.post("/remove", service_remove);

// commitment getter routes
router.get("/getAllCommitments", service_allCommitments);
router.get("/getCommitmentsByVariableName", service_getCommitmentsByState);

export default router;
