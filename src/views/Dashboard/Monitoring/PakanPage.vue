<script>
import { mapActions, mapState } from "pinia";
import d$bahanPakan from "@/stores/monitoring/bahanPakan";
import d$dropdown from "@/stores/dropdown";

export default {
  metaInfo: () => ({
    title: "Bahan Pakan",
  }),
  data: () => ({
    pageTitle: "Bahan Pakan",
    // Input
    input: {
      id_jenis_bahan_pakan: null,
      jenis_bahan_pakan: "",
      satuan: "",
    },
    // UI
    modal: {
      addBahanPakan: false,
      ubahBahanPakan: false,
      confirm: false,
    },
    loading: false,
    // DataTable
    dt: {
      column: [
        {
          name: "jenis_bahan_pakan",
          th: "Bahan Pakan",
        },
        {
          name: "stok",
          th: "Stok",
          render: ({ stok, satuan }) => stok + " " + satuan,
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
    ...mapState(d$bahanPakan, ["g$bahanPakanList", "g$detailBahanPakan"]),
    ...mapState(d$dropdown, ["g$ddSatuanPakan"]),
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
    await this.a$bahanPakanList("").catch((error) => this.notify(error, false));
  },
  methods: {
    ...mapActions(d$bahanPakan, [
      "a$bahanPakanList",
      "a$bahanPakanAdd",
      "a$bahanPakanEdit",
      "a$bahanPakanDelete",
      "a$bahanPakanDetail",
      "a$bahanPakanDetailAdd",
    ]),
    clearInput() {
      this.input = {
        id_jenis_bahan_pakan: null,
        jenis_bahan_pakan: "",
        satuan: "",
      };
    },

    //tambah bahan pakan
    async addBahanPakan() {
      this.loading = true;
      try {
        const { jenis_bahan_pakan, satuan } = this.input;
        const data = {
          jenis_bahan_pakan,
          satuan,
        };
        await this.a$bahanPakanAdd(data);
        this.modal.addBahanPakan = false;
        this.notify(`Tambah ${this.pageTitle} Sukses!`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$bahanPakanList("");
      }
      this.loading = false;
    },

    //ubah bahan pakan
    async ubahBahanPakan() {
      this.loading = true;
      try {
        const { id_jenis_bahan_pakan, jenis_bahan_pakan, satuan } = this.input;
        const data = {
          id_jenis_bahan_pakan,
          jenis_bahan_pakan,
          satuan,
        };
        await this.a$bahanPakanEdit(data);
        this.modal.ubahBahanPakan = false;
        this.notify(`Edit ${this.pageTitle} Sukses!`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$bahanPakanList("");
      }
      this.loading = false;
    },

    //hapus bahan pakan
    async delPakan() {
      this.loading = true;
      try {
        const { id_jenis_bahan_pakan } = this.input;
        const data = {
          id_jenis_bahan_pakan,
        };
        await this.a$bahanPakanDelete(data);
        this.modal.confirm = false;
        this.notify(`Hapus ${this.pageTitle} Sukses!`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$bahanPakanList("");
      }
      this.loading = false;
    },

    async triggerEdit(row) {
      try {
        const { id_jenis_bahan_pakan, jenis_bahan_pakan, satuan } = row;
        this.input = {
          id_jenis_bahan_pakan,
          jenis_bahan_pakan,
          satuan,
        };
        this.modal.ubahBahanPakan = true;
      } catch (error) {
        this.clearInput();
        this.notify(error, false);
      }
    },
    async triggerDelete(row) {
      try {
        const { id_jenis_bahan_pakan, jenis_bahan_pakan } = row;
        this.input = {
          id_jenis_bahan_pakan,
          jenis_bahan_pakan,
        };
        this.modal.confirm = true;
      } catch (error) {
        this.clearInput();
        this.notify(error, false);
      }
    },
    triggerDetail(row) {
      const { id_jenis_bahan_pakan } = row;
      this.$router.push({
        name: "Detail Bahan Pakan",
        params: {
          id: id_jenis_bahan_pakan,
        },
      });
    },
  },
};
</script>

<template>
  <main-layout :title="pageTitle" disable-padding>
    <template #header>
      <nav class="nav nav-pills flex-column flex-sm-row mb-4">
        <router-link to="../data-pakan" class="nav-item">
          <base-button type="secondary" class="btn-lg text-dark">
            Daftar Pakan
          </base-button>
        </router-link>
        <router-link to="bahan-pakan" class="nav-item">
          <base-button type="success1" class="btn-lg text-white">
            Daftar Bahan Pakan
          </base-button>
        </router-link>
        <!-- <router-link to="pembukuan-pakan" class="nav-item">
          <base-button type="secondary" class="btn-lg text-dark">
            Pembukuan Pakan
          </base-button>
        </router-link> -->
      </nav>
      <div class="row align-items-center">
        <div class="col-auto">
          <h3>Daftar {{ pageTitle }}</h3>
        </div>
        <div class="col text-right">
          <base-button type="success" @click="modal.addBahanPakan = true">
            Tambah {{ pageTitle }}
          </base-button>
        </div>
      </div>
    </template>

    <template #body>
      <empty-result v-if="!g$bahanPakanList.length" :text="`${pageTitle}`" />
      <data-table
        v-else
        :index="true"
        :data="g$bahanPakanList"
        :columns="dt.column"
        :actions="dt.action"
        @ubah-pakan="triggerEdit"
        @hapus-pakan="triggerDelete"
        @detail-pakan="triggerDetail"
      />
    </template>

    <template #modal>
      <!-- Tambah bahan pakan -->
      <modal-comp v-model:show="modal.addBahanPakan" modal-classes="modal-sm">
        <template #header>
          <h3 class="modal-title">Tambah {{ pageTitle }} Baru</h3>
        </template>
        <template #body>
          <form-comp v-if="modal.addBahanPakan" :validation-schema="schema">
            <div class="row">
              <div class="col-12">
                <field-form
                  v-slot="{ field }"
                  v-model="input.jenis_bahan_pakan"
                  type="text"
                  name="jenis_bahan_pakan"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Nama Bahan Pakan"
                    label="Nama Bahan Pakan"
                    required
                  >
                  </base-input>
                </field-form>
              </div>
              <div class="col-12">
                <base-input
                  name="satuan"
                  placeholder="Satuan Pakan"
                  label="Satuan Pakan"
                  required
                >
                  <multi-select
                    v-model="input.satuan"
                    :options="g$ddSatuanPakan"
                    placeholder="Pilih Satuan Pakan"
                    :show-labels="false"
                  />
                </base-input>
              </div>
            </div>
          </form-comp>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.addBahanPakan = false">
            Tutup
          </base-button>
          <base-button type="primary" @click="addBahanPakan()">
            <span v-if="!loading">Tambah {{ pageTitle }}</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang menambahkan...
            </span>
          </base-button>
        </template>
      </modal-comp>

      <!-- Ubah bahan pakan -->
      <modal-comp v-model:show="modal.ubahBahanPakan" modal-classes="modal-sm">
        <template #header>
          <h3 class="modal-title">Detail {{ pageTitle }}</h3>
        </template>
        <template #body>
          <form-comp v-if="modal.ubahBahanPakan">
            <div class="row">
              <!-- Nama Bahan Pakan -->
              <div class="col-12">
                <field-form
                  v-slot="{ field }"
                  v-model="input.jenis_bahan_pakan"
                  type="text"
                  name="jenis_bahan_pakan"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Nama Bahan Pakan"
                    label="Nama Bahan Pakan"
                    required
                  >
                  </base-input>
                </field-form>
              </div>

              <!-- Satuan -->
              <div class="col-12">
                <base-input
                  name="satuan"
                  placeholder="Satuan Pakan"
                  label="Satuan Pakan"
                  required
                >
                  <multi-select
                    v-model="input.satuan"
                    :options="g$ddSatuanPakan"
                    placeholder="Pilih Satuan Pakan"
                    :show-labels="false"
                  />
                </base-input>
              </div>
            </div>
          </form-comp>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.ubahBahanPakan = false">
            Tutup
          </base-button>
          <base-button type="primary" @click="ubahBahanPakan()">
            <span v-if="!loading">Simpan Perubahan</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang menyimpan...
            </span>
          </base-button>
        </template>
      </modal-comp>

      <!-- Hapus bahan pakan -->
      <modal-comp v-model:show="modal.confirm" modal-classes="modal-sm">
        <template #header>
          <h3 class="modal-title">Hapus {{ pageTitle }}</h3>
        </template>
        <template #body>
          <p>
            Yakin ingin menghapus {{ pageTitle }}:
            <strong>{{ input.jenis_bahan_pakan }}</strong>
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
