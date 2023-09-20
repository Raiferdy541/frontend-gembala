<script>
import { mapActions, mapState } from "pinia";
import HcColumn from "@/components/HighCharts/Column.vue";
import HcLine from "@/components/HighCharts/Line.vue";
import HcPie from "@/components/HighCharts/Pie.vue";
import HcBar from "@/components/HighCharts/Bar.vue";
import HcAreaSpline from "@/components/HighCharts/AreaSpline.vue";
import d$dashboard from "@/stores/dashboard";
import Cuaca from "../../components/HighCharts/Cuaca.vue";
import d$user from "@/stores/user";
import d$dropdown from "@/stores/dropdown";
import d$cuaca from "@/stores/cuaca";

export default {
  metaInfo: () => ({
    title: "Beranda",
  }),
  components: {
    HcColumn,
    HcLine,
    HcPie,
    HcBar,
    HcAreaSpline,
    Cuaca,
  },
  data: () => ({
    pageTitle: "Beranda",
  }),
  computed: {
    ...mapState(d$dashboard, [
      "g$totalByStatus",
      "g$totalKandang",
      "g$totalTernak",
      "g$totalByFase",
      "g$totalByStatusKeluar",
      "g$totalAdgCempe",
      "g$totalByKandang",
      "g$totalPopulasi",
    ]),
    ...mapState(d$user, ["g$userPeternakan"]),
    ...mapState(d$dropdown, ["g$ddJenisKandang"]),
    ...mapState(d$cuaca, ["g$cuaca"]),
    modals() {
      return Object.values(this.modal).includes(true);
    },
  },
  methods: {
    ...mapActions(d$dashboard, [
      "a$totalByStatus",
      "a$totalKandang",
      "a$totalTernak",
      "a$totalByFase",
      "a$totalByStatusKeluar",
      "a$totalByKandang",
      "a$totalAdgCempe",
      "a$populasi",
    ]),
    ...mapActions(d$user, ["a$userDetail"]),
    ...mapActions(d$dropdown, ["a$ddJenisKandang"]),
    ...mapActions(d$dropdown, ["a$ddJenisKandang"]),
    ...mapActions(d$cuaca, ["a$getWeather"]),
  },
  async mounted() {
    await this.a$userDetail();
    this.a$totalByStatus().catch((error) => this.notify(error, false));
    this.a$totalKandang().catch((error) => this.notify(error, false));
    this.a$totalTernak().catch((error) => this.notify(error, false));
    this.a$totalByFase().catch((error) => this.notify(error, false));
    this.a$totalByStatusKeluar().catch((error) => this.notify(error, false));
    this.a$totalByKandang().catch((error) => this.notify(error, false));
    this.a$totalAdgCempe().catch((error) => this.notify(error, false));
    this.a$populasi().catch((error) => this.notify(error, false));
    this.a$ddJenisKandang().catch((error) => this.notify(error, false));
    this.a$getWeather(
      this.g$userPeternakan.latitude,
      this.g$userPeternakan.longitude
    );
  },
};
</script>

