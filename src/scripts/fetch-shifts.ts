import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()

const API_URL = "http://localhost:3000/shifts"

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

async function fetchShifts() {
    console.log("Starting fetching shifts ...")
    // logic 
    /*
     1.Fetch the first page to know how many total pages exist
     2.Loop through all pages
    */
   const response = await fetch(`${API_URL}?page=1`)
   const firstPage:ShiftResponse = await response.json()
   const totalPages = firstPage.pagination.total_pages

   console.log (`Total Pages ${firstPage.pagination.total_pages}`)
   console.log(`Total items ${firstPage.pagination.total_items}`)

   let all_shifts = [...firstPage.data]

   for (let page = 2;page<= totalPages; page++){
    console.log(`Fetching page ${page}/${totalPages} ...`)
    const response = await fetch (`${API_URL}?page=${page}`)
    const pageData :ShiftResponse= await response.json() 
    all_shifts.push(... pageData.data)
   }
   console.log (`Fetched ${all_shifts.length} shifts total `)

   

    console.log("Fetch complete")
    
}

fetchShifts()
.catch((error) =>{
    console.error("Error:", error)
    process.exit(1)
})
.finally(async () =>{
    await prisma.$disconnect()
})