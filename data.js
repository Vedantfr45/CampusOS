// ============================================================
// CAMPUS OS — Data & Geometry Layer
// ============================================================
// 1. ROOM_GEOMETRY : position & size of every box on every floor
// 2. ROOM_DATA     : name, type, colour and notes for every box
// 3. TIMETABLE     : Computer Engineering, Division A (batches A1 / A2 / A3)
// ============================================================

/**
 * 1. ROOM GEOMETRY — traced from the concept maps (SVG pixel units).
 * x / y = top-left corner, width / height = size, boundary = outer wall path.
 */
const ROOM_GEOMETRY = {
  // ---------------- GROUND FLOOR ----------------
  0: {
    viewBox: "0 0 988 328",
    boundary: "M 14,16 L 974,16 L 974,180 L 560,180 L 560,312 L 14,312 Z",
    rooms: {
      "AUDITORIUM":     { x: 14,  y: 16,  width: 173, height: 296 },
      "STAIRS-G-W":     { x: 187, y: 16,  width: 71,  height: 34  },
      "LIFT-G-W":       { x: 258, y: 16,  width: 60,  height: 24  },
      "WASHROOM-G":     { x: 318, y: 16,  width: 135, height: 44  },
      "WASHBINS-G":     { x: 453, y: 16,  width: 56,  height: 24  },
      "COLLEGE-OFFICE": { x: 509, y: 16,  width: 92,  height: 91  },
      "CHEM-LAB":       { x: 601, y: 16,  width: 117, height: 91  },
      "STAIRS-G-E":     { x: 718, y: 16,  width: 88,  height: 91  },
      "LAB-ADVANCE":    { x: 806, y: 16,  width: 168, height: 91  },
      "MACHINES-LAB":   { x: 187, y: 100, width: 137, height: 212 },
      "PRINCIPAL":      { x: 324, y: 100, width: 115, height: 95  },
      "CEO-OFFICE":     { x: 324, y: 195, width: 115, height: 117 },
      "LIFT-G-MAIN":    { x: 782, y: 156, width: 48,  height: 24  },
    }
  },

  // ---------------- FIRST FLOOR ----------------
  1: {
    viewBox: "0 0 956 402",
    boundary: "M 14,16 L 942,16 L 942,232 L 504,232 L 504,386 L 14,386 Z",
    rooms: {
      "STAFF-1":         { x: 14,  y: 16,  width: 137, height: 60  },
      "STAIRS-1-W":      { x: 151, y: 16,  width: 58,  height: 42  },
      "LIFT-1-W":        { x: 209, y: 16,  width: 50,  height: 36  },
      "WASHROOM-1":      { x: 259, y: 16,  width: 171, height: 55  },
      "NSS":             { x: 430, y: 16,  width: 100, height: 82  },
      "COMP-LAB-1":      { x: 530, y: 16,  width: 110, height: 82  },
      "COMP-LAB-2":      { x: 640, y: 16,  width: 115, height: 82  },
      "STAIRS-1-E":      { x: 755, y: 16,  width: 87,  height: 42  },
      "WORKSHOP":        { x: 842, y: 16,  width: 100, height: 121 },
      "HYDRAULIC-LAB":   { x: 14,  y: 76,  width: 90,  height: 78  },
      "SOIL-LAB":        { x: 14,  y: 154, width: 90,  height: 78  },
      "ELECTRIC-DC-LAB": { x: 14,  y: 232, width: 90,  height: 77  },
      "ELECTRIC-AC-LAB": { x: 14,  y: 309, width: 90,  height: 77  },
      "OPEN-SPACE":      { x: 145, y: 165, width: 72,  height: 185 },
      "DRAWING-HALL":    { x: 258, y: 165, width: 142, height: 221 },
      "STAFF-ROOM-1":    { x: 400, y: 232, width: 104, height: 154 },
      "LIFT-1-E":        { x: 826, y: 204, width: 52,  height: 28  },
    }
  },

  // ---------------- SECOND FLOOR ----------------
  2: {
    viewBox: "0 0 956 402",
    boundary: "M 14,16 L 942,16 L 942,232 L 510,232 L 510,386 L 14,386 Z",
    rooms: {
      "CS-DEPT":           { x: 14,  y: 16,  width: 137, height: 60  },
      "STAIRS-2-W":        { x: 151, y: 16,  width: 58,  height: 42  },
      "LIFT-2-W":          { x: 209, y: 16,  width: 50,  height: 36  },
      "WASHROOM-2":        { x: 259, y: 16,  width: 171, height: 55  },
      "EXAM-HALL":         { x: 430, y: 16,  width: 100, height: 82  },
      "ELECTRONICS-LAB-2": { x: 530, y: 16,  width: 110, height: 82  },
      "ELECTRONICS-LAB-1": { x: 640, y: 16,  width: 115, height: 82  },
      "STAIRS-2-E":        { x: 755, y: 16,  width: 87,  height: 42  },
      "COMP-LAB-3-4":      { x: 842, y: 16,  width: 100, height: 121 },
      "CR1":               { x: 14,  y: 76,  width: 90,  height: 78  },
      "CR2":               { x: 14,  y: 154, width: 90,  height: 78  },
      "CR3":               { x: 14,  y: 232, width: 90,  height: 77  },
      "CR4":               { x: 14,  y: 309, width: 90,  height: 77  },
      "PHYSICS-LAB":       { x: 173, y: 140, width: 99,  height: 110 },
      "MAC-LAB":           { x: 173, y: 250, width: 99,  height: 136 },
      "ELEC-LAB-6":        { x: 272, y: 140, width: 93,  height: 110 },
      "ELEC-LAB-5":        { x: 272, y: 250, width: 93,  height: 136 },
      "ELEC-LAB-4":        { x: 365, y: 232, width: 62,  height: 154 },
      "ELEC-LAB-3":        { x: 427, y: 232, width: 83,  height: 154 },
      "LIFT-2-E":          { x: 826, y: 204, width: 52,  height: 28  },
    }
  },

  // ---------------- THIRD FLOOR ----------------
  3: {
    viewBox: "0 0 956 402",
    boundary: "M 14,16 L 942,16 L 942,230 L 516,230 L 516,386 L 14,386 Z",
    rooms: {
      "IT-DEPT":        { x: 14,  y: 16,  width: 134, height: 62  },
      "STAIRS-3-W":     { x: 148, y: 16,  width: 60,  height: 43  },
      "LIFT-3-W":       { x: 208, y: 16,  width: 48,  height: 36  },
      "WASHROOM-3":     { x: 256, y: 16,  width: 182, height: 55  },
      "LIBRARY":        { x: 438, y: 16,  width: 316, height: 214 },
      "STAIRS-3-E":     { x: 754, y: 16,  width: 91,  height: 44  },
      "COMP-LAB-5-6":   { x: 845, y: 16,  width: 97,  height: 122 },
      "CR5":            { x: 14,  y: 78,  width: 90,  height: 78  },
      "CR6":            { x: 14,  y: 156, width: 90,  height: 79  },
      "CR7":            { x: 14,  y: 235, width: 90,  height: 80  },
      "CR8":            { x: 14,  y: 315, width: 90,  height: 71  },
      "APPLIED-MECH":   { x: 180, y: 143, width: 97,  height: 108 },
      "AUTOMOBILE-LAB": { x: 180, y: 251, width: 97,  height: 135 },
      "ROOM-3-BLANK":   { x: 277, y: 143, width: 95,  height: 243 },
      "LIBRARY-2":      { x: 372, y: 230, width: 144, height: 156 },
      "LIFT-3-E":       { x: 830, y: 203, width: 50,  height: 27  },
    }
  },

  // ---------------- FOURTH FLOOR ----------------
  4: {
    viewBox: "0 0 956 402",
    boundary: "M 14,16 L 942,16 L 942,232 L 518,232 L 518,386 L 14,386 Z",
    rooms: {
      "STAFF-4":        { x: 14,  y: 16,  width: 137, height: 60  },
      "STAIRS-4-W":     { x: 151, y: 16,  width: 58,  height: 42  },
      "LIFT-4-W":       { x: 209, y: 16,  width: 50,  height: 36  },
      "GIRLS-WASHROOM": { x: 259, y: 16,  width: 171, height: 55  },
      "CR17":           { x: 430, y: 16,  width: 103, height: 82  },
      "COMP-LAB-10":    { x: 533, y: 16,  width: 110, height: 82  },
      "COMP-LAB-9":     { x: 643, y: 16,  width: 113, height: 82  },
      "STAIRS-4-E":     { x: 756, y: 16,  width: 89,  height: 42  },
      "COMP-LAB-7-8":   { x: 845, y: 16,  width: 97,  height: 121 },
      "CR11":           { x: 14,  y: 76,  width: 90,  height: 78  },
      "CR12":           { x: 14,  y: 154, width: 90,  height: 78  },
      "CR13":           { x: 14,  y: 232, width: 90,  height: 77  },
      "CR14":           { x: 14,  y: 309, width: 90,  height: 77  },
      "CR16":           { x: 181, y: 142, width: 99,  height: 244 },
      "CR15":           { x: 280, y: 142, width: 93,  height: 244 },
      "UNKNOWN-2":      { x: 373, y: 232, width: 145, height: 154 },
      "LIFT-4-E":       { x: 830, y: 204, width: 51,  height: 28  },
    }
  }
};


