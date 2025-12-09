// src/scripts/fetch-scripts
import { PrismaClient } from "@prisma/client";
import { LoggerService } from "../services/logger.service.js";
import { ShiftApiService } from "../services/shift-api.service.js";
import { ShiftTransformerService } from "../services/shift-transformer.service.js";
import { ShiftRepositoryService } from "../services/shift-repository.service.js";

const API_URL = "http://localhost:3000/shifts";
const prisma = new PrismaClient();
const logger = new LoggerService();
const apiService = new ShiftApiService(API_URL);
const transformer = new ShiftTransformerService();
const repository = new ShiftRepositoryService(prisma);

async function fetchShifts() {
  try {
    logger.log("Starting fetching shifts");
    const shifts = await apiService.fetchAllShifts();
    logger.log(`Fetched ${shifts.length} shifts total`);

    const transformed = transformer.transformMany(shifts);
    logger.log("Transformed data for database");

    logger.log("Saving to database");
    const result = await repository.upsertMany(transformed);
    logger.log(`Processed ${result.length} shifts`);

    logger.log("Fetch complete!");
  } catch (error) {
    logger.error("✗ Error during fetch:", error);
    throw error;
  }
}

fetchShifts()
  .catch((error) => {
    logger.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
