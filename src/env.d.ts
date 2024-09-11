// src/env.d.ts

declare namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
      DATABASE_URL?: string;
    }
  }
  