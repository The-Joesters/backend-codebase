// src/env.d.ts

declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
    DATABASE_URL?: string;
    AI_MODEL?: string;
    PUBLIC_URL: string;
    jwt_SECRET_KEY: string;
    REFRESH_TOKEN_KEY: string;
    EMAIL_USER:string;
    EMAIL_PASS:string;
    GOOGLE_CLIENT_ID:string;
    SWAGGER_LINK_PUBLIC:string;
    
  }
}
