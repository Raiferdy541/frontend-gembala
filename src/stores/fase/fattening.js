import { defineStore } from "pinia";
import * as s$fattening from "@/services/fase/fattening";

const u$fattening = defineStore({
  id: "fattening",
  state: () => ({
    qr_id : []
  }),
  actions: {
    // Get ternak lepas sapih
    async a$ternakFattening() {
      try {
        const { data } = await s$fattening.ternakFattening();
        this.qr_id = data.list;
      } catch ({ error }) {
        this.qr_id = [];
        throw error;
      }
    },
  },

  getters: {
    g$qr_id: (state) => state.qr_id,
    // g$kandang: (state) => state.kandang,
    // g$cempe: (state) => state.cempe,
    // g$ternakLepasSapih: (state) => state.ternakLepasSapih,
    // g$statusSeleksi: (state) => state.statusSeleksi,
    // g$byPopulasi: (state) => ({
    //   categories: ["Total", "Total Jantan", "Total Betina"],
    //   series: [
    //     {
    //       name: "Populasi",
    //       color: "#006329",
    //       data: [
    //         state.populasi.total,
    //         state.populasi.total_jantan,
    //         state.populasi.total_betina,
    //       ],
    //     },
    //   ],
    // }),
  },
});

export default u$fattening;
