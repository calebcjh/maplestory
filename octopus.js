// increase, stay, decrease, drop to 2
const OUTCOMES = [
  undefined,
  [1, 0, 0, 0],
  [0.7, 0.3, 0, 0],
  [0.55, 0, 0.45, 0],
  [0.4, 0, 0.6, 0],
  [0.307, 0, 0.693, 0],
  [0.205, 0, 0.765, 0.03],
  [0.153, 0, 0.817, 0.03],
  [0.1, 0, 0.87, 0.03],
  [0, 1, 0, 0]
];

const cache = new Map();

function genKey(level, taps, target) {
  return `${level},${taps},${target}`;
}

function query(level, taps, target) {
  if (level < 1 || taps < 0) {
    return [];
  }

  const key = genKey(level, taps, target);

  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const result = [];

  if (taps == 0 || level == target) {
    result[level] = 1;
  } else {

    const increase = query(level + 1, taps - 1, target);
    const stay = query(level, taps - 1, target);
    const decrease = query(level - 1, taps - 1, target);
    const fed = query(2, taps - 1, target);

    for (let i = 1; i <= 9; i++) {
      result[i] =
          OUTCOMES[level][0] * (OUTCOMES[level][0] ? increase[i] || 0 : 0) +
          OUTCOMES[level][1] * (OUTCOMES[level][1] ? stay[i] || 0 : 0) +
          OUTCOMES[level][2] * (OUTCOMES[level][2] ? decrease[i] || 0 : 0) +
          OUTCOMES[level][3] * (OUTCOMES[level][3] ? fed[i] || 0 : 0);
    }
  }

  cache.set(key, result);
  return result;
}
