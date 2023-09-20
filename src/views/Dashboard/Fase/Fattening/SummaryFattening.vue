<script>
import { mapActions, mapState } from "pinia";
import useAuthStore from "@/stores/auth";
import d$fattening from "@/stores/fase/fattening";
import HcBar from "@/components/HighCharts/Bar.vue";

// In your Vue.js component.
import { VueperSlides, VueperSlide } from "vueperslides";
import "@/assets/vendor/vueperslides/vueperslides.css";

export default {
  metaInfo: () => ({
    title: "Fase Fattening",
  }),
  components: {
    HcBar,
    VueperSlides,
    VueperSlide,
  },
  data: () => ({
    pageTitle: "Fase Fattening",
    // DataTable
    dt: {
      column: [
        {
          name: "qr_id",
          th: "QR ID",
        },
        {
          th: "Kode Kandang",
          render: ({ kode_kandang }) => kode_kandang,
        },

        {
          th: "Bobot",
          render: ({ berat }) => (berat ? berat + " Kg" : null),
        },
        {
          th: "Bangsa",
          render: ({ bangsa }) => bangsa,
        },
        {
          th: "Jenis Kelamin",
          render: ({ jenis_kelamin }) => jenis_kelamin
        },
      ],
    },
  }),
  computed: {
    ...mapState(useAuthStore, ["userInfo"]),
    ...mapState(d$fattening, [
      "g$fattening",
      "g$byPopulasi",
      "g$kandang",
      "g$pakan",
    ]),
  },

  async mounted() {
    try {
      await this.a$listFattening();
    } catch (error) {
      this.notify(error, false);
    }
  },

  methods: {
    ...mapActions(d$fattening, ["a$listFattening"]),
  },
};
</script>

<template>
  <main-layout :title="pageTitle" is-full style="background: transparent">
    <template #header>
      <div class="row">
        <div class="col-sm-8">
          <h1 class="font-weight-bolder text-success">{{ pageTitle }}</h1>
        </div>
        <div class="col-sm-4">
          <div class="row">
            <span class="text-center m-2">
              <router-link to="/fase/fattening">
                <base-button type="success1" class:="btn-lg text-white">
                  Summary
                </base-button>
              </router-link>
            </span>
            <span class="text-center m-2">
              <router-link to="fattening/data-fattening">
                <base-button
                  v-if="userInfo.role !== 'bod'"
                  type="secondary"
                  class="btn-lg text-dark"
                >
                  {{ pageTitle }}
                </base-button>
              </router-link>
            </span>
            <span class="text-center m-2">
              <router-link to="fattening/langkah-kerja">
                <base-button
                  v-if="userInfo.role !== 'bod'"
                  type="secondary"
                  class="btn-lg text-dark"
                >
                  Langkah Kerja
                </base-button>
              </router-link>
            </span>
          </div>
        </div>
      </div>
      <div class="row" v-if="g$fattening.length">
        <div class="col-sm-4">
          <card-comp>
            <div class="row align-items-center">
              <div class="col">
                <h1
                  class="text-success text-left ls-1 mb-4"
                  style="font-size: 16px"
                >
                  Populasi {{ pageTitle }}
                </h1>
              </div>
            </div>
            <hc-bar
              :height="215"
              :data="g$byPopulasi"
              :data-labels="true"
              :legend="true"
            />
          </card-comp>
        </div>
        <div class="col-sm-8">
          <card-comp>
            <vueper-slides
              class="no-shadow"
              :visible-slides="4"
              slide-multiple
              :gap="4"
              :slide-ratio="1 / 3"
              :dragging-distance="10"
              :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }"
              fixed-height="200px"
            >
              <vueper-slide v-for="(key, value) in g$kandang" :key="key">
                <template #content>
                  <div class="col text-center bg-success rounded mt-5">
                    <h3 class="text-white pt-4">Kandang {{ value }}</h3>
                    <h1 class="text-white">{{ key }}</h1>
                    <p class="text-white pb-3">Ekor</p>
                  </div>
                </template>
              </vueper-slide>
            </vueper-slides>
          </card-comp>
        </div>
      </div>
      <div class="row ml-1" v-if="g$fattening.length">
        <h1 class="font-weight-bolder text-success">
          Daftar Ternak {{ pageTitle }}
        </h1>
      </div>
    </template>

    <template #body>
      <empty-result v-if="!g$fattening.length" :text="`${pageTitle}`" />
      <data-table
        v-else
        :index="true"
        :data="g$fattening"
        :columns="dt.column"
      />
    </template>
  </main-layout>
</template>
