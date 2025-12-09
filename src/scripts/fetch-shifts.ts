// src/scripts/fetch-scripts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const API_URL = "http://localhost:3000/shifts";

interface Shift {
  id: string;
  facility_id: string;
  worker_id?: string;
  start_time: string;
  end_time: string;
  profession: "CNA" | "LVN" | "RN";
  is_deleted: boolean;
}

interface ShiftResponse {
  data: Shift[];
  pagination: {
    page: number;
    total_pages: number;
    total_items: number;
  };
}

// logic
/*
   1.Fetch the first page to know how many total pages exist
   2.Loop through all pages
   3.Transform api data to prisma format
   4.Save to database
   5.Add proper error handling
  */
async function fetchShifts() {
  try {
    console.log("Starting fetching shifts ...");
    const response = await fetch(`${API_URL}?page=1`);
    const firstPage: ShiftResponse = (await response.json()) as ShiftResponse;
    const totalPages = firstPage.pagination.total_pages;

    console.log(`Total Pages ${firstPage.pagination.total_pages}`);
    console.log(`Total items ${firstPage.pagination.total_items}`);

    let allShifts = [...firstPage.data];

    for (let page = 2; page <= totalPages; page++) {
      console.log(`Fetching page ${page}/${totalPages} ...`);
      const response = await fetch(`${API_URL}?page=${page}`);
      const pageData: ShiftResponse = (await response.json()) as ShiftResponse;
      allShifts.push(...pageData.data);
    }
    console.log(`Fetched ${allShifts.length} shifts total `);

    const transformedShifts = allShifts.map((shift) => ({
      id: shift.id,
      facilityId: shift.facility_id,
      workerId: shift.worker_id as string,
      startTime: shift.start_time,
      endTime: shift.end_time,
      profession: shift.profession,
      isDeleted: shift.is_deleted,
    }));
    console.log("Transoformed data for database");

    console.log("Saving to database");
    const result = await prisma.$transaction(
      transformedShifts.map((shift) =>
        prisma.shift.upsert({
          where: { id: shift.id },
          update: shift,
          create: shift,
        })
      )
    );
    console.log(`Processed ${result.length} shifts.`);

    console.log("Fetch complete");
  } catch (error) {
    console.error("✗ Error during fetch:",error)
    throw error
  }
}

fetchShifts()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
