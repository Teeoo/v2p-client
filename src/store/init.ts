import { defineStore } from 'pinia';

export interface InitStateInterface {
  id: string;
  version: number;
  tag_name?: string;
}

export const useInitStore = defineStore('init', {
  state: (): InitStateInterface => ({ id: '', version: 0, tag_name: '' }),
  actions: {
    setInitVal(state: InitStateInterface) {
      this.id = state.id;
      this.version = state.version;
    },
    setTagName(name: string) {
      this.tag_name = name;
    }
  },
  getters: {
    getVersion(): string {
      return this.version.toString().split('').join('.');
    }
  }
});
