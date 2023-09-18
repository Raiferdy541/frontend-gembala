import { defineStore } from "pinia";
import * as s$perkawinan from "@/services/fase/perkawinan";
import * as s$dropdown from "@/services/dropdown";

const u$perkawinan = defineStore({
  id: "perkawinan",
  state: () => ({
    perkawinan: [],
    sedangKawin: [],
    indukan: [],
    pejantan: [],
    kandang: [],
    populasi: [],
    statusPerkawinan: ['Bunting', 'Tidak Bunting'],
  }),
  actions: {
    //List Perkawinan
    async a$perkawinanList() {
      try {
        const { data } = await s$perkawinan.list();
        this.perkawinan = data.list;
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

    //list Summary Perkawinan
    async a$listPerkawinan() {
      try {
        const { data } = await s$perkawinan.listPerkawinan();
        this.perkawinan = data.ternak.list;
        this.kandang = data.kandang.list;
        this.populasi = data.populasi;
      } catch ({ error }) {
        this.perkawinan = [];
        throw error;
      }
    },

    // List sedang kawin
    async a$sedangKawin() {
      try {
        const { data } = await s$perkawinan.sedangKawin();
        this.sedangKawin = data.data;
      } catch ({ error }) {
        this.sedangKawin = [];
        throw error;
      }
    },

    // Update perkawinan
    async a$updatePerkawinan(req) {
      try {
        await s$perkawinan.updatePerkawinan(req);
      } catch ({ error }) {
        throw error;
      }
    },
  },

  getters: {
    g$listPerkawinan: (state) => state.perkawinan,
    g$kandang: (state) => state.kandang,
    g$byPopulasi: (state) => ({
      categories: ["Total"],
      series: [
        {
          name: "Populasi",
          color: "#006329",
          data: [state.populasi.total],
        },
      ],
    }),
  },
});

export default u$perkawinan;
