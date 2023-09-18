<script>
import { mapActions, mapState } from "pinia";
import d$perkawinan from "@/stores/fase/fattening";
import d$kandang from "@/stores/monitoring/daftarkandang";
import { ubahTanggal } from "@/utils/locale/ubahTanggal";

export default {
  metaInfo: () => ({
    title: "Fase Fattening",
  }),
  data: () => ({
    pageTitle: "Fase Fattening",
    input: {
      id_perkawinan: null,
      status: null,
      kandang: null,
      usg_1: null,
      usg_2: null,
    },
    //UI
    modal: {
      createPerkawinan: false,
      usg1: false,
      usg2: false,
    },
    loading: false,
    loadingModal: false,
    // DataTable
    dt: {
      column: [
        {
          th: "Tanggal",
          render: ({ tanggal_perkawinan }) => ubahTanggal(tanggal_perkawinan),
        },
        {
          name: "id_indukan",
          th: "ID Indukan",
        },
        {
          name: "id_pejantan",
          th: "ID Pejantan",
        },
        {
          th: "Kode Kandang",
          render: ({ kandang }) => kandang.kode_kandang,
        },
        {
          th: "USG 1",
          render: ({ usg_1 }) =>
            usg_1
              ? '<i class="fas fa-solid fa-check text-success" style="font-size: 30px;"></i>'
              : '<i class="fas fa-solid fa-x text-danger" style="font-size: 20px;"></i>',
        },
        {
          th: "USG 2",
          render: ({ usg_2 }) =>
            usg_2
              ? '<i class="fas fa-solid fa-check text-success" style="font-size: 30px;"></i>'
              : '<i class="fas fa-solid fa-x text-danger" style="font-size: 20px;"></i>',
        },
        {
          name: "status",
          th: "Status",
        },
      ],
      action: [
        {
          text: "USG 1",
          color: "primary",
          show: ({ usg_1 }) => !usg_1,
          event: "usg1",
        },
        {
          text: "USG 2",
          color: "primary",
          show: ({ usg_1, usg_2 }) => usg_1 && !usg_2,
          event: "usg2",
        },
      ],
    },
  }),
  computed: {
    ...mapState(d$perkawinan, [
      "g$sedangKawin",
      "g$listPerkawinan",
      "g$listIndukan",
      "g$listPejantan",
      "g$statusPerkawinan",
    ]),
    ...mapState(d$kandang, ["g$kandangList"]),
  },
  async mounted() {
    this.a$sedangKawin().catch((error) => this.notify(error, false));
    this.a$kandangList().catch((error) => this.notify(error, false));
  },
  methods: {
    ...mapActions(d$perkawinan, [
      "a$perkawinanList",
      "a$sedangKawin",
      "a$listIndukan",
      "a$listPejantan",
      "a$createPerkawinan",
      "a$updatePerkawinan",
    ]),
    ...mapActions(d$kandang, ["a$kandangList"]),
    clearInput() {
      this.input = {
        id_perkawinan: null,
        status: null,
        id_kandang: null,
        usg_1: null,
        usg_2: null,
      };
    },
    async triggerCreatePerkawinan() {
      this.modal.createPerkawinan = true;
      this.loadingModal = true;
      await this.a$listIndukan().catch((error) => this.notify(error, false));
      await this.a$listPejantan().catch((error) => this.notify(error, false));
      this.loadingModal = false;
    },
    triggerUSG1(row) {
      this.input = row;
      this.modal.usg1 = true;
    },
    triggerUSG2(row) {
      this.input = row;
      this.modal.usg2 = true;
    },
    async createPerkawinan() {
      this.loading = true;
      try {
        const { id_indukan, id_pejantan } = this.input;
        const data = {
          id_indukan: id_indukan.id_ternak,
          id_pejantan: id_pejantan.id_ternak,
        };
        await this.a$createPerkawinan(data);
        this.notify("Berhasil menambahkan perkawinan");
        this.modal.createPerkawinan = false;
        this.clearInput();
        await this.a$sedangKawin().catch((error) => this.notify(error, false));
      } catch (error) {
        this.notify(error, false);
      }
      this.loading = false;
    },

    async updatePerkawinanUsg1() {
      this.loading = true;
      try {
        const { id_perkawinan, status, kandang } = this.input;
        const data = {
          id_perkawinan,
          status,
          id_kandang: kandang.id_kandang,
          usg_1: true,
          usg_2: false,
        };
        await this.a$updatePerkawinan(data);
        this.notify("Berhasil memperbarui perkawinan");
        this.modal.usg1 = false;
        await this.a$sedangKawin().catch((error) => this.notify(error, false));
      } catch (error) {
        this.notify(error, false);
      }
      this.loading = false;
    },

    async updatePerkawinanUsg2() {
      this.loading = true;
      try {
        const { id_perkawinan, status, kandang } = this.input;
        const data = {
          id_perkawinan,
          status,
          id_kandang: kandang.id_kandang,
          usg_1: true,
          usg_2: true,
        };
        await this.a$updatePerkawinan(data);
        this.notify("Berhasil memperbarui perkawinan");
        this.modal.usg2 = false;
        await this.a$sedangKawin().catch((error) => this.notify(error, false));
      } catch (error) {
        this.notify(error, false);
      }
      this.loading = false;
    },
  },
};
</script>