<template>
  <main-layout :title="pageTitle" is-full>
    <template #body>
      <div class="row">
        <!-- kolom pertama -->
        <div class="col-sm-4">
          <card-comp type="success">
            <h1
              class="text-white text-uppercase text-center ls-1 mt-0 mb-2"
              style="font-size: 12px"
            >
              Grafik Populasi Domba {{ g$userPeternakan.nama_peternakan }} ({{
                new Date().getFullYear()
              }})
            </h1>
            <hc-area-spline
              :height="200"
              :data="g$totalPopulasi"
              :data-labels="true"
              :legend="true"
            />
          </card-comp>
          <card-comp type="success align-items-center">
            <div class="row">
              <div class="col">
                <h1
                  class="text-white text-uppercase text-center ls-1 mb-2"
                  style="font-size: 12px"
                >
                  Detail Populasi Domba {{ g$userPeternakan.nama_peternakan }}
                </h1>
              </div>
            </div>
            <hc-pie
              :title="
                g$totalTernak.total_ternak
                  ? g$totalTernak.total_ternak.toString()
                  : '0'
              "
              :height="245"
              :width="320"
              :data="g$totalByStatus"
              :data-labels="true"
              :legend="true"
            />
          </card-comp>
        </div>

        <!-- kolom kedua -->
        <div class="col-sm-4" style="width: 100%">
          <div class="row">
            <div class="col-sm-6">
              <card-comp type="success">
                <h4 class="text-white mt--2">Kandang</h4>
                <p class="text-white mt--2" style="font-size: 12px">
                  Total Kandang
                </p>
                <div class="row mb--3">
                  <div class="col-5">
                    <h1
                      class="text-white mt--4 mb--3 mr--2"
                      style="font-size: 32px"
                    >
                      {{ g$totalKandang.total_kandang }}
                    </h1>
                  </div>
                  <div class="col-7">
                    <h4 class="text-white mt--2 ml--3">Kandang</h4>
                  </div>
                </div>
              </card-comp>
            </div>
            <div class="col-sm-6">
              <card-comp type="success">
                <h4 class="text-white mt--2">Populasi Ternak</h4>
                <p class="text-white mt--2" style="font-size: 12px">
                  Semua Fase
                </p>
                <div class="row mb--3">
                  <div class="col-5">
                    <h1
                      class="text-white mt--4 mb--3 mr--2"
                      style="font-size: 32px"
                    >
                      {{ g$totalTernak.total_ternak }}
                    </h1>
                  </div>
                  <div class="col-7">
                    <h4 class="text-white mt--2 ml--3">Ekor</h4>
                  </div>
                </div>
              </card-comp>
            </div>
          </div>
          <card-comp type="success" class="mt--1">
            <div class="row align-items-center">
              <div class="col">
                <h1 class="text-white text-left mb-4" style="font-size: 24px">
                  Fase Pemeliharaan
                </h1>
                <div class="col-0 mb-3">
                  <base-button
                    type="secondary"
                    class="btn-md"
                    style="width: 100%"
                  >
                    <router-link to="/fase/pemasukan">
                      <div class="row">
                        <div
                          class="col-6 text-success text-left"
                          style="font-family: inherit"
                        >
                          Fase Pemasukan
                        </div>
                        <div
                          class="col-3 text-success font-weight-bolder"
                          style="font-size: x-large"
                        >
                          {{
                            g$totalByFase[1] ? g$totalByFase[1].total_ternak : 0
                          }}
                        </div>
                        <div class="col-3 text-success">Ekor</div>
                      </div>
                    </router-link>
                  </base-button>
                </div>
                <div class="col-0 mb-3">
                  <base-button
                    type="secondary"
                    class="btn-md"
                    style="width: 100%"
                  >
                    <router-link to="/fase/adaptasi">
                      <div class="row">
                        <div
                          class="col-6 text-success text-left"
                          style="font-family: inherit"
                        >
                          Fase Adaptasi
                        </div>
                        <div
                          class="col-3 text-success font-weight-bolder"
                          style="font-size: x-large"
                        >
                          {{
                            g$totalByFase[0] ? g$totalByFase[0].total_ternak : 0
                          }}
                        </div>
                        <div class="col-3 text-success">Ekor</div>
                      </div>
                    </router-link>
                  </base-button>
                </div>
                <div class="col-0 mb-3">
                  <base-button
                    type="secondary"
                    class="btn-md"
                    style="width: 100%"
                  >
                    <router-link to="/fase/perkawinan">
                      <div class="row">
                        <div
                          class="col-6 text-success text-left"
                          style="font-family: inherit"
                        >
                          Fase Perkawinan
                        </div>
                        <div
                          class="col-3 text-success font-weight-bolder"
                          style="font-size: x-large"
                        >
                          {{
                            g$totalByFase[2] ? g$totalByFase[2].total_ternak : 0
                          }}
                        </div>
                        <div class="col-3 text-success">Ekor</div>
                      </div>
                    </router-link>
                  </base-button>
                </div>
                <div class="col-0 mb-3">
                  <base-button
                    type="secondary"
                    class="btn-md"
                    style="width: 100%"
                  >
                    <router-link to="/fase/kebuntingan">
                      <div class="row">
                        <div
                          class="col-6 text-success text-left"
                          style="font-family: inherit"
                        >
                          Fase Kebuntingan
                        </div>
                        <div
                          class="col-3 text-success font-weight-bolder"
                          style="font-size: x-large"
                        >
                          {{
                            g$totalByFase[3] ? g$totalByFase[3].total_ternak : 0
                          }}
                        </div>
                        <div class="col-3 text-success">Ekor</div>
                      </div>
                    </router-link>
                  </base-button>
                </div>
                <div class="col-0 mb-3">
                  <base-button
                    type="secondary"
                    class="btn-md"
                    style="width: 100%"
                  >
                    <router-link to="/fase/kelahiran">
                      <div class="row">
                        <div
                          class="col-6 text-success text-left"
                          style="font-family: inherit"
                        >
                          Fase Kelahiran
                        </div>
                        <div
                          class="col-3 text-success font-weight-bolder"
                          style="font-size: x-large"
                        >
                          {{
                            g$totalByFase[4] ? g$totalByFase[4].total_ternak : 0
                          }}
                        </div>
                        <div class="col-3 text-success">Ekor</div>
                      </div>
                    </router-link>
                  </base-button>
                </div>
                <div class="col-0 mb-3">
                  <base-button
                    type="secondary"
                    class="btn-md"
                    style="width: 100%"
                  >
                    <router-link to="/fase/lepas-sapih">
                      <div class="row">
                        <div
                          class="col-6 text-success text-left"
                          style="font-family: inherit"
                        >
                          Fase Lepas Sapih
                        </div>
                        <div
                          class="col-3 text-success font-weight-bolder"
                          style="font-size: x-large"
                        >
                          {{
                            g$totalByFase[5] ? g$totalByFase[5].total_ternak : 0
                          }}
                        </div>
                        <div class="col-3 text-success">Ekor</div>
                      </div>
                    </router-link>
                  </base-button>
                </div>
                <div class="col-0 mb-3">
                  <base-button
                    type="secondary"
                    class="btn-md"
                    style="width: 100%"
                  >
                    <router-link to="/fase/fattening">
                      <div class="row">
                        <div
                          class="col-6 text-success text-left"
                          style="font-family: inherit"
                        >
                          Fase Fattening
                        </div>
                        <div
                          class="col-3 text-success font-weight-bolder"
                          style="font-size: x-large"
                        >
                          {{
                            g$totalByFase[6] ? g$totalByFase[6].total_ternak : 0
                          }}
                        </div>
                        <div class="col-3 text-success">Ekor</div>
                      </div>
                    </router-link>
                  </base-button>
                </div>
              </div>
            </div>
          </card-comp>
        </div>

        <!-- kolom ketiga -->
        <div class="col-sm-4">
          <!-- cuaca -->
          <card-comp type="success">
            <h1
              class="text-white text-uppercase text-center ls-1 mt-0 mb-2"
              style="font-size: 12px"
            >
              Cuaca saat ini di {{ g$userPeternakan.nama_peternakan }}
            </h1>
            <cuaca :cuaca="g$cuaca" />
          </card-comp>
          <card-comp type="success">
            <div class="row align-items-center">
              <div class="col">
                <h1
                  class="text-white text-uppercase text-center ls-1 mb-2"
                  style="font-size: 12px"
                >
                  Grafik Rata-Rata Bobot Cempe ({{ new Date().getFullYear() }})
                </h1>
              </div>
            </div>
            <hc-area-spline
              :height="255"
              :data="g$totalAdgCempe"
              :data-labels="true"
              :legend="true"
            />
          </card-comp>
        </div>
      </div>
      <div class="row mt--3">
        <div class="col-sm-8">
          <card-comp type="success">
            <div class="row text-white">
              <div class="col-sm-3">
                <div class="bg-white p-3 rounded">
                  <h3 class="text-dark text-center">Populasi Kandang</h3>
                </div>
              </div>
              <div class="col-sm-9">
                <div class="row text-center">
                  <div class="col-sm-2 text-center border-right">
                    <h6 class="text-white m-0">
                      {{
                        g$totalByKandang[0]
                          ? g$totalByKandang[0].jenis_kandang
                          : g$ddJenisKandang[0]
                          ? g$ddJenisKandang[0].name
                          : ""
                      }}
                    </h6>
                    <h2
                      class="text-white m-0"
                      style="font-size: x-large; font-weight: bold"
                    >
                      {{
                        g$totalByKandang[0]
                          ? g$totalByKandang[0].total_ternak
                          : 0
                      }}
                    </h2>
                    <h5 class="text-white m-0">Ekor</h5>
                  </div>
                  <div class="col-sm-2 border-right">
                    <h6 class="text-white m-0">
                      {{
                        g$totalByKandang[1]
                          ? g$totalByKandang[1].jenis_kandang
                          : g$ddJenisKandang[1]
                          ? g$ddJenisKandang[1].name
                          : ""
                      }}
                    </h6>
                    <h2
                      class="text-white m-0"
                      style="font-size: x-large; font-weight: bold"
                    >
                      {{
                        g$totalByKandang[1]
                          ? g$totalByKandang[1].total_ternak
                          : 0
                      }}
                    </h2>
                    <h5 class="text-white m-0">Ekor</h5>
                  </div>
                  <div class="col-sm-2 border-right">
                    <h6 class="text-white m-0">
                      {{
                        g$totalByKandang[2]
                          ? g$totalByKandang[2].jenis_kandang
                          : g$ddJenisKandang[2]
                          ? g$ddJenisKandang[2].name
                          : ""
                      }}
                    </h6>
                    <h2
                      class="text-white m-0"
                      style="font-size: x-large; font-weight: bold"
                    >
                      {{
                        g$totalByKandang[2]
                          ? g$totalByKandang[2].total_ternak
                          : 0
                      }}
                    </h2>
                    <h5 class="text-white m-0">Ekor</h5>
                  </div>
                  <div class="col-sm-2 border-right">
                    <h6 class="text-white m-0">
                      {{
                        g$totalByKandang[3]
                          ? g$totalByKandang[3].jenis_kandang
                          : g$ddJenisKandang[3]
                          ? g$ddJenisKandang[3].name
                          : ""
                      }}
                    </h6>
                    <h2
                      class="text-white m-0"
                      style="font-size: x-large; font-weight: bold"
                    >
                      {{
                        g$totalByKandang[3]
                          ? g$totalByKandang[3].total_ternak
                          : 0
                      }}
                    </h2>
                    <h5 class="text-white m-0">Ekor</h5>
                  </div>
                  <div class="col-sm-2 border-right">
                    <h6 class="text-white m-0">
                      {{
                        g$totalByKandang[4]
                          ? g$totalByKandang[4].jenis_kandang
                          : g$ddJenisKandang[4]
                          ? g$ddJenisKandang[4].name
                          : ""
                      }}
                    </h6>
                    <h2
                      class="text-white m-0"
                      style="font-size: x-large; font-weight: bold"
                    >
                      {{
                        g$totalByKandang[4]
                          ? g$totalByKandang[4].total_ternak
                          : 0
                      }}
                    </h2>
                    <h5 class="text-white m-0">Ekor</h5>
                  </div>
                  <div class="col-sm-2">
                    <h6 class="text-white m-0">
                      {{
                        g$totalByKandang[5]
                          ? g$totalByKandang[5].jenis_kandang
                          : g$ddJenisKandang[5]
                          ? g$ddJenisKandang[5].name
                          : ""
                      }}
                    </h6>
                    <h2
                      class="text-white m-0"
                      style="font-size: x-large; font-weight: bold"
                    >
                      {{
                        g$totalByKandang[5]
                          ? g$totalByKandang[5].total_ternak
                          : 0
                      }}
                    </h2>
                    <h5 class="text-white m-0">Ekor</h5>
                  </div>
                </div>
              </div>
            </div>
          </card-comp>
        </div>
        <div class="col-sm-4">
          <card-comp type="success">
            <div class="row align-items-center">
              <div class="col">
                <h1
                  class="text-white text-uppercase text-center mt--3 ls-1 mb-1"
                  style="font-size: 12px"
                >
                  Status Keluar
                </h1>
              </div>
            </div>
            <div class="row mt-3 mb--3">
              <div class="col-sm-4">
                <div class="bg-white rounded">
                  <p class="text-lg text-dark text-center font-weight-bolder">
                    {{ g$totalByStatusKeluar.total_dijual }}
                  </p>
                  <p
                    class="text-dark text-center mt--3 pb-3 font-weight-bolder"
                    style="font-size: 12px; font-family: inherit"
                  >
                    Dijual
                  </p>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="bg-white rounded">
                  <p class="text-lg text-dark text-center font-weight-bolder">
                    {{ g$totalByStatusKeluar.total_disembelih }}
                  </p>
                  <p
                    class="text-dark text-center mt--3 pb-3 font-weight-bolder"
                    style="font-size: 12px; font-family: inherit"
                  >
                    Disembelih
                  </p>
                </div>
              </div>
              <div class="col-sm-4">
                <div class="bg-white rounded">
                  <p class="text-lg text-dark text-center font-weight-bolder">
                    {{ g$totalByStatusKeluar.total_mati }}
                  </p>
                  <p
                    class="text-dark text-center mt--3 pb-3 font-weight-bolder"
                    style="font-size: 12px; font-family: inherit"
                  >
                    Mati
                  </p>
                </div>
              </div>
            </div>
          </card-comp>
        </div>
      </div>
    </template>
  </main-layout>
</template>
