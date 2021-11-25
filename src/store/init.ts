import { defineStore } from 'pinia';

export interface InitStateInterface {
  id: string;
  version: number;
}

export const useInitStore = defineStore('init', {
  state: (): InitStateInterface => ({ id: '', version: 0 }),
  actions: {
    setInitVal(state: InitStateInterface) {
      this.id = state.id;
      this.version = state.version;
    }
  },
  getters: {
    getVersion(): string {
      return this.version.toString().split('').join('.');
    }
  }
});
