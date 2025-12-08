import { createServer, type IncomingMessage,  type ServerResponse } from "http";

const TOTAL_SHIFTS = 237;
const PER_PAGE = 100;

const generateShift = (id: number) => ({
  id: `shift_${id}`,
  facility_id: `fac_${Math.floor(id / 10)}`,
  worker_id: Math.random() > 0.2 ? `worker_${id % 50}` : null,
  start_time: new Date(2024, 11, 10, 8, 0).toISOString(),
  end_time: new Date(2024, 11, 10, 16, 0).toISOString(),
  profession: ["CNA", "LVN", "RN"][id % 3],
  is_deleted: false,
});

const server = createServer((req:IncomingMessage, res:ServerResponse) => {
  const url = new URL(req.url!, `http://localhost:3000`);
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "100");

  if (url.pathname === "/shifts") {
    const start = (page - 1) * limit;
    const end = Math.min(start + limit, TOTAL_SHIFTS);
    const data = Array.from({ length: end - start }, (_, i) =>
      generateShift(start + i + 1)
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        data,
        pagination: {
          page,
          total_pages: Math.ceil(TOTAL_SHIFTS / limit),
          total_items: TOTAL_SHIFTS,
        },
      })
    );
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000, () =>{
    console.log("Mock api server running on  http://localhost:3000")
    console.log("Try :http://localhost:3000/shifts?page=1")
})