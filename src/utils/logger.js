/**
 * Frontend logger utility - conditionally logs based on environment
 * Prevents unnecessary console output in production while maintaining
 * error visibility
 */

const IS_DEVELOPMENT = import.meta.env.DEV;
const DEBUG_ENABLED = import.meta.env.VITE_DEBUG === 'true';

/**
 * Logger with conditional output based on environment
 */
export const logger = {
  /**
   * Log informational messages (development only)
   */
  info: (...args) => {
    if (IS_DEVELOPMENT || DEBUG_ENABLED) {
      console.log('[INFO]', ...args);
    }
  },

  /**
   * Log warning messages (always visible)
   */
  warn: (...args) => {
    console.warn('[WARN]', ...args);
  },

  /**
   * Log error messages (always visible)
   */
  error: (...args) => {
    console.error('[ERROR]', ...args);
  },

  /**
   * Log debug messages (development only)
   */
  debug: (...args) => {
    if (IS_DEVELOPMENT) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * Log messages in a group (development only)
   */
  group: (label, fn) => {
    if (IS_DEVELOPMENT || DEBUG_ENABLED) {
      console.group(label);
      fn();
      console.groupEnd();
    }
  }
};

export default logger;
