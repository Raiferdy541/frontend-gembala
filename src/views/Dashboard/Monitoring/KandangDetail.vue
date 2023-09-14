<script>
import { mapActions, mapState } from "pinia";
import d$kandang from "@/stores/monitoring/daftarkandang";
import { ubahTanggal } from "@/utils/locale/ubahTanggal";

import { object as y$object, string as y$string, ref as y$ref } from "yup";

export default {
  metaInfo: () => ({
    title: "Populasi Kandang",
  }),
  setup() {
    const schema = y$object({});
    return {
      schema,
    };
  },
  data: () => ({
    pageTitle: "Populasi Kandang",
    // Input
    input: {
      id: null,
    },
    // UI
    modal: {
      detailTernak: false,
    },
    // DataTable
    dt: {
      column: [
        {
          name: "id_ternak",
          th: "Nomor Ternak",
        },
        {
          name: "bangsa",
          th: "Bangsa",
          render: ({ bangsa }) => (bangsa ? bangsa.bangsa : null),
        },
        {
          name: "fase",
          th: "Fase Pemeliharaan",
          render: ({ fase }) => (fase ? fase.fase : null),
        },
        {
          name: "kebutuhan_pakan",
          th: "Kebutuhan Pakan",
          render: ({ kebutuhan_pakan }) => kebutuhan_pakan + " Kg",
        },
        {
          name: "berat",
          th: "Berat Ternak",
          render: ({ berat }) => berat + " Kg",
        },
      ],
      action: [
        {
          text: "Detail",
          color: "info",
          event: "detail-penghuni-kandang",
        },
      ],
    },
    infoTernak: {},
  }),
  computed: {
    ...mapState(d$kandang, ["g$detailKandang"]),
    modals() {
      return Object.values(this.modal).includes(true);
    },
  },
  watch: {
    modals(val) {
      if (!val) {
        this.clearInput();
      }
    },
  },
  async mounted() {
    await this.a$kandangDetail(this.$route.params.id).catch((error) =>
      this.notify(error, false)
    );
  },
  methods: {
    ...mapActions(d$kandang, ["a$kandangDetail"]),
    clearInput() {
      this.input = {
        id: null,
      };
    },
    async triggerDetail(row) {
      try {
        this.infoTernak = { ...row };
        this.modal.detailTernak = true;
      } catch (error) {}
    },
    ubahTanggal,
  },
};
</script>

<template>
  <main-layout :title="pageTitle" disable-padding>
    <template #header>
      <div class="row align-items-center">
        <div class="col-auto">
          <h3>Daftar {{ pageTitle }}</h3>
        </div>
      </div>
    </template>

    <template #body>
      <empty-result v-if="!g$detailKandang.length" :text="`${pageTitle}`" />
      <data-table
        v-else
        :index="true"
        :data="g$detailKandang"
        :columns="dt.column"
        :actions="dt.action"
        @detail-penghuni-kandang="triggerDetail"
      />
    </template>

    <!-- Modal Detail Ternak -->
    <template #modal>
      <modal-comp v-model:show="modal.detailTernak" modal-classes="modal-md">
        <template #header>
          <h3 class="modal-title">
            Detail Ternak Nomor {{ infoTernak.id_ternak }}
          </h3>
        </template>
        <template v-if="modal.detailTernak" #body>
          <div style="max-height: 450px; overflow-y: auto; overflow-x: hidden">
            <div class="row">
              <!-- ID Ternak -->
              <div class="col-5">
                <span style="font-weight: 600">ID Ternak</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{ infoTernak.id_ternak }}</span
                >
              </div>
            </div>

            <!-- RFID -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">RFID</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300"> {{ infoTernak.qr_id }}</span>
              </div>
            </div>

            <!-- Bangsa -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">Bangsa</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{
                    infoTernak.bangsa ? infoTernak.bangsa.bangsa : "---"
                  }}</span
                >
              </div>
            </div>

            <!-- Jenis kelamin -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">Jenis Kelamin</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{
                    infoTernak.jenis_kelamin ? infoTernak.jenis_kelamin : "---"
                  }}</span
                >
              </div>
            </div>

            <!-- Tanggal lahir -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">Tanggal Lahir</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{
                    infoTernak.tanggal_lahir
                      ? ubahTanggal(infoTernak.tanggal_lahir)
                      : "---"
                  }}</span
                >
              </div>
            </div>

            <!-- Umur -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">Umur</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{ infoTernak.umur ?? "---" }}
                </span>
              </div>
            </div>

            <!-- ID sire (bapak) -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">ID Sire (Bapak)</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{ infoTernak.id_sire ?? "---" }}</span
                >
              </div>
            </div>

            <!-- ID dam (ibu) -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">ID Dam (Ibu)</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{ infoTernak.id_dam ?? "---" }}</span
                >
              </div>
            </div>

            <!-- Kode kandang -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">Kode Kandang</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{
                    infoTernak.kandang ? infoTernak.kandang.kode_kandang : "---"
                  }}</span
                >
              </div>
            </div>

            <!-- Fase -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">Fase Pemeliharaan</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{ infoTernak.fase ? infoTernak.fase.fase : "---" }}</span
                >
              </div>
            </div>

            <!-- Status -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">Status Ternak</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{
                    infoTernak.status_ternak
                      ? infoTernak.status_ternak.status_ternak
                      : "---"
                  }}</span
                >
              </div>
            </div>

            <!-- Jenis pakan -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">Jenis Pakan</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{
                    infoTernak.kandang
                      ? infoTernak.kandang.jenis_pakan.jenis_pakan
                      : "---"
                  }}</span
                >
              </div>
            </div>

            <!-- Berat -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">Berat</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{ infoTernak.berat ?? "---" }} Kg</span
                >
              </div>
            </div>

            <!-- Suhu -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">Suhu</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{ infoTernak.suhu ?? "---" }} °C</span
                >
              </div>
            </div>

            <!-- Status kesehatan -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">Status Kesehatan</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{ infoTernak.status_kesehatan ?? "---" }}</span
                >
              </div>
            </div>

            <!-- Tanggal masuk -->
            <div class="row">
              <div class="col-5">
                <span style="font-weight: 600">Tanggal Masuk</span>
              </div>
              <div class="col">
                :
                <span style="font-weight: 300">
                  {{
                    infoTernak.tanggal_masuk
                      ? ubahTanggal(infoTernak.tanggal_masuk)
                      : "---"
                  }}</span
                >
              </div>
            </div>
          </div>
        </template>
        <template #footer> </template>
      </modal-comp>
    </template>
  </main-layout>
</template>
