export interface V2Pstatus {
    type: string;
    data: Data;
}

export interface Data {
    clients: number;
    memoryusage: Memoryusage;
}

export interface Memoryusage {
    rss: string;
    heapTotal: string;
    heapUsed: string;
    external: string;
    arrayBuffers: string;
}