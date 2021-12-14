export interface Setting {
    homepage: string;
    gloglevel: string;
    CONFIG_FEED: ConfigFeed;
    CONFIG_RUNJS: ConfigRunjs;
    CONFIG_Axios: ConfigAxios;
    uagent: Uagent;
    wbrtoken: string;
    minishell: boolean;
    newversion: string;
    security: Security;
    init: Init;
    anyproxy: Anyproxy;
    webUI: WebUi;
}

export interface ConfigFeed {
    enable: boolean;
    rss: Rss;
    iftttid: Iftttid;
    barkkey: Barkkey;
    custnotify: Custnotify;
    runjs: Runjs;
    merge: Merge;
    maxbLength: number;
    webmessage: Webmessage;
}

export interface Rss {
    enable: boolean;
    homepage: string;
}

export interface Iftttid {
    enable: boolean;
    key: string;
}

export interface Barkkey {
    enable: boolean;
    key: string;
}

export interface Custnotify {
    enable: boolean;
    url: string;
    type: string;
    data: string;
}

export interface Runjs {
    enable: boolean;
    list: string;
}

export interface Merge {
    enable: boolean;
    gaptime: number;
    number: number;
    andor: boolean;
}

export interface Webmessage {
    enable: boolean;
}

export interface ConfigRunjs {
    timeout: number;
    intervals: number;
    numtofeed: number;
    jslogfile: boolean;
    eaxioslog: boolean;
    proxy: boolean;
    white: White;
}

export interface White {
    enable: boolean;
    list: string[];
}

export interface ConfigAxios {
    proxy: Proxy;
    timeout: number;
    uagent: string;
    block: Block;
    only: Only;
}

export interface Proxy {
    enable: boolean;
}

export interface Block {
    enable: boolean;
    regexp: string;
}

export interface Only {
    enable: boolean;
    regexp: string;
}

export interface Uagent {
    iPhone: IPhone;
    Firefox: Firefox;
    chrome: Chrome;
    Quark: Quark;
    ucadroid: Ucadroid;
    SearchCraft: SearchCraft;
}

export interface IPhone {
    name: string;
    header: string;
}

export interface Firefox {
    name: string;
    header: string;
}

export interface Chrome {
    name: string;
    header: string;
}

export interface Quark {
    name: string;
    header: string;
}

export interface Ucadroid {
    name: string;
    header: string;
}

export interface SearchCraft {
    name: string;
    header: string;
}

export interface Security {
    enable: boolean;
    whitelist: string[];
    blacklist: string[];
}

export interface Init {
    checkupdate: boolean;
    runjs: string;
}

export interface Anyproxy {
    enable: boolean;
    port: number;
    webPort: number;
}

export interface WebUi {
    port: number;
}