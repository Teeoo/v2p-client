export interface Mitm {
    host: Host[];
    enable: boolean;
    crtinfo: Crtinfo;
}

export interface Host {
    host: string;
    enable: boolean;
    note?: string;
}

export interface Crtinfo {
    rescode: number;
    commonName: string;
    notBefore: string;
    notAfter: string;
}