/**
 * 2. ROOM DATA — names exactly as written on the concept maps.
 * type: "classroom" | "lab" | "office" | "utility"
 */
const STAIRS = f => ({ name: "Stairs", floor: f, type: "utility", color: "var(--c-stairs)", details: "Staircase connecting all floors" });
const LIFT   = f => ({ name: "Lift",   floor: f, type: "utility", color: "var(--c-lift)",   details: "Lift connecting all floors" });
const CR     = (n, f) => ({ name: "CR " + n, floor: f, type: "classroom", color: "var(--c-auditorium)", details: "Classroom " + n });
const LAB    = (name, f, details) => ({ name, floor: f, type: "lab", color: "var(--c-lab)", details: details || name });
const OFFICE = (name, f, details) => ({ name, floor: f, type: "office", color: "var(--c-office)", details: details || name });
const WASH   = (name, f) => ({ name, floor: f, type: "utility", color: "var(--c-washroom)", details: name });

const ROOM_DATA = {
  // --- GROUND FLOOR ---
  "AUDITORIUM":     { name: "Auditorium", floor: 0, type: "classroom", color: "var(--c-auditorium)", details: "Main college auditorium" },
  "STAIRS-G-W":     STAIRS(0),
  "LIFT-G-W":       LIFT(0),
  "WASHROOM-G":     WASH("Staff washroom", 0),
  "WASHBINS-G":     WASH("Washbins", 0),
  "COLLEGE-OFFICE": OFFICE("College office", 0, "College administrative office"),
  "CHEM-LAB":       { name: "Chemistry lab", floor: 0, type: "lab", color: "var(--c-lab-chem)", details: "Applied Chemistry laboratory" },
  "STAIRS-G-E":     STAIRS(0),
  "LAB-ADVANCE":    LAB("Lab advance", 0, "Advanced laboratory"),
  "MACHINES-LAB":   LAB("Machines lab", 0, "Machines laboratory"),
  "PRINCIPAL":      { name: "Principal office", floor: 0, type: "office", color: "var(--c-office-principal)", details: "Principal's office" },
  "CEO-OFFICE":     OFFICE("CEO office", 0, "Executive office"),
  "LIFT-G-MAIN":    { name: "Main lift", floor: 0, type: "utility", color: "var(--c-lift)", details: "Main lift near the entrance" },

  // --- FIRST FLOOR ---
  "STAFF-1":         OFFICE("Staff", 1, "Faculty staff room"),
  "STAIRS-1-W":      STAIRS(1),
  "LIFT-1-W":        LIFT(1),
  "WASHROOM-1":      WASH("Boys washroom", 1),
  "NSS":             OFFICE("NSS", 1, "National Service Scheme room"),
  "COMP-LAB-1":      LAB("Comp lab 1", 1, "Computer Laboratory 1"),
  "COMP-LAB-2":      LAB("Comp lab 2", 1, "Computer Laboratory 2"),
  "STAIRS-1-E":      STAIRS(1),
  "WORKSHOP":        LAB("Workshop", 1, "Engineering Workshop"),
  "HYDRAULIC-LAB":   LAB("Hydraulic lab", 1, "Hydraulics laboratory"),
  "SOIL-LAB":        LAB("Soil lab", 1, "Soil testing laboratory"),
  "ELECTRIC-DC-LAB": LAB("Electric DC lab", 1, "Electric DC laboratory"),
  "ELECTRIC-AC-LAB": LAB("Electric AC lab", 1, "Electric AC laboratory"),
  "OPEN-SPACE":      { name: "Open space", floor: 1, type: "utility", color: "#ffffff", details: "Central open space" },
  "DRAWING-HALL":    { name: "Drawing hall", floor: 1, type: "classroom", color: "var(--c-auditorium)", details: "Engineering drawing hall" },
  "STAFF-ROOM-1":    OFFICE("Staff room", 1, "Faculty staff room"),
  "LIFT-1-E":        LIFT(1),

  // --- SECOND FLOOR ---
  "CS-DEPT":           OFFICE("CS Dept", 2, "Computer department office"),
  "STAIRS-2-W":        STAIRS(2),
  "LIFT-2-W":          LIFT(2),
  "WASHROOM-2":        WASH("Girls washroom", 2),
  "EXAM-HALL":         { name: "Exam hall", floor: 2, type: "classroom", color: "var(--c-auditorium)", details: "Examination hall" },
  "ELECTRONICS-LAB-2": LAB("Electronics Lab 2", 2),
  "ELECTRONICS-LAB-1": LAB("Electronics Lab 1", 2),
  "STAIRS-2-E":        STAIRS(2),
  "COMP-LAB-3-4":      LAB("Comp Lab 3 & 4", 2, "Computer Laboratories 3 and 4"),
  "CR1": CR(1, 2), "CR2": CR(2, 2), "CR3": CR(3, 2), "CR4": CR(4, 2),
  "PHYSICS-LAB":       LAB("Physics lab", 2, "Applied Physics laboratory"),
  "MAC-LAB":           LAB("Mac lab", 2),
  "ELEC-LAB-6":        LAB("Elec lab 6", 2),
  "ELEC-LAB-5":        LAB("Elec lab 5", 2),
  "ELEC-LAB-4":        LAB("Elec Lab 4", 2),
  "ELEC-LAB-3":        LAB("Elec Lab 3", 2),
  "LIFT-2-E":          LIFT(2),

  // --- THIRD FLOOR ---
  "IT-DEPT":        OFFICE("IT Dept", 3, "IT department office"),
  "STAIRS-3-W":     STAIRS(3),
  "LIFT-3-W":       LIFT(3),
  "WASHROOM-3":     WASH("Boys washroom", 3),
  "LIBRARY":        { name: "Library", floor: 3, type: "classroom", color: "var(--c-auditorium)", details: "College library" },
  "STAIRS-3-E":     STAIRS(3),
  "COMP-LAB-5-6":   LAB("Comp lab 5 & 6", 3, "Computer Laboratories 5 and 6"),
  "CR5": CR(5, 3), "CR6": CR(6, 3), "CR7": CR(7, 3), "CR8": CR(8, 3),
  "APPLIED-MECH":   LAB("Applied mech", 3, "Engineering Mechanics laboratory"),
  "AUTOMOBILE-LAB": LAB("Automobile lab", 3),
  "ROOM-3-BLANK":   { name: "", floor: 3, type: "other", color: "#ffffff", details: "Not labelled on the concept map" },
  "LIBRARY-2":      { name: "Library", floor: 3, type: "classroom", color: "var(--c-auditorium)", details: "College library" },
  "LIFT-3-E":       LIFT(3),

  // --- FOURTH FLOOR ---
  "STAFF-4":        OFFICE("Staff", 4, "Faculty staff room"),
  "STAIRS-4-W":     STAIRS(4),
  "LIFT-4-W":       LIFT(4),
  "GIRLS-WASHROOM": WASH("Girls washroom", 4),
  "CR17":           CR(17, 4),
  "COMP-LAB-10":    LAB("Comp lab 10", 4, "Computer Laboratory 10"),
  "COMP-LAB-9":     LAB("Comp lab 9", 4, "Computer Laboratory 9"),
  "STAIRS-4-E":     STAIRS(4),
  "COMP-LAB-7-8":   LAB("Comp lab 7 & 8", 4, "Computer Laboratories 7 and 8"),
  "CR11": CR(11, 4), "CR12": CR(12, 4), "CR13": CR(13, 4), "CR14": CR(14, 4),
  "CR16": CR(16, 4), "CR15": CR(15, 4),
  "UNKNOWN-2":      { name: "Unknown 2", floor: 4, type: "other", color: "#ffffff", details: "Marked 'Unknown 2' on the concept map" },
  "LIFT-4-E":       LIFT(4),
};


