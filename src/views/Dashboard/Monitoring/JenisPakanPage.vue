<script>
import { mapActions, mapState } from "pinia";
import d$pakan from "@/stores/monitoring/pakan";
import d$dropdown from "@/stores/dropdown";

import {
  object as y$object,
  string as y$string,
  number as y$number,
  ref as y$ref,
} from "yup";
import router from "../../../router";

export default {
  metaInfo: () => ({
    title: "Data Pakan",
  }),
  setup() {
    const schema = y$object({
      jenis_pakan: y$string().required().label("Nama Pakan"),
      interval_pakan: y$number().required().label("Interval"),
      satuan: y$string().required().label("Satuan"),
      komposisi: y$string().required().label("Komposisi"),
      nutrien: y$string().required().label("Nutrien"),
    });
    return {
      schema,
    };
  },
  data: () => ({
    pageTitle: "Pakan",
    // Input
    input: {
      id_jenis_pakan: null,
      jenis_pakan: "",
      interval_pakan: "",
      satuan: "",
      komposisi: "",
      nutrien: "",
    },
    // UI
    modal: {
      addPakan: false,
      ubahPakan: false,
      confirm: false,
    },
    loading: false,
    // DataTable
    dt: {
      column: [
        {
          name: "jenis_pakan",
          th: "Nama Pakan",
        },
        {
          name: "komposisi",
          th: "Komposisi",
        },
        {
          name: "nutrien",
          th: "Kandungan Nutrien",
        },
        {
          name: "interval_pakan",
          th: "Interval",
          render: ({ interval_pakan }) => interval_pakan + " Hari",
        },
        {
          name: "stok_siap",
          th: "Stok Sudah Siap",
          render: ({ stok_siap, satuan }) => stok_siap + " " + satuan,
        },
        {
          name: "stok_belum_siap",
          th: "Stok Belum Siap",
          render: ({ stok_belum_siap, satuan }) =>
            stok_belum_siap + " " + satuan,
        },
      ],
      action: [
        {
          text: "Detail",
          color: "info",
          event: "detail-pakan",
        },
        {
          text: "Ubah",
          color: "warning",
          event: "ubah-pakan",
        },
        {
          text: "Hapus",
          color: "danger",
          event: "hapus-pakan",
        },
        {
          text: "Pembukuan",
          color: "submit",
          event: "pembukuan-pakan",
        },
      ],
    },
  }),
  computed: {
    ...mapState(d$pakan, ["g$pakanList", "g$pakanDetail", "g$detailPembukuanPakan"]),
    ...mapState(d$dropdown, ["g$ddKeteranganTambahPakan"]),
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
    await this.a$pakanList("").catch((error) => this.notify(error, false));
  },
  methods: {
    ...mapActions(d$pakan, [
      "a$pakanAdd",
      "a$pakanList",
      "a$pakanDelete",
      "a$pakanEdit",
    ]),
    clearInput() {
      this.input = {
        id_jenis_pakan: null,
        jenis_pakan: "",
        interval_pakan: "",
        satuan: "",
        komposisi: "",
        nutrien: "",
      };
    },

    //tambah pakan
    async addPakan() {
      this.loading = true;
      try {
        const { jenis_pakan, interval_pakan, satuan, komposisi, nutrien } =
          this.input;
        const data = {
          jenis_pakan,
          interval_pakan,
          satuan,
          komposisi,
          nutrien,
        };
        await this.schema.validate(data);
        await this.a$pakanAdd(data);
        this.modal.addPakan = false;
        this.notify(`Tambah ${this.pageTitle} Sukses!`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$pakanList("");
      }
      this.loading = false;
    },

    //edit pakan
    async editPakan() {
      this.loading = true;
      try {
        const {
          id_jenis_pakan,
          jenis_pakan,
          interval_pakan,
          satuan,
          komposisi,
          nutrien,
        } = this.input;
        const data = {
          id_jenis_pakan,
          jenis_pakan,
          interval_pakan,
          satuan,
          komposisi,
          nutrien,
        };
        await this.schema.validate(data);
        await this.a$pakanEdit(data);
        this.modal.ubahPakan = false;
        this.notify(`Edit ${this.pageTitle} Sukses!`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$pakanList("");
      }
      this.loading = false;
    },

    //hapus pakan
    async delPakan() {
      this.loading = true;
      try {
        const { id_jenis_pakan } = this.input;
        const data = {
          id_jenis_pakan,
        };
        await this.a$pakanDelete(data);
        this.modal.confirm = false;
        this.notify(`Hapus ${this.pageTitle} Sukses!`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$pakanList("");
      }
      this.loading = false;
    },

    async triggerEditModal(row) {
      try {
        const {
          id_jenis_pakan,
          jenis_pakan,
          interval_pakan,
          satuan,
          komposisi,
          nutrien,
        } = row;
        this.input = {
          id_jenis_pakan,
          jenis_pakan,
          interval_pakan,
          satuan,
          komposisi,
          nutrien,
        };
        this.modal.ubahPakan = true;
      } catch (error) {
        this.clearInput();
        this.notify(error, false);
      }
    },
    async triggerDelete(row) {
      try {
        const { id_jenis_pakan, jenis_pakan } = row;
        this.input = {
          id_jenis_pakan,
          jenis_pakan,
        };
        this.modal.confirm = true;
      } catch (error) {
        this.clearInput();
        this.notify(error, false);
      }
    },
    async triggerDetail(row) {
      try {
        const { id_jenis_pakan } = row;
        router.push({
          name: "Detail Pakan",
          params: {
            id: id_jenis_pakan,
          },
        });
      } catch (error) {
        this.clearInput();
        this.notify(error, false);
      }
    },
    async triggerPembukuanPakan(row) {
      try {
        const { id_jenis_pakan } = row;
        router.push({
          name: "Pembukuan Pakan",
          params: {
            id: id_jenis_pakan,
          },
        });
      } catch (error) {
        this.clearInput();
        this.notify(error, false);
      }
    },
  },
};
</script>

<template>
  <main-layout :title="pageTitle" disable-padding>
    <template #header>
      <nav class="nav nav-pills flex-column flex-sm-row mb-4">
        <router-link to="data-pakan" class="nav-item">
          <base-button type="success1" class="btn-lg text-white">
            Daftar Pakan
          </base-button>
        </router-link>
        <router-link to="data-pakan/bahan-pakan" class="nav-item">
          <base-button type="secondary" class="btn-lg text-dark">
            Daftar Bahan Pakan
          </base-button>
        </router-link>
        
      </nav>
      <div class="row align-items-center">
        <div class="col-auto">
          <h3>Daftar {{ pageTitle }}</h3>
        </div>
        <div class="col text-right">
          <base-button type="success" @click="modal.addPakan = true">
            Tambah {{ pageTitle }}
          </base-button>
        </div>
      </div>
    </template>

    <template #body>
      <empty-result v-if="!g$pakanList.length" :text="`${pageTitle}`" />
      <data-table
        v-else
        :index="true"
        :data="g$pakanList"
        :columns="dt.column"
        :actions="dt.action"
        @ubah-pakan="triggerEditModal"
        @hapus-pakan="triggerDelete"
        @detail-pakan="triggerDetail"
       @pembukuan-pakan="triggerPembukuanPakan"
      />
    </template>

    <template #modal>
      <modal-comp v-model:show="modal.addPakan" modal-classes="modal-md">
        <template #header>
          <h3 class="modal-title">Tambah {{ pageTitle }} Baru</h3>
        </template>
        <template #body>
          <form-comp v-if="modal.addPakan" :validation-schema="schema">
            <div class="row">
              <!-- nama pakan -->
              <div class="col-12">
                <field-form
                  v-slot="{ field }"
                  v-model="input.jenis_pakan"
                  type="text"
                  name="jenis_pakan"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Nama Pakan"
                    label="Nama Pakan"
                    required
                  ></base-input>
                </field-form>
              </div>

              <!-- interval pemberian pakan -->
              <div class="col-12">
                <field-form
                  v-slot="{ field }"
                  v-model="input.interval_pakan"
                  type="number"
                  name="interval"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Masukan interval dalam hari"
                    label="Interval Pemberian Pakan (Hari)"
                    type="number"
                    required
                  >
                  </base-input>
                </field-form>
              </div>

              <!-- satuan pakan (tong/ball) -->
              <div class="col-12">
                <base-input
                  name="satuan"
                  placeholder="Satuan Pakan"
                  label="Satuan Pakan"
                  required
                >
                  <multi-select
                    v-model="input.satuan"
                    :options="g$ddKeteranganTambahPakan"
                    placeholder="Pilih Satuan Pakan"
                    :show-labels="false"
                    required
                  />
                </base-input>
              </div>

              <!-- Komposisi -->
              <div class="col-12">
                <field-form
                  v-slot="{ field }"
                  v-model="input.komposisi"
                  type="text"
                  name="komposisi"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Contoh: Bongkol Jagung 15%, Premix 0,1%, Jagung 60%"
                    label="Komposisi"
                    required
                  ></base-input>
                </field-form>
              </div>

              <!-- Nutrien -->
              <div class="col-12">
                <field-form
                  v-slot="{ field }"
                  v-model="input.nutrien"
                  type="text"
                  name="nutrien"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Contoh: BK: 87%; PK 21%; LK 24%"
                    label="Nutrien"
                    required
                  >
                  </base-input>
                </field-form>
              </div>
            </div>
          </form-comp>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.addPakan = false">
            Tutup
          </base-button>
          <base-button type="primary" @click="addPakan()">
            <span v-if="!loading">Tambah {{ pageTitle }}</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang menambahkan...
            </span>
          </base-button>
        </template>
      </modal-comp>

      <modal-comp v-model:show="modal.ubahPakan" modal-classes="modal-md">
        <template #header>
          <h3 class="modal-title">Detail {{ pageTitle }}</h3>
        </template>
        <template #body>
          <form-comp v-if="modal.ubahPakan" :validation-schema="schema">
            <div class="row">
              <!-- nama pakan -->
              <div class="col-12">
                <field-form
                  v-slot="{ field }"
                  v-model="input.jenis_pakan"
                  type="text"
                  name="jenis_pakan"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Nama Pakan"
                    label="Nama Pakan"
                    required
                  ></base-input>
                </field-form>
              </div>

              <!-- interval pemberian pakan -->
              <div class="col-12">
                <field-form
                  v-slot="{ field }"
                  v-model="input.interval_pakan"
                  type="number"
                  name="interval"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Masukan interval dalam hari"
                    label="Interval Pemberian Pakan (Hari)"
                    type="number"
                    required
                  >
                  </base-input>
                </field-form>
              </div>

              <!-- satuan pakan (tong/ball) -->
              <div class="col-12">
                <base-input
                  name="satuan"
                  placeholder="Satuan Pakan"
                  label="Satuan Pakan"
                  required
                >
                  <multi-select
                    v-model="input.satuan"
                    :options="g$ddKeteranganTambahPakan"
                    placeholder="Pilih Satuan Pakan"
                    :show-labels="false"
                    required
                  />
                </base-input>
              </div>

              <!-- Komposisi -->
              <div class="col-12">
                <field-form
                  v-slot="{ field }"
                  v-model="input.komposisi"
                  type="text"
                  name="komposisi"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Contoh: Bongkol Jagung 15%, Premix 0,1%, Jagung 60%"
                    label="Komposisi"
                    required
                  ></base-input>
                </field-form>
              </div>

              <!-- Nutrien -->
              <div class="col-12">
                <field-form
                  v-slot="{ field }"
                  v-model="input.nutrien"
                  type="text"
                  name="nutrien"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Contoh: BK: 87%; PK 21%; LK 24%"
                    label="Nutrien"
                    required
                  >
                  </base-input>
                </field-form>
              </div>
            </div>
          </form-comp>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.ubahPakan = false">
            Tutup
          </base-button>
          <base-button type="primary" @click="editPakan()">
            <span v-if="!loading">Simpan Perubahan</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang menyimpan...
            </span>
          </base-button>
        </template>
      </modal-comp>
      <modal-comp v-model:show="modal.confirm" modal-classes="modal-lg">
        <template #header>
          <h3 class="modal-title">Hapus {{ pageTitle }}</h3>
        </template>
        <template #body>
          <p>
            Yakin ingin menghapus {{ pageTitle }}:
            <strong>{{ input.jenis_pakan }}</strong>
          </p>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.confirm = false">
            Tutup
          </base-button>
          <base-button type="danger" @click="delPakan()"
            ><span v-if="!loading">Hapus</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang menghapus...
            </span></base-button
          >
        </template>
      </modal-comp>
    </template>
  </main-layout>
</template>
