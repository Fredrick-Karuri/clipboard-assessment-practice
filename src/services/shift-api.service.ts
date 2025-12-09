import type { ShiftResponse, Shift } from "./types.ts";
export class ShiftApiService {
  constructor(private apiUrl: string) {}
  async fetchPage(page: number): Promise<ShiftResponse> {
    const response = await fetch(`${this.apiUrl}?page=${page}`);
    return (await response.json()) as ShiftResponse;
  }
  async fetchAllShifts(): Promise<Shift[]> {
    const firstPage = await this.fetchPage(1);
    const totalPages = firstPage.pagination.total_pages;

    let allShifts = [...firstPage.data];

    for (let page = 2; page <= totalPages; page++) {
      const pageData = await this.fetchPage(page);
      allShifts.push(...pageData.data);
    }
    return allShifts;
  }
}
