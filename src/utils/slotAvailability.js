/**
 * slotAvailability.js
 * Real-time discovery call slot availability tracker for Jeeshan Purohit Studio.
 * Lets users know at what time Jeeshan is free or already booked for a Google Meet.
 */

const STORAGE_KEY = "jeeshan_booked_meeting_slots";

export const STANDARD_SLOTS = [
  { time: "11:00", label: "11:00 AM", period: "Morning Discovery" },
  { time: "13:30", label: "01:30 PM", period: "Afternoon Strategy" },
  { time: "15:00", label: "03:00 PM", period: "Prime Studio Sprint" },
  { time: "17:00", label: "05:00 PM", period: "Evening Review" },
  { time: "19:30", label: "07:30 PM", period: "Global Sync (US / EU)" }
];

// Seed sample upcoming commitments so other visitors see realistic schedule
function getInitialBookedSlots() {
  const today = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const formatDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  return [
    {
      id: "JP-CONF-01",
      date: formatDate(tomorrow),
      time: "11:00",
      clientName: "Metronix Brand Direction",
      type: "STUDIO_ENGAGED"
    },
    {
      id: "JP-CONF-02",
      date: formatDate(dayAfter),
      time: "17:00",
      clientName: "Motion Simulation Review",
      type: "STUDIO_ENGAGED"
    }
  ];
}

/**
 * Retrieves all booked slots from local storage with initial seeds
 */
export function getAllBookedSlots() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialBookedSlots();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Could not read booked slots:", err);
    return getInitialBookedSlots();
  }
}

/**
 * Returns an array of booked time strings (e.g. ['11:00', '15:00']) for a specific date
 */
export function getBookedSlotsForDate(dateStr) {
  if (!dateStr) return [];
  const all = getAllBookedSlots();
  return all.filter((s) => s.date === dateStr).map((s) => s.time);
}

/**
 * Checks if a specific date and time slot is already booked
 */
export function isSlotBooked(dateStr, timeStr) {
  if (!dateStr || !timeStr) return false;
  const booked = getBookedSlotsForDate(dateStr);
  return booked.includes(timeStr);
}

/**
 * Books a new slot and notifies listeners across the page
 */
export function bookSlot({ date, time, clientName = "Client", projectScope = "Discovery", queryId }) {
  if (!date || !time) return false;
  const all = getAllBookedSlots();

  // Check duplicate
  const exists = all.some((s) => s.date === date && s.time === time);
  if (!exists) {
    all.push({
      id: queryId || `JP-MEET-${Date.now().toString(36).toUpperCase()}`,
      date,
      time,
      clientName,
      projectScope,
      bookedAt: new Date().toISOString()
    });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent("jeeshan_slots_updated", { detail: { date, time } }));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  }
  return true;
}

/**
 * Computes availability status for all standard slots on a given date
 */
export function getSlotsAvailability(dateStr) {
  const bookedTimes = getBookedSlotsForDate(dateStr);
  return STANDARD_SLOTS.map((slot) => {
    const isBooked = bookedTimes.includes(slot.time);
    return {
      ...slot,
      isBooked,
      status: isBooked ? "BOOKED" : "AVAILABLE"
    };
  });
}
