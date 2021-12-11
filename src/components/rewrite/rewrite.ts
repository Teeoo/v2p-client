export interface RewriteLists {
    rewrite: Rewrite
    rewritesub: Rewritesub
}

export interface Rewrite {
    note: string
    total: number
    active: number
    list: List[]
}

export interface List {
    match: string
    target: string
    enable: boolean
    stage: string
}

export interface Rewritesub {
    [keys: string]: SubscribeList
}

export interface SubscribeList {
    [keys: string]: string | number | boolean | List[]
    name: string
    resource: string
    type: string
    note: string
    date: string
    total: number
    active: number
    enable: boolean
    bkcolor: string
    collapse: boolean
    list: List[]
}