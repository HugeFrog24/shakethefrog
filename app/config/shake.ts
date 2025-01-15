export const shakeConfig = {
  // Threshold for triggering shake (lower = more sensitive)
  threshold: 20, // Increased from 15 to make it less sensitive

  // Minimum time between shake detections (in ms)
  debounceTime: 100,

  // Animation durations (in ms)
  animations: {
    shakeReset: 600,    // Reduced from 10000ms to 600ms (0.6 seconds)
    heartsReset: 300,   // How long the hearts animation lasts
    heartFloat: 2000,   // Duration of floating heart animation
    heartFadeOut: 2000  // Duration of heart fade out
  },

  // Hearts configuration
  hearts: {
    waves: 4,           // Number of waves per shake
    waveDelay: 200,     // Delay between waves in ms
    cleanupInterval: 1000, // How often to check for and remove old hearts
    minSpeed: 0.8,      // Minimum heart float speed
    maxSpeed: 1.2,      // Maximum heart float speed
    minScale: 0.8,      // Minimum heart size
    maxScale: 1.2,      // Maximum heart size
    spreadX: 20,        // How far hearts can spread horizontally from center
    spreadY: 20,        // How far hearts can spread vertically from center
    maxPerShake: 50     // Maximum number of hearts per shake
  },

  // Default intensity for manual triggers (click/spacebar)
  defaultTriggerIntensity: 25
};
