import type { AppData } from "./types";

export const DEMO_PASSWORD = "bu2024";

export function getSeedData(): AppData {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    users: [
      {
        id: "student-1",
        email: "student@bennett.edu.in",
        password: DEMO_PASSWORD,
        name: "Rahul Sharma",
        role: "student",
        enrollmentNo: "BU22CS001",
        hostel: "Boys Hostel A",
        roomNo: "204",
        phone: "+91 98765 43210",
        bagId: "bag-1",
        slipNo: "SLIP-2024-0847",
      },
      {
        id: "student-2",
        email: "priya@bennett.edu.in",
        password: DEMO_PASSWORD,
        name: "Priya Verma",
        role: "student",
        enrollmentNo: "BU22EC045",
        hostel: "Girls Hostel B",
        roomNo: "312",
        phone: "+91 98765 43211",
      },
      {
        id: "team-1",
        email: "laundry@bennett.edu.in",
        password: DEMO_PASSWORD,
        name: "Laundry Team",
        role: "team",
        phone: "+91 98765 00000",
      },
    ],
    slots: [
      { id: "slot-1", day: "Monday", time: "8:00 AM - 10:00 AM", maxBags: 50, booked: 32 },
      { id: "slot-2", day: "Wednesday", time: "2:00 PM - 4:00 PM", maxBags: 50, booked: 18 },
      { id: "slot-3", day: "Friday", time: "10:00 AM - 12:00 PM", maxBags: 50, booked: 41 },
      { id: "slot-4", day: "Saturday", time: "9:00 AM - 11:00 AM", maxBags: 40, booked: 12 },
    ],
    bags: [
      {
        id: "bag-1",
        slipNo: "SLIP-2024-0847",
        studentId: "student-1",
        studentName: "Rahul Sharma",
        hostel: "Boys Hostel A",
        roomNo: "204",
        status: "ironing",
        slotId: "slot-1",
        submittedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expectedReadyAt: tomorrow.toISOString(),
        itemCount: 12,
        notes: "Handle delicates with care",
      },
      {
        id: "bag-2",
        slipNo: "SLIP-2024-0851",
        studentId: "student-2",
        studentName: "Priya Verma",
        hostel: "Girls Hostel B",
        roomNo: "312",
        status: "ready",
        slotId: "slot-2",
        submittedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        expectedReadyAt: now.toISOString(),
        itemCount: 8,
      },
    ],
    complaints: [
      {
        id: "complaint-1",
        studentId: "student-1",
        studentName: "Rahul Sharma",
        bagId: "bag-1",
        type: "unironed",
        subject: "Shirt not properly ironed",
        description: "My formal white shirt came back with visible creases on the collar.",
        status: "in_progress",
        photos: [],
        messages: [
          {
            id: "msg-1",
            senderId: "student-1",
            senderName: "Rahul Sharma",
            senderRole: "student",
            message: "The collar area is still wrinkled. Please re-iron.",
            timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "msg-2",
            senderId: "team-1",
            senderName: "Laundry Team",
            senderRole: "team",
            message: "We have noted your concern. The shirt will be re-ironed and ready by 4 PM today.",
            timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
          },
        ],
        createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      },
    ],
    reapplyRequests: [],
  };
}
