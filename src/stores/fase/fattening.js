import { defineStore } from "pinia";
import * as s$fattening from "@/services/fase/fattening";

const u$fattening = defineStore({
  id: "fattening",
  state: () => ({
    fattening: [],
    sedangFattening: [],
    pakan:[],
    kandang: [],
    populasi: [],
  }),
  actions: {
    //List fattening (??)
    async a$fatteningListMain() {
      try {
        const { data } = await s$fattening.listMainTernak();
        this.fattening = data.list;
      } catch ({ error }) {
        this.fattening = [];
        throw error;
      }
    },

    //list Summary Fattening (??)
    async a$listTernak() {
      try {
        const { data } = await s$fattening.listTernak();
        // this.fattening = data.ternak.list;
        // this.kandang = data.kandang.list;
        // this.populasi = data.populasi;
        this.fattening = data.list;
        // console.log(data);
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
    g$listTernak: (state) => state.fattening,
    // g$listMainTernak: (state) => state.fattening,
    g$kandang: (state) => state.kandang,
    g$pakan: (state) => state.pakan,
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
