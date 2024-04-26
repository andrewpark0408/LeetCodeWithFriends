import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: number;  // Add this line only, ensure it's the only modification
  }
}