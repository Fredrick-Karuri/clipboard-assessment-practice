import type { PrismaClient } from "@prisma/client";

export class ShiftRepositoryService {
  constructor(private prisma: PrismaClient) {}

  async upsertMany(shifts: any[]) {
    return await this.prisma.$transaction(
      shifts.map((shift) =>
        this.prisma.shift.upsert({
          where: { id: shift.id },
          update: shift,
          create: shift,
        })
      )
    );
  }
}
