const STORAGE_KEY = 'tetrisLeaderboard';
const MAX_ENTRIES = 10;
const MAX_STORAGE_SIZE = 50000; // characters

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || raw.length > MAX_STORAGE_SIZE) {
      return [];
    }
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      return [];
    }
    return data;
  } catch {
    return [];
  }
}

function save(entries) {
  try {
    const raw = JSON.stringify(entries);
    if (raw.length > MAX_STORAGE_SIZE) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // ignore
  }
}

export function addEntry(name, score) {
  const entries = load();
  entries.push({ name, score, date: new Date().toISOString() });
  entries.sort((a, b) => b.score - a.score);
  if (entries.length > MAX_ENTRIES) {
    entries.length = MAX_ENTRIES;
  }
  save(entries);
}

export function getEntries(limit = MAX_ENTRIES) {
  const entries = load();
  entries.sort((a, b) => b.score - a.score);
  return entries.slice(0, limit);
}

export function clear() {
  localStorage.removeItem(STORAGE_KEY);
}

export function renderLeaderboard(limit = MAX_ENTRIES) {
  const list = document.getElementById('leaderboard-list');
  if (!list) return;
  const entries = getEntries(limit);
  list.innerHTML = '';
  entries.forEach((entry) => {
    const li = document.createElement('li');
    const date = new Date(entry.date).toLocaleDateString();
    li.textContent = `${entry.name} - ${entry.score} (${date})`;
    list.appendChild(li);
  });
}

export function showLeaderboard(limit = MAX_ENTRIES) {
  renderLeaderboard(limit);
  const modal = document.getElementById('leaderboard-modal');
  if (modal) {
    modal.classList.add('show');
  }
}

export function hideLeaderboard() {
  const modal = document.getElementById('leaderboard-modal');
  if (modal) {
    modal.classList.remove('show');
  }
}

export function setup() {
  const closeBtn = document.getElementById('close-leaderboard');
  const clearBtn = document.getElementById('clear-leaderboard');
  if (closeBtn) {
    closeBtn.addEventListener('click', hideLeaderboard);
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clear();
      renderLeaderboard();
    });
  }
}

export { MAX_ENTRIES };
