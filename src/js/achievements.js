const ACHIEVEMENTS = {
  tetris10: {
    name: 'Tetris x10',
    desc: 'Clear 10 Tetrises',
    unlocked: false,
  },
  fast5: {
    name: 'Level 5 Speedrun',
    desc: 'Reach level 5 in under 2 mins',
    unlocked: false,
  },
};

const storageKey = 'tetris_achievements';
const dailyKey = 'tetris_daily';

let progress = {
  tetrises: 0,
};
let startTime = null;

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
    Object.keys(data).forEach((id) => {
      if (ACHIEVEMENTS[id]) {
        ACHIEVEMENTS[id].unlocked = true;
      }
    });
  } catch {
    // ignore malformed storage
  }
}

function save() {
  const data = {};
  Object.keys(ACHIEVEMENTS).forEach((id) => {
    if (ACHIEVEMENTS[id].unlocked) {
      data[id] = true;
    }
  });
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function renderAchievements() {
  const list = document.getElementById('achievement-list');
  if (!list) return;
  list.innerHTML = '';
  Object.keys(ACHIEVEMENTS).forEach((id) => {
    const ach = ACHIEVEMENTS[id];
    const li = document.createElement('li');
    li.textContent = ach.name;
    li.className = ach.unlocked ? 'unlocked' : 'locked';
    list.appendChild(li);
  });
}

export function initAchievementsPanel() {
  load();
  renderAchievements();
  updateDailyStatus();
}

export function startSession() {
  startTime = Date.now();
  progress.tetrises = 0;
}

export function recordLineClear(lines) {
  if (lines === 4) {
    progress.tetrises += 1;
    if (!ACHIEVEMENTS.tetris10.unlocked && progress.tetrises >= 10) {
      ACHIEVEMENTS.tetris10.unlocked = true;
      save();
      renderAchievements();
    }
  }
}

export function recordLevel(level) {
  if (level >= 5 && startTime && !ACHIEVEMENTS.fast5.unlocked) {
    const elapsed = Date.now() - startTime;
    if (elapsed <= 120000) {
      ACHIEVEMENTS.fast5.unlocked = true;
      save();
      renderAchievements();
    }
  }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

let dailyData = {};
try {
  dailyData = JSON.parse(localStorage.getItem(dailyKey) || '{}');
} catch {
  // ignore
}

export function getDailySeed() {
  const date = todayKey();
  let hash = 0;
  for (let i = 0; i < date.length; i += 1) {
    hash = (hash << 5) - hash + date.charCodeAt(i);
    hash |= 0; // to 32bit
  }
  return hash >>> 0;
}

export function isDailyCompleted() {
  return !!dailyData[todayKey()];
}

export function markDailyCompleted() {
  dailyData[todayKey()] = true;
  localStorage.setItem(dailyKey, JSON.stringify(dailyData));
  updateDailyStatus();
}

export function updateDailyStatus() {
  const el = document.getElementById('daily-status');
  if (el) {
    el.textContent = isDailyCompleted() ? 'Completed' : 'Incomplete';
  }
}

export function markGameOver(isDaily) {
  if (isDaily && !isDailyCompleted()) {
    markDailyCompleted();
  }
}