<template>
  <main-layout :title="pageTitle" disable-padding>
    <template #header>
      <div class="col-sm">
        <div class="row">
          <span class="text-center m-2">
            <router-link to="../fattening">
              <base-button type="secondary" class="btn-lg text-dark">
                Summary
              </base-button>
            </router-link>
          </span>
          <span class="text-center m-2">
            <router-link to="sedang-fattening">
              <base-button type="success1" class="btn-lg text-white">
                {{ pageTitle }}
              </base-button>
            </router-link>
          </span>
          <span class="text-center m-2">
            <router-link to="langkah-kerja">
              <base-button type="secondary" class="btn-lg text-dark">
                Langkah Kerja
              </base-button>
            </router-link>
          </span>
        </div>
      </div>
      <div class="row align-items-center">
        <div class="col-auto">
          <h3>Daftar {{ pageTitle }}</h3>
        </div>
        <div class="col-auto">
          <span class="text-center m-2">
            <router-link to="data-fattening">
              <base-button type="secondary" class="btn-lg text-dark">
                Riwayat Perkawinan
              </base-button>
            </router-link>
          </span>
          <span class="text-center m-2">
            <router-link to="sedang-kawin">
              <base-button type="success1" class="btn-lg text-white">
                Sedang Kawin
              </base-button>
            </router-link>
          </span>
        </div>
        <div class="col text-right">
          <base-button type="success" @click="triggerCreatePerkawinan">
            <span>Tambah {{ pageTitle }}</span>
          </base-button>
        </div>
      </div>
    </template>

    <template #body>
      <empty-result v-if="!g$sedangKawin.length" :text="`${pageTitle}`" />
      <data-table
        v-else
        :index="true"
        :data="g$sedangKawin"
        :columns="dt.column"
        :actions="dt.action"
        @usg1="triggerUSG1"
        @usg2="triggerUSG2"
      />
    </template>

    <template #modal>
      <!-- Create fase perkawinan -->
      <modal-comp
        v-model:show="modal.createPerkawinan"
        modal-classes="modal-md"
      >
        <template #header>
          <h3 class="modal-title">Tambah {{ pageTitle }} Baru</h3>
        </template>
        <template #body>
          <div v-if="loadingModal">
            <i class="fa fa-spinner fa-spin"></i> Sedang memuat...
          </div>
          <div v-else>
            <form-comp v-if="modal.createPerkawinan">
              <div class="row">
                <!-- id_indukan -->
                <div class="col-12">
                  <base-input name="id_indukan" label="ID Indukan">
                    <multi-select
                      v-model="input.id_indukan"
                      :options="g$listIndukan"
                      label="id_ternak"
                      track-by="id_ternak"
                      placeholder="Pilih ID Indukan"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- id_pejantan -->
                <div class="col-12">
                  <base-input name="id_pejantan" label="ID Pejantan">
                    <multi-select
                      v-model="input.id_pejantan"
                      :options="g$listPejantan"
                      label="id_ternak"
                      track-by="id_ternak"
                      placeholder="Pilih ID Pejantan"
                      :show-labels="false"
                    />
                  </base-input>
                </div>
              </div>
            </form-comp>
          </div>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.createPerkawinan = false">
            Tutup
          </base-button>
          <base-button type="primary" @click="createPerkawinan">
            <span v-if="!loading">Tambah {{ pageTitle }}</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang menambahkan...
            </span>
          </base-button>
        </template>
      </modal-comp>

      <!-- Update perkawinan USG 1-->
      <modal-comp v-model:show="modal.usg1" modal-classes="modal-md">
        <template #header>
          <h3 class="modal-title">Perbarui Status USG 1</h3>
        </template>
        <template #body>
          <form-comp v-if="modal.usg1">
            <div class="row">
              <!-- Status perkawinan -->
              <div class="col-12">
                <base-input name="status" label="Status">
                  <multi-select
                    v-model="input.status"
                    :options="g$statusPerkawinan"
                    placeholder="Pilih status"
                    :show-labels="false"
                  />
                </base-input>
              </div>

              <!-- Kode kandang -->
              <div class="col-12">
                <base-input name="kode_kandang" label="Pilih kandang">
                  <multi-select
                    v-model="input.kandang"
                    :options="g$kandangList"
                    track-by="id_kandang"
                    label="kode_kandang"
                    placeholder="Pilih kandang"
                    :show-labels="false"
                  />
                </base-input>
              </div>
            </div>
          </form-comp>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.usg1 = false">
            Tutup
          </base-button>
          <base-button type="primary" @click="updatePerkawinanUsg1">
            <span v-if="!loading">Perbarui USG</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang memperbarui...
            </span>
          </base-button>
        </template>
      </modal-comp>

      <!-- Update perkawinan USG 2 -->
      <modal-comp v-model:show="modal.usg2" modal-classes="modal-md">
        <template #header>
          <h3 class="modal-title">Perbarui Status USG 2</h3>
        </template>
        <template #body>
          <form-comp v-if="modal.usg2">
            <div class="row">
              <!-- Status perkawinan -->
              <div class="col-12">
                <base-input name="status" label="Status">
                  <multi-select
                    v-model="input.status"
                    :options="g$statusPerkawinan"
                    placeholder="Pilih status"
                    :show-labels="false"
                  />
                </base-input>
              </div>

              <!-- Kode kandang -->
              <div class="col-12">
                <base-input name="kode_kandang" label="Pilih kandang">
                  <multi-select
                    v-model="input.kandang"
                    :options="g$kandangList"
                    track-by="id_kandang"
                    label="kode_kandang"
                    placeholder="Pilih kandang"
                    :show-labels="false"
                  />
                </base-input>
              </div>
            </div>
          </form-comp>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.usg2 = false">
            Tutup
          </base-button>
          <base-button type="primary" @click="updatePerkawinanUsg2">
            <span v-if="!loading">Perbarui USG</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang memperbarui...
            </span>
          </base-button>
        </template>
      </modal-comp>
    </template>
  </main-layout>
</template>
