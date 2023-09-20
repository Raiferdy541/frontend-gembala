import { defineStore } from "pinia";
import * as s$fattening from "@/services/fase/fattening";

const u$fattening = defineStore({
  id: "fattening",
  state: () => ({
    fattening: [],
    total:[],
    sedangFattening: [],
    pakan:[],
    kandang: [],
    populasi: [],
    bobot: [],
  }),
  actions: {
    //List fattening (??)
    async a$fatteningList() {
      try {
        const { data } = await s$fattening.listMainTernak();
        this.fattening = data.list;
      } catch ({ error }) {
        this.fattening = [];
        throw error;
      }
    },

    //list Summary Fattening (??)
    async a$listFattening() {
      try {
        const { data } = await s$fattening.listTernak();
        this.total = data.total;
        this.populasi = data;
        this.kandang = data.total_per_kandang;
        this.fattening = data.list;
        console.log(this.fattening);
      } catch ({ error }) {
        this.fattening = [];
        throw error;
      }
    },

    //Create fattening
    async a$createfattening(req) {
      try {
        await s$fattening.create(req);
      } catch ({ error }) {
        throw error;
      }
    },

    // List sedang kawin
    async a$sedangFattening() {
      try {
        const { data } = await s$fattening.sedangFattening();
        this.sedangFattening = data.data;
      } catch ({ error }) {
        this.sedangFattening = [];
        throw error;
      }
    },

    // Update fattening
    async a$updatefattening(req) {
      try {
        await s$fattening.updatefattening(req);
      } catch ({ error }) {
        throw error;
      }
    },
  },

  getters: {
    g$fattening: (state) => state.fattening,
    g$kandang: (state) => state.kandang,
    g$bobot: (state) => state.bobot,
    g$pakan: (state) => state.pakan,
    g$total: (state) => state.total,
    g$ternakBetina: (state) => state.ternakBetina,
    g$ternakJantan: (state) => state.ternakJantan,
    g$byPopulasi: (state) => ({
      categories: ["Total", "Jantan", "Betina"],
      series: [
        {
          name: "Populasi",
          color: "#006329",
          data: [
            state.populasi.total,
            state.populasi.jantan,
            state.populasi.betina,
          ],
        },
      ],
    }),
  },
});

export default u$fattening;
