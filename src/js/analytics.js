let trackingKey = 'dummy-key';

import('./config.js')
  .then((mod) => {
    if (mod.TRACKING_KEY) {
      trackingKey = mod.TRACKING_KEY;
    }
  })
  .catch(() => {
    // use dummy key if config.js is missing
  });

export function track(eventName, data = {}) {
  const payload = {
    key: trackingKey,
    event: eventName,
    data,
    timestamp: Date.now(),
  };
  // Placeholder: replace console.log with real analytics provider
  console.log('Tracking event', payload);
}
