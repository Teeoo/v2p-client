declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    desc?: string;
  }
}


