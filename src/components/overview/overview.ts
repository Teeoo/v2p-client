export interface Overview {
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
    enablelist: Enablelist;
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

export interface Enablelist {
    rule: boolean;
    rewrite: boolean;
    mitmhost: boolean;
}

export interface Message {
    type: string;
    data: Data;
}

export interface Data {
    type: string;
    data: string[];
}