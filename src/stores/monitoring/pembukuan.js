import { defineStore } from "pinia";
import * as s$PembukuanPakan from "@/services/monitoring/pembukuan";

const u$PembukuanPakan = defineStore({
  id: "pembukuanPakan",
  state: () => ({
    pembukuanPakan: [],
    detailPembukuanPakan: [],
    detailNamaPembukuanPakan: [],
  }),
  actions: {
    async a$exportExcel(req) {
      try {
        const { data } = await s$PembukuanPakan.exportEx(req);
        this.exports = data;
        console.log(this.exports)
      } catch ({ error }) {
        this.exports = [];
        throw error;
      }
    },
    // Bahan pakan
    async a$PembukuanPakanList(request) {
      try {
        const { data } = await s$PembukuanPakan.listJenisPembukuanPakan(request);
        this.pembukuanPakan = data.list;
      } catch ({ error }) {
        this.pakan = [];
        throw error;
      }
    },
    async a$PembukuanPakanAdd(request) {
      try {
        await s$PembukuanPakan.add(request);
      } catch ({ error }) {
        throw error;
      }
    },
    async a$PembukuanPakanEdit(request) {
      try {
        await s$PembukuanPakan.edit(request);
      } catch ({ error }) {
        throw error;
      }
    },
    async a$PembukuanPakanDelete(request) {
      try {
        await s$PembukuanPakan.del(request);
      } catch ({ error }) {
        throw error;
      }
    },

    // Detail bahan pakan
    async a$PembukuanPakanDetail(req) {
      try {
        const { data } = await s$PembukuanPakan.listNamaPembukuanPakan(req);
        this.detailNamaPembukuanPakan = data.list[0].jenis_bahan_pakan;
        const { data: data2 } = await s$PembukuanPakan.listPembukuanPakan(req);
        this.detailPembukuanPakan = data2.list;
      } catch ({ error }) {
        this.detailPembukuanPakan = [];
        throw error;
      }
    },
    async a$PembukuanPakanDetailAdd(request) {
      try {
        await s$PembukuanPakan.tambahPembukuanPakan(request);
      } catch ({ error }) {
        throw error;
      }
    },
  },
  getters: {
    g$exportExcel:(state) => state.exports,
    g$PembukuanPakanList: (state) => state.pembukuanPakan,
    g$detailPembukuanPakan: (state) => state.detailPembukuanPakan,
    g$detailNamaPembukuanPakan: (state) => state.detailNamaPembukuanPakan,
  },
});

export default u$PembukuanPakan;
