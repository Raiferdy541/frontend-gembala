<script>
import { mapActions, mapState } from "pinia";
import d$pakan from "@/stores/monitoring/pakan";
import d$dropdown from "@/stores/dropdown";

import { object as y$object, string as y$string, ref as y$ref } from "yup";
import router from "../../../router";

export default {
  metaInfo: () => ({
    title: "Data Pakan",
  }),
  setup() {
    const schema = y$object({
      nama_pakan: y$string().required().label("Nama Pakan"),
      deskripsi: y$string().nullable().label("Jenis Pakan"),
      komposisi: y$string().nullable().label("Komposisi"),
      // id_users: y$string().required().label("ID Users"),
    });
    return {
      schema,
    };
  },
  data: () => ({
    pageTitle: "Pakan",
    // Input
    input: {
      id_pakan: null,
      nama_pakan: "",
      interval: "",
      satuan: "",
    },
    // UI
    modal: {
      addPakan: false,
      ubahPakan: false,
      confirm: false,
    },
    // DataTable
    dt: {
      column: [
        {
          name: "nama_pakan",
          th: "Nama Pakan",
        },
        {
          name: "jumlah",
          th: "Stok",
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
      ],
    },
  }),
  computed: {
    ...mapState(d$pakan, ["g$pakanList", "g$pakanDetail"]),
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
    await this.a$pakanList(this.userInfo.id).catch((error) =>
      this.notify(error, false)
    );
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
        id_pakan: null,
        nama_pakan: "",
        interval: "",
        satuan: "",
      };
    },
    async addPakan() {
      try {
        const { nama_pakan, deskripsi, komposisi, jumlah } = this.input;
        const data = {
          nama_pakan,
          deskripsi,
        };
        console.log(data);
        await this.schema.validate(data);
        await this.a$pakanAdd(data);
        this.modal.addPakan = false;
        this.notify(`Tambah ${this.pageTitle} Sukses!`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$pakanList();
      }
    },
    async editPakan() {
      try {
        const { id_pakan, nama_pakan, deskripsi, komposisi, jumlah } =
          this.input;
        const data = {
          id_pakan,
          nama_pakan,
          deskripsi,
        };
        await this.schema.validate(data);
        await this.a$pakanEdit(data);
        this.modal.ubahPakan = false;
        this.notify(`Edit ${this.pageTitle} Sukses!`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$pakanList();
      }
    },
    async delPakan() {
      try {
        const { id_pakan } = this.input;
        const data = {
          id_pakan,
        };
        await this.a$pakanDelete(data);
        this.modal.confirm = false;
        this.notify(`Hapus ${this.pageTitle} Sukses!`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$pakanList();
      }
    },
    async triggerEditModal(row) {
      try {
        const { id_pakan, nama_pakan, deskripsi, komposisi, jumlah } = row;
        this.input = {
          id_pakan,
          nama_pakan,
          deskripsi,
        };
        this.modal.ubahPakan = true;
      } catch (error) {
        this.clearInput();
        this.notify(error, false);
      }
    },
    async triggerDelete(row) {
      try {
        const { id_pakan, nama_pakan } = row;
        this.input = {
          id_pakan,
          nama_pakan,
        };
        this.modal.confirm = true;
      } catch (error) {
        this.clearInput();
        this.notify(error, false);
      }
    },
    async triggerDetail(row) {
      try {
        const { id_pakan } = row;
        router.push({
          name: "Detail Pakan",
          params: {
            id: id_pakan,
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
        <li>
          <router-link
            class="flex-sm-fill text-sm-center nav-link active"
            to="data-pakan"
          >
            Daftar Pakan
          </router-link>
        </li>
        <li>
          <router-link
            class="flex-sm-fill text-sm-center nav-link ml-3"
            to="data-pakan/bahan-pakan"
          >
            Daftar Bahan Pakan
          </router-link>
        </li>
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
                  v-model="input.nama_pakan"
                  type="text"
                  name="nama_pakan"
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
                  v-model="input.interval"
                  type="text"
                  name="interval"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Masukan interval"
                    label="Interval pemberian pakan /hari"
                  ></base-input>
                </field-form>
              </div>
              <!-- satuan pakan (tong/ball) -->
              <div class="col-12">
                <base-input
                  name="satuan"
                  placeholder="Satuan Pakan"
                  label="Satuan Pakan"
                >
                  <multi-select
                    v-model="input.satuan"
                    :options="g$ddKeteranganTambahPakan"
                    placeholder="Pilih Satuan Pakan"
                    :show-labels="false"
                  />
                </base-input>
              </div>
            </div>
          </form-comp>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.addPakan = false">
            Tutup
          </base-button>
          <base-button type="primary" @click="addPakan()">
            Tambah {{ pageTitle }}
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
                  v-model="input.nama_pakan"
                  type="text"
                  name="nama_pakan"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Text"
                    label="Nama Pakan"
                    required
                  ></base-input>
                </field-form>
              </div>
              <!-- interval pemberian pakan -->
              <div class="col-12">
                <field-form
                  v-slot="{ field }"
                  v-model="input.interval"
                  type="text"
                  name="interval"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Interval"
                    label="Jenis Pakan"
                  ></base-input>
                </field-form>
              </div>
              <!-- satuan pakan (tong/ball) -->
              <div class="col-12">
                <base-input
                  name="satuan"
                  placeholder="Satuan Pakan"
                  label="Satuan Pakan"
                >
                  <multi-select
                    v-model="input.satuan"
                    :options="g$ddKeteranganTambahPakan"
                    placeholder="Pilih Satuan Pakan"
                    :show-labels="false"
                  />
                </base-input>
              </div>
            </div>
          </form-comp>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.ubahPakan = false">
            Tutup
          </base-button>
          <base-button type="primary" @click="editPakan()">
            Simpan Perubahan
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
            <strong>{{ input.nama_pakan }}</strong>
          </p>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.confirm = false">
            Tutup
          </base-button>
          <base-button type="danger" @click="delPakan()">Hapus</base-button>
        </template>
      </modal-comp>
    </template>
  </main-layout>
</template>