import type { Shift } from "./types.js";
export class ShiftTransformerService {
  transform(shift: Shift) {
    return {
      id: shift.id,
      facilityId: shift.facility_id,
      workerId: shift.worker_id as string,
      startTime: shift.start_time,
      endTime: shift.end_time,
      profession: shift.profession,
      isDeleted: shift.is_deleted,
    };
  }
  transformMany(shifts:Shift[]){
    return shifts.map(shift => this.transform(shift))
  }
}