/**
 * 3. TIMETABLE — Computer Engineering, Division A (w.e.f. 15 Sep 2026)
 * room = the box ID on the map where the lecture happens (null = not on the map yet).
 */
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const BATCHES = ["A1", "A2", "A3"];
const SLOTS = [
  "10:15 AM – 11:15 AM",
  "11:15 AM – 12:15 PM",
  "12:30 PM – 1:30 PM",
  "1:30 PM – 2:30 PM",
  "2:45 PM – 3:45 PM",
  "3:45 PM – 4:45 PM",
];
// A recess follows the slot at these indexes.
const RECESS_AFTER = { 1: "12:15 PM – 12:30 PM", 3: "2:30 PM – 2:45 PM" };

const SUBJECTS = {
  MATHS: { subject: "Applied Mathematics-I",                              who: "Prof. Aanchal Giri",       room: "CR13" },
  PHY:   { subject: "Applied Physics",                                    who: "Prof. Archana Warude",     room: "CR13" },
  CHEM:  { subject: "Applied Chemistry",                                  who: "Prof. Vrushali Choudhari", room: "CR13" },
  EM:    { subject: "Engineering Mechanics",                              who: "Prof. Santosh K",          room: "CR13" },
  BEEE:  { subject: "Basic Electrical and Electronics Engineering (BEEE)", who: "Prof. Janhavi Raut",       room: "CR13" },
  PCE:   { subject: "Professional & Communication Ethics (PCE)",          who: "Prof. Anil Bhatkar",       room: "CR13" },
  UHV:   { subject: "Induction cum Universal Human Values",               who: "Prof. Aanchal Giri",       room: "CR13" },
  CP:    { subject: "C Programming",                                      who: "Prof. Anamika Singh",      room: "CR13" },
  // Practicals
  PHY_P:  { subject: "Applied Physics Practical",   who: "Prof. Archana Warude",     room: "PHYSICS-LAB" },
  CHEM_P: { subject: "Applied Chemistry Practical", who: "Prof. Vrushali Choudhari", room: "CHEM-LAB" },
  EM_P:   { subject: "Engineering Mechanics Practical", who: "Prof. Santosh K",      room: "APPLIED-MECH" },
  BEEE_P: { subject: "BEEE Practical",              who: "Prof. Janhavi Raut",       room: "ELECTRONICS-LAB-1" },
  WS:     { subject: "Engineering Workshop-I (EW-1) / Computer Workshop", who: "Mr. Keshav Sonawane / Ms. Ankita Yadav", room: "WORKSHOP",
            note: "Computer Workshop is held in a Computer Lab instead (1st or 2nd floor, not confirmed)." },
  CP_P:   { subject: "C Programming Practical",     who: "Prof. Anamika Singh",      room: "COMP-LAB-7-8" },
};

