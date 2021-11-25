export interface Overview {
  proxyPort: number;
  webifPort: number;
  ruleslen: number;
  rewriteslen: number;
  jslistslen: number;
  taskstatus: Taskstatus;
  mitmhostlen: number;
  version: string;
  start: number;
  anyproxy: Anyproxy;
  newversion: string;
  sysinfo: Sysinfo;
}

export interface Taskstatus {
  total: number;
  running: number;
  sub: number;
}

export interface Anyproxy {
  enable: boolean;
  port: number;
  webPort: number;
}

export interface Sysinfo {
  arch: string;
  platform: string;
  memory: string;
  uptime: string;
  nodever: string;
}

// ws




export interface Rules {
  eplists: Eplists;
  uagent: Uagent;
}

export interface Eplists {
  note: string;
  total: number;
  active: number;
  list: List[];
}

export interface List {
  mtype: string;
  match: string;
  ctype: string;
  target: string;
  stage: string;
  enable: boolean;
}

export interface Uagent {
  iPhone: IPhone;
  chrome: Chrome;
}

export interface IPhone {
  name: string;
  header: string;
}

export interface Chrome {
  name: string;
  header: string;
}


export interface RewriteLists {
  rewrite: Rewrite
  rewritesub: Rewritesub[]
}

export interface Rewrite {
  note: string
  total: number
  active: number
  enable: boolean
  list: [{
    match: string
    stage: string
    target: string
    enable: boolean
  }]
}


export interface Rewritesub {
  [keys: string]: Lx3pxe
}

export interface Lx3pxe {
  name: string
  enable: boolean
  bkcolor: string
  resource: string
  list: [{
    match: string
    target: string
    enable: boolean
    stage: string
  }]
  collapse: boolean
  active: number
  total: number
}


export interface JsManage {
  storemanage: boolean;
  jslists: string[];
}

