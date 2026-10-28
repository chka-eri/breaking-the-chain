import { MAX_LEVEL, pickDrop } from "../data/items";

export const COLS = 6;
export const ROWS = 7;
export const SIZE = COLS * ROWS;
export const IKE_MAX = 40;

let _uid = 1;
export function nextUid() {
  _uid += 1;
  return _uid;
}

export function resetUid(n) {
  if (typeof n === "number" && n > _uid) _uid = n;
}

export function emptyBoard() {
  return Array(SIZE).fill(null);
}

export function makeItem(chain, level, extra) {
  return { uid: nextUid(), chain, level: level || 1, locked: false, ...extra };
}

export function empties(board) {
  const out = [];
  for (let i = 0; i < board.length; i++) if (!board[i]) out.push(i);
  return out;
}

export function xy(i) {
  return { x: i % COLS, y: Math.floor(i / COLS) };
}

export function neighbors(i) {
  const { x, y } = xy(i);
  const n = [];
  if (x > 0) n.push(i - 1);
  if (x < COLS - 1) n.push(i + 1);
  if (y > 0) n.push(i - COLS);
  if (y < ROWS - 1) n.push(i + COLS);
  return n;
}

export function adjacent(a, b) {
  return neighbors(a).includes(b);
}

export function canMerge(a, b) {
  return (
    a &&
    b &&
    a.chain === b.chain &&
    a.level === b.level &&
    a.level < MAX_LEVEL &&
    !a.locked &&
    !b.locked
  );
}

export function cloneBoard(board) {
  return board.map((c) => (c ? { ...c } : null));
}

export function mergeCells(board, from, to) {
  const a = board[from];
  const b = board[to];
  if (!canMerge(a, b)) return { board, ok: false };
  const next = cloneBoard(board);
  next[to] = makeItem(b.chain, b.level + 1);
  next[from] = null;
  return { board: next, ok: true, result: next[to] };
}

export function moveItem(board, from, to) {
  if (from === to) return { board, ok: false };
  if (!board[from] || board[from].locked) return { board, ok: false };
  if (board[to]) return { board, ok: false };
  const next = cloneBoard(board);
  next[to] = next[from];
  next[from] = null;
  return { board: next, ok: true };
}

export function itemFitsOrder(item, order) {
  if (!item || !order || item.locked) return false;
  return (order.need || []).some((n) => n.chain === item.chain && n.level === item.level);
}

export function placeItem(board, item) {
  const spots = empties(board);
  if (!spots.length) return { board, ok: false };
  const idx = spots[Math.floor(Math.random() * spots.length)];
  const next = cloneBoard(board);
  next[idx] = item;
  return { board: next, ok: true, index: idx };
}

export function tapGenerator(board, gen, unlockedLevel) {
  const chain = pickDrop(gen, unlockedLevel);
  if (!chain) return { board, ok: false };
  return placeItem(board, makeItem(chain, 1));
}

export function countNeed(board, need) {
  const have = {};
  board.forEach((c) => {
    if (!c || c.locked) return;
    const k = c.chain + ":" + c.level;
    have[k] = (have[k] || 0) + 1;
  });
  return (need || []).every((n) => (have[n.chain + ":" + n.level] || 0) >= n.qty);
}

export function consumeNeed(board, need) {
  const next = cloneBoard(board);
  for (const n of need || []) {
    let left = n.qty;
    for (let i = 0; i < next.length && left > 0; i++) {
      const c = next[i];
      if (c && !c.locked && c.chain === n.chain && c.level === n.level) {
        next[i] = null;
        left -= 1;
      }
    }
    if (left > 0) return { board, ok: false };
  }
  return { board: next, ok: true };
}

export function seedBoard() {
  let b = emptyBoard();
  [
    makeItem("kola", 1),
    makeItem("kola", 1),
    makeItem("yam", 1),
    makeItem("yam", 1),
    makeItem("craft", 1),
    makeItem("kola", 2),
  ].forEach((it) => {
    const r = placeItem(b, it);
    if (r.ok) b = r.board;
  });
  return b;
}

export function lockCountForChain(chainStat) {
  if (chainStat >= 55) return 3;
  if (chainStat >= 35) return 2;
  if (chainStat >= 18) return 1;
  return 0;
}

export function applyLocks(board, chainStat) {
  const want = lockCountForChain(chainStat);
  const next = cloneBoard(board);
  let have = next.filter((c) => c && c.locked).length;
  if (have > want) {
    for (let i = 0; i < next.length && have > want; i++) {
      if (next[i] && next[i].locked) {
        next[i] = { ...next[i], locked: false };
        have -= 1;
      }
    }
  }
  const free = [];
  next.forEach((c, i) => {
    if (c && !c.locked) free.push(i);
  });
  while (have < want && free.length) {
    const pick = free.splice(Math.floor(Math.random() * free.length), 1)[0];
    next[pick] = { ...next[pick], locked: true };
    have += 1;
  }
  return next;
}

export function clearOneLock(board) {
  const next = cloneBoard(board);
  const locked = [];
  next.forEach((c, i) => {
    if (c && c.locked) locked.push(i);
  });
  if (!locked.length) return { board: next, ok: false };
  const i = locked[0];
  next[i] = { ...next[i], locked: false };
  return { board: next, ok: true };
}

export function maxUid(board) {
  let m = 1;
  board.forEach((c) => {
    if (c && c.uid > m) m = c.uid;
  });
  return m;
}

export function pickOrders(pool, currentIds, count) {
  const ids = new Set(currentIds || []);
  const shuffled = pool.slice().sort(() => Math.random() - 0.5);
  const out = [];
  for (const o of shuffled) {
    if (ids.has(o.id)) continue;
    out.push(o);
    ids.add(o.id);
    if (out.length >= count) break;
  }
  if (out.length < count) {
    for (const o of shuffled) {
      if (out.find((x) => x.id === o.id)) continue;
      out.push(o);
      if (out.length >= count) break;
    }
  }
  return out;
}

export function removeAt(board, index) {
  if (!board[index]) return { board, ok: false };
  const next = cloneBoard(board);
  next[index] = null;
  return { board: next, ok: true };
}
