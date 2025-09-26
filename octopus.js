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

const INCR = 0, STAY = 1, DECR = 2, BOOM = 3;

const lvlsCache = new Map();

function genKey(level, taps, target) {
  return `${level},${taps},${target}`;
}

function genLvlsDist(level, taps, target) {
  if (level < 1 || taps < 0) {
    return [];
  }

  const key = genKey(level, taps, target);

  if (lvlsCache.has(key)) {
    return lvlsCache.get(key);
  }
  
  const result = [];

  if (taps == 0 || level == target) {
    result[level] = 1;
  } else {

    const incr = genLvlsDist(level + 1, taps - 1, target);
    const stay = genLvlsDist(level, taps - 1, target);
    const decr = genLvlsDist(level - 1, taps - 1, target);
    const boom = genLvlsDist(2, taps - 1, target);

    for (let i = 1; i <= 9; i++) {
      result[i] =
          OUTCOMES[level][INCR] * (OUTCOMES[level][INCR] ? incr[i] || 0 : 0) +
          OUTCOMES[level][STAY] * (OUTCOMES[level][STAY] ? stay[i] || 0 : 0) +
          OUTCOMES[level][DECR] * (OUTCOMES[level][DECR] ? decr[i] || 0 : 0) +
          OUTCOMES[level][BOOM] * (OUTCOMES[level][BOOM] ? boom[i] || 0 : 0);
    }
  }

  lvlsCache.set(key, result);
  return result;
}

const tapsCache = new Map();

function genTapsDist(level, taps, target) {
  if (taps < 0) {
    return {
      distribution: [],
      fail: 0
    };
  }

  const key = genKey(level, taps, target);
  if (tapsCache.has(key)) {
    return tapsCache.get(key);
  }

  if (level == target) {
    const result = {
      distribution: [],
      fail: 0
    };
    result.distribution[taps] = 1;
    tapsCache.set(key, result);
    return result;
  }

  if (taps == 0) {
    const result = {
      distribution: [],
      fail: 1
    };
    tapsCache.set(key, result);
    return result;
  }

  let result = {
    distribution: [],
    fail: 0
  };

  function merge(child, weight) {
    if (!weight) return;
    result.fail += child.fail * weight;
    for (let i = 0; i < child.distribution.length; i++) {
      if (child.distribution[i]) {
        result.distribution[i] = (result.distribution[i] || 0) + child.distribution[i] * weight;
      }
    }
  }

  if (OUTCOMES[level][INCR]) {
    merge(genTapsDist(level + 1, taps - 1, target), OUTCOMES[level][INCR]);
  }
  if (OUTCOMES[level][STAY]) {
    merge(genTapsDist(level, taps - 1, target), OUTCOMES[level][STAY]);
  }
  if (OUTCOMES[level][DECR]) {
    merge(genTapsDist(level - 1, taps - 1, target), OUTCOMES[level][DECR]);
  }
  if (OUTCOMES[level][BOOM]) {
    merge(genTapsDist(2, taps - 1, target), OUTCOMES[level][BOOM]);
  }

  tapsCache.set(key, result);
  return result;
}
