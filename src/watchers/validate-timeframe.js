/* eslint-disable no-console */
const keymirror = require('keymirror');

const TIMEFRAMES = keymirror({
  minute: null,
  hour: null,
  day: null,
});

const TIMEFRAMES_AND_REQUIRED_KEYS = {
  [TIMEFRAMES.minute]: [],
  [TIMEFRAMES.hour]: [],
  [TIMEFRAMES.day]: ['hour'],
};

function validateTimeframe({ config: { timeframe }, name }) {
  if (!timeframe) {
    console.warn(`WARN: No timeframe config for watcher ${name}`);
    return false;
  }
  const { type, ...rest } = timeframe;
  const requiredKeys = TIMEFRAMES_AND_REQUIRED_KEYS[type];
  if (!requiredKeys) {
    console.warn(`WARN: Invalid timeframe type ${type} for watcher ${name}`);
    return false;
  }
  const timeframeKeys = Object.keys(rest);
  const missingKeys = requiredKeys.filter(key => !timeframeKeys.includes(key));
  if (missingKeys.length > 0) {
    console.warn(
      `WARN: Missing keys ${missingKeys} for timeframe ${type} for watcher ${name}`,
    );
    return false;
  }
  return true;
}

module.exports = {
  TIMEFRAMES,
  validateTimeframe,
};
