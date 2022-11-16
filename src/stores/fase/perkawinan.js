import { defineStore } from "pinia";
import * as s$perkawinan from "@/services/fase/perkawinan";
import * as s$dropdown from "@/services/dropdown";

const u$perkawinan = defineStore({
  id: "perkawinan",
  state: () => ({
    perkawinan: [],
    indukan: [],
    pejantan: [],
  }),
  actions: {
    //List Perkawinan
    async a$perkawinanList() {
      try {
        const { data } = await s$perkawinan.list();
        this.perkawinan = data.data;
      } catch ({ error }) {
        this.perkawinan = [];
        throw error;
      }
    },

    //List Indukan
    async a$listIndukan() {
      try {
        const { data } = await s$perkawinan.listIndukan();
        this.indukan = data.list;
      } catch ({ error }) {
        this.indukan = [];
        throw error;
      }
    },

    //List Pejantan
    async a$listPejantan() {
      try {
        const { data } = await s$dropdown.dropdown();
        this.pejantan = data.pejantan_perkawinan;
      } catch ({ error }) {
        this.pejantan = [];
        throw error;
      }
    },

    //Create Perkawinan
    async a$createPerkawinan(req) {
      try {
        await s$perkawinan.create(req);
      } catch ({ error }) {
        throw error;
      }
    },
  },

  getters: {
    g$listPerkawinan: (state) => state.perkawinan,
    g$listIndukan: (state) => state.indukan,
    g$listPejantan: (state) => state.pejantan,
  },
});

export default u$perkawinan;