// ============================================================
// CAMPUS OS — Excel timetable reader
// ------------------------------------------------------------
// Reads a college-style timetable sheet (days across the top,
// time slots down the left, subject on one line and teacher or
// batch split on the next, plus a "SUBJECT / FACULTY / LAB"
// legend underneath) and turns it into the same shape that
// data.js builds by hand:
//
//   { DAYS, BATCHES, SLOTS, RECESS_AFTER, TIMETABLE, LECTURE_ROOMS,
//     classLabel, warnings }
//
// It needs ROOM_DATA (from data.js) to match room names like
// "CR 13", "CL 7", "EL 1" or "MECHANICS LAB" to boxes on the map.
// It does NOT touch the page — map-excel.html decides what to do
// with the result.
// ============================================================

const ExcelTimetable = (() => {

  const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const clean = v => String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
  const isDashes = s => /^[-–—_\s]*$/.test(s);

  function dayOf(text) {
    const t = clean(text).toUpperCase();
    if (t.length < 3) return null;
    return DAY_NAMES.find(d => t.startsWith(d.slice(0, 3).toUpperCase())) || null;
  }

  // ---------- Time slots ----------
  const TIME_RE = /(\d{1,2})\s*[:.]\s*(\d{2})\s*(AM|PM)?\s*(?:TO|-|–|—)\s*(\d{1,2})\s*[:.]\s*(\d{2})\s*(AM|PM)?/i;

  function parseTime(text) {
    const m = clean(text).match(TIME_RE);
    if (!m) return null;
    let [, h1, m1, ap1, h2, m2, ap2] = m;
    ap1 = (ap1 || ap2 || '').toUpperCase();
    ap2 = (ap2 || ap1 || '').toUpperCase();
    const fmt = (h, mm, ap) => `${parseInt(h, 10)}:${mm}${ap ? ' ' + ap : ''}`;
    return `${fmt(h1, m1, ap1)} – ${fmt(h2, m2, ap2)}`;
  }

  // ---------- Subject names ----------
  const STOP = new Set(['AND', 'OF', 'THE', 'CUM', 'FOR', 'IN', '&']);

  function canon(s) {
    return clean(s).toUpperCase()
      .replace(/\bAPP\.\s*/g, 'APPLIED ')
      .replace(/\bENGG\.?\s*/g, 'ENGINEERING ')
      .replace(/\bMATHS?\b/g, 'MATHEMATICS')
      .replace(/\bCHEM\b/g, 'CHEMISTRY')
      .replace(/\bPHY\b/g, 'PHYSICS')
      .replace(/-\s*1\b/g, '-I').replace(/-\s*2\b/g, '-II')
      .replace(/[^A-Z0-9]+/g, ' ').trim();
  }
  const acronym = c => c.split(' ').filter(w => !STOP.has(w) && !/^[IVX]+$/.test(w)).map(w => w[0]).join('');

  function titleCase(s) {
    return clean(s).replace(/\bENGG\.\s*/gi, 'Engineering ').replace(/,\s*/g, ', ').toLowerCase()
      .replace(/(^|[\s(/&,.-])([a-z])/g, (m, p, c) => p + c.toUpperCase())
      .replace(/\b(Ii|Iii|Iv)\b/g, w => w.toUpperCase())
      .replace(/-i\b/gi, '-I')
      .replace(/\(([^)]*)\)/g, (m, inner) => '(' + inner.toUpperCase() + ')')
      .replace(/\b(And|Of|Cum|For|In)\b/g, w => w.toLowerCase());
  }

  function buildSubjectIndex(legend) {
    return legend.map(e => {
      const full = canon(e.name);
      const paren = (e.name.match(/\(([^)]+)\)/) || [])[1];
      return { ...e, full, paren: paren ? canon(paren) : null, acr: acronym(canon(e.name.replace(/\(.*?\)/g, ''))) };
    });
  }

  function matchSubject(raw, index) {
    const q = canon(raw);
    if (!q) return null;
    const qCompact = q.replace(/ /g, '');
    let best = null, bestScore = 0;
    for (const e of index) {
      let s = 0;
      if (q === e.full) s = 100;
      else if (e.paren && q === e.paren) s = 95;
      else if (qCompact.length >= 3 && (e.acr === qCompact || (e.acr.startsWith(qCompact) && e.acr.length - qCompact.length <= 1))) s = 80;
      else {
        const qt = q.split(' ').filter(w => !STOP.has(w));
        const et = e.full.split(' ');
        const hits = qt.filter(w => et.some(x => x.startsWith(w) || w.startsWith(x))).length;
        if (qt.length && hits === qt.length) s = 60 + hits;
      }
      if (s > bestScore) { best = e; bestScore = s; }
    }
    return best;
  }

  // ---------- Rooms → map box IDs ----------
  function resolveRoom(text, roomData) {
    const t = clean(text).toUpperCase();
    if (!t) return null;
    const ids = Object.keys(roomData);
    const numsOf = id => (id.match(/\d+/g) || []).map(Number);

    // Short codes: CR 13, CL 7, EL 1
    const code = t.match(/^(CR|CL|EL)\s*[-.]?\s*(\d+)/);
    if (code) {
      const n = Number(code[2]);
      const prefixes = { CR: ['CR'], CL: ['COMP-LAB'], EL: ['ELECTRONICS-LAB', 'ELEC-LAB'] }[code[1]];
      const hit = ids.find(id => prefixes.some(p => id.startsWith(p)) && numsOf(id).includes(n)
        && (code[1] !== 'CR' || /^CR\d+$/.test(id)));
      if (hit) return hit;
    }

    // Words: "MECHANICS LAB", "CHEMISTRY LAB", "WORKSHOP"
    const GENERIC = new Set(['LAB', 'LABS', 'LABORATORY', 'ROOM', 'THE', 'OF', 'AND', 'NO', 'FLOOR']);
    const words = t.replace(/[^A-Z ]+/g, ' ').split(' ').filter(w => w.length >= 3 && !GENERIC.has(w));
    if (!words.length) return null;
    const pre = (a, b) => a.length >= 4 && b.length >= 4 && (a.startsWith(b) || b.startsWith(a));
    let best = null, bestScore = 0, tie = false;
    for (const id of ids) {
      const r = roomData[id];
      if (r.type === 'utility' || r.type === 'office') continue;
      const nameW = (r.name + ' ' + id.replace(/-/g, ' ')).toUpperCase().split(/\s+/);
      const detW = String(r.details || '').toUpperCase().split(/\s+/);
      let s = 0;
      words.forEach(w => {
        if (nameW.some(x => pre(w, x))) s += 1;
        else if (detW.some(x => pre(w, x))) s += 0.5;
      });
      if (s > bestScore) { best = id; bestScore = s; tie = false; }
      else if (s === bestScore && s > 0) tie = true;
    }
    return bestScore > 0 && !tie ? best : null;
  }

  // ---------- Main parse ----------
  function parseRows(rows, roomData) {
    rows = rows.map(r => (r || []).map(clean));
    const warnings = [];

    // 1. Header row = the row with the most day names (at least 3)
    let headerRow = -1, dayCols = [];
    rows.forEach((r, i) => {
      const cols = r.map((v, c) => ({ c, day: dayOf(v) })).filter(x => x.day);
      if (cols.length >= 3 && cols.length > dayCols.length) { headerRow = i; dayCols = cols; }
    });
    if (headerRow < 0) throw new Error('Could not find a row with the day names (Monday, Tuesday, …).');
    const timeCol = Math.max(0, rows[headerRow].findIndex(v => /TIME/i.test(v)));

    // Class name and default classroom from the title rows
    const title = rows.slice(0, headerRow).map(r => r.filter(Boolean).join(' '));
    const classLine = title.find(l => /DIV/i.test(l)) || '';
    const classLabel = titleCase(classLine
        .replace(/\bCR\s*[-.]?\s*\d+.*$/i, '')
        .replace(/\s*-?\s*DIV(?:ISION)?\s*[-.(]?\s*([A-Z])\s*\)?/i, ' · Division $1'))
      .replace(/\b([A-Za-z]{2})\b(?= ·|$|\s)/g, w => /^(of|in|and)$/i.test(w) ? w : w.toUpperCase())
      .trim();
    const defaultRoomText = (title.join(' ').match(/\bCR\s*[-.]?\s*\d+/i) || [])[0] || '';

    // 2. Time blocks (a time label plus the rows under it until the next one)
    const blocks = [];
    let r = headerRow + 1;
    for (; r < rows.length; r++) {
      const label = rows[r][timeCol];
      const time = label && parseTime(label);
      if (time) { blocks.push({ time, rows: [r] }); continue; }
      if (label) break;                                   // e.g. "SUBJECT" — the legend starts
      if (blocks.length) blocks[blocks.length - 1].rows.push(r);
    }
    const legendStart = r;

    // 3. Legend: SUBJECT | FACULTY | LAB
    const legend = [];
    for (let i = legendStart; i < rows.length; i++) {
      const row = rows[i];
      const sc = row.findIndex(v => /^SUBJECT/i.test(v));
      const fc = row.findIndex(v => /FACULTY|TEACHER|STAFF/i.test(v));
      if (sc < 0 || fc < 0) continue;
      const lc = row.findIndex(v => /\bLAB\b|ROOM/i.test(v));
      let blanks = 0;
      for (let j = i + 1; j < rows.length && blanks < 2; j++) {
        const name = rows[j][sc];
        if (!name) { blanks++; continue; }
        blanks = 0;
        legend.push({ name, faculty: rows[j][fc] || '', lab: lc >= 0 ? rows[j][lc] : '' });
      }
      break;
    }
    if (!legend.length) warnings.push('No SUBJECT / FACULTY table found under the timetable, so teacher names for batch sessions may be missing.');
    const subjIndex = buildSubjectIndex(legend);

    // 4. Read every cell
    const SLOTS = [], RECESS_AFTER = {}, sessions = [], batchSet = new Set();
    const isTeacher = l => /^(PROF|MR|MRS|MS|DR)\b\.?/i.test(l);
    const isBatchLine = l => !isTeacher(l) && /(^|[\s/(])[A-Z]\d{1,2}\b/.test(l);

    blocks.forEach(b => {
      const cellLines = dayCols.map(d => b.rows.map(rr => rows[rr][d.c]).filter(Boolean));
      const joined = cellLines.map(l => l.join('')).join('').toUpperCase().replace(/[^A-Z]/g, '');
      if (/RECESS|BREAK|LUNCH/.test(joined) || (joined && joined.length <= 8 && cellLines.every(l => l.join('').length <= 2))) {
        if (SLOTS.length) RECESS_AFTER[SLOTS.length - 1] = b.time;
        return;
      }
      const slot = SLOTS.length;
      SLOTS.push(b.time);

      dayCols.forEach((d, di) => {
        const lines = cellLines[di];
        if (!lines.length) return;
        const subjLine = lines[0];
        const batchLine = lines.slice(1).find(isBatchLine);
        const teacherLine = lines.slice(1).find(isTeacher);

        if (!batchLine) {
          sessions.push({ day: d.day, slot, raw: subjLine, batches: null, roomText: '', who: teacherLine || '' });
          return;
        }
        const subjects = subjLine.split('/').map(clean);
        const tokens = batchLine.split('/').map(clean);
        const n = Math.max(subjects.length, tokens.length);
        for (let i = 0; i < n; i++) {
          const subj = subjects.length === 1 ? subjects[0] : subjects[i];
          const tok = tokens[i] || '';
          if (!subj || isDashes(subj) || (tok && isDashes(tok))) continue;
          const m = tok.match(/^([A-Z]\d{1,2})\s*(?:\(\s*([^)]*?)\s*\)?)?\s*$/i);
          const batch = m ? m[1].toUpperCase() : null;
          if (batch) batchSet.add(batch);
          sessions.push({ day: d.day, slot, raw: subj, batches: batch ? [batch] : ['#' + i], roomText: m && m[2] ? m[2] : '', who: teacherLine || '' });
        }
      });
    });

    // Batches: whatever the sheet names, else one whole-class "batch"
    const BATCHES = batchSet.size ? [...batchSet].sort() : ['All'];
    const DAYS = dayCols.map(d => d.day);

    // 5. Build TIMETABLE[batch][day]
    const TIMETABLE = {};
    BATCHES.forEach(b => { TIMETABLE[b] = {}; DAYS.forEach(d => { TIMETABLE[b][d] = []; }); });
    const unmatched = new Set(), unplaced = new Set();
    const defaultRoom = defaultRoomText ? resolveRoom(defaultRoomText, roomData) : null;

    sessions.forEach(s => {
      const batches = s.batches
        ? s.batches.map(b => b.startsWith('#') ? BATCHES[Number(b.slice(1))] : b).filter(Boolean)
        : BATCHES.slice();
      const shared = batches.length === BATCHES.length;
      const subj = matchSubject(s.raw, subjIndex);
      if (!subj && legend.length) unmatched.add(s.raw);

      // Room: written in the cell → the subject's lab (batch sessions) → the class's own room
      let roomText = s.roomText;
      if (!roomText && !shared && subj && subj.lab) roomText = subj.lab;
      if (!roomText) roomText = defaultRoomText;
      const room = roomText ? resolveRoom(roomText, roomData) || (roomText === defaultRoomText ? defaultRoom : null) : null;
      if (roomText && !room) unplaced.add(roomText);

      let subject = titleCase(subj ? subj.name : s.raw);
      if (!shared && room && roomData[room] && roomData[room].type === 'lab') subject += ' Practical';
      const who = titleCase((s.who || (subj && subj.faculty) || '').replace(/\./g, '. ')).replace(/\s+/g, ' ').replace(/\.\s*,/g, '.,');

      batches.forEach(b => {
        TIMETABLE[b][s.day].push({
          slot: s.slot, time: SLOTS[s.slot], subject, who,
          room, roomLabel: roomText ? titleCase(roomText) : 'Room not given',
          note: room ? '' : (roomText ? `"${roomText}" isn't on the map yet.` : ''),
          shared,
        });
      });
    });
    BATCHES.forEach(b => DAYS.forEach(d => TIMETABLE[b][d].sort((x, y) => x.slot - y.slot)));

    if (unmatched.size) warnings.push('Not found in the subject list (shown as written): ' + [...unmatched].join(', '));
    if (unplaced.size) warnings.push('Rooms that could not be placed on the map: ' + [...unplaced].join(', '));

    const LECTURE_ROOMS = new Set();
    BATCHES.forEach(b => DAYS.forEach(d => TIMETABLE[b][d].forEach(l => l.room && LECTURE_ROOMS.add(l.room))));

    return { DAYS, BATCHES, SLOTS, RECESS_AFTER, TIMETABLE, LECTURE_ROOMS, classLabel, warnings, sessionCount: sessions.length };
  }

  // Browser helper: File → result (needs SheetJS loaded as window.XLSX)
  async function parseFile(file, roomData) {
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    let lastErr;
    for (const name of wb.SheetNames) {
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, defval: '', raw: false });
      try { return { sheet: name, ...parseRows(rows, roomData) }; } catch (e) { lastErr = e; }
    }
    throw lastErr || new Error('The file has no sheets.');
  }

  return { parseRows, parseFile, resolveRoom, matchSubject };
})();

if (typeof module !== 'undefined') module.exports = ExcelTimetable;