// [day, slot index, batches, subject key]
const ALL = BATCHES;
const SCHEDULE = [
  // MONDAY
  ["Monday", 0, ALL, "MATHS"], ["Monday", 1, ALL, "BEEE"],
  ["Monday", 2, ["A1"], "BEEE_P"], ["Monday", 2, ["A2"], "WS"], ["Monday", 2, ["A3"], "EM_P"],
  ["Monday", 3, ["A1"], "BEEE_P"], ["Monday", 3, ["A2"], "WS"], ["Monday", 3, ["A3"], "EM_P"],
  ["Monday", 4, ["A1"], "CP_P"], ["Monday", 4, ["A3"], "PCE"],
  ["Monday", 5, ["A1"], "CP_P"],
  // TUESDAY
  ["Tuesday", 0, ALL, "EM"], ["Tuesday", 1, ALL, "BEEE"],
  ["Tuesday", 2, ["A1"], "EM_P"], ["Tuesday", 2, ["A2"], "BEEE_P"], ["Tuesday", 2, ["A3"], "WS"],
  ["Tuesday", 3, ["A1"], "EM_P"], ["Tuesday", 3, ["A2"], "BEEE_P"], ["Tuesday", 3, ["A3"], "WS"],
  ["Tuesday", 4, ["A1"], "PCE"], ["Tuesday", 4, ["A2"], "CP_P"],
  ["Tuesday", 5, ["A2"], "CP_P"],
  // WEDNESDAY
  ["Wednesday", 0, ALL, "PCE"], ["Wednesday", 1, ALL, "BEEE"],
  ["Wednesday", 2, ["A1"], "WS"], ["Wednesday", 2, ["A2"], "EM_P"], ["Wednesday", 2, ["A3"], "BEEE_P"],
  ["Wednesday", 3, ["A1"], "WS"], ["Wednesday", 3, ["A2"], "EM_P"], ["Wednesday", 3, ["A3"], "BEEE_P"],
  ["Wednesday", 4, ["A2"], "PCE"], ["Wednesday", 4, ["A3"], "CP_P"],
  ["Wednesday", 5, ["A3"], "CP_P"],
  // THURSDAY
  ["Thursday", 0, ["A1"], "MATHS"], ["Thursday", 0, ["A2"], "PHY_P"], ["Thursday", 0, ["A3"], "CHEM_P"],
  ["Thursday", 1, ALL, "UHV"], ["Thursday", 2, ALL, "BEEE"], ["Thursday", 3, ALL, "PCE"],
  ["Thursday", 4, ALL, "CHEM"], ["Thursday", 5, ALL, "CP"],
  // FRIDAY
  ["Friday", 0, ["A1"], "CHEM_P"], ["Friday", 0, ["A2"], "MATHS"], ["Friday", 0, ["A3"], "PHY_P"],
  ["Friday", 1, ALL, "UHV"], ["Friday", 2, ALL, "EM"], ["Friday", 3, ALL, "PCE"],
  ["Friday", 4, ALL, "PHY"], ["Friday", 5, ALL, "CP"],
  // SATURDAY (day ends at 3:45 PM)
  ["Saturday", 0, ["A1"], "PHY_P"], ["Saturday", 0, ["A2"], "CHEM_P"], ["Saturday", 0, ["A3"], "MATHS"],
  ["Saturday", 1, ALL, "CHEM"], ["Saturday", 2, ALL, "PHY"], ["Saturday", 3, ALL, "MATHS"],
  ["Saturday", 4, ALL, "EM"],
];

// TIMETABLE[batch][day] = [{ slot, time, subject, who, room, roomLabel, note, shared }]
const TIMETABLE = {};
BATCHES.forEach(b => {
  TIMETABLE[b] = {};
  DAYS.forEach(d => { TIMETABLE[b][d] = []; });
});
SCHEDULE.forEach(([day, slot, batches, key]) => {
  batches.forEach(b => {
    TIMETABLE[b][day].push(Object.assign({ slot, time: SLOTS[slot], shared: batches.length === BATCHES.length }, SUBJECTS[key]));
  });
});
BATCHES.forEach(b => DAYS.forEach(d => TIMETABLE[b][d].sort((x, y) => x.slot - y.slot)));

// Rooms where at least one lecture is held (any batch, any day).
// The hover popup is shown only for these boxes.
const LECTURE_ROOMS = new Set(Object.values(SUBJECTS).map(s => s.room).filter(Boolean));

function getRoomById(roomId) {
  return ROOM_DATA[roomId] || null;
}
