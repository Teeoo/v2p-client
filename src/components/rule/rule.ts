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

export const mtype = [
    'url',
    'host',
    'useragent',
    'reqmethod',
    'reqbody',
    'resstatus',
    'restype',
    'resbody',
];

export const ctype = [
    { label: 'JS', val: 'js' },
    { label: '307 重定向', val: '307' },
    { label: '阻止', val: 'block' },
    { label: '$HOLD', val: 'hold' },
    { label: 'User-Agent', val: 'ua' },
];

export const stage = [
    { label: '网络请求前', val: 'req' },
    { label: '数据返回前', val: 'res' },
];
