<script>
import { mapActions, mapState } from "pinia";
import d$fattening from "@/stores/fase/fattening";

import { object as y$object, string as y$string } from "yup"; // Menghapus impor yang tidak digunakan
// import router from "../../../../router";
import d$dropdown from "@/stores/dropdown";


export default {
  metaInfo: () => ({
    title: "Fase Fattening",
  }),
  setup() {
    const schema = y$object({
      kode_kandang: y$string().required().label("Kode Kandang"), // Merubah label menjadi "Kode Kandang"
      jenis_kandang: y$string().required().label("Jenis Kandang"), // Menambah validasi untuk jenis_kandang
      jenis_pakan: y$string().required().label("Jenis Pakan"), // Menambah validasi untuk jenis_pakan
      berat_domba: y$string().required().label("Berat Badan Domba"), // Menambah validasi untuk berat_domba
    });
    return {
      schema,
    };
  },
  data: () => ({
    pageTitle: "Fase Fattening",
    // Input
    input: {
      kode_kandang: "",
      jenis_kandang: "",
      jenis_pakan: "",
      berat_domba: null,
    },
    // UI
    modal: {
      addFattening: false,
      ubahKandang: false,
      confirm: false,
    },
    loading: false,
    loadingModal: false,
    // DataTable
    dt: {
      column: [
        {
          name: "kode_kandang",
          th: "Kode Kandang",
        },
        {
          name: "jenis_kandang",
          th: "Jenis Kandang",
          render: ({ jenis_kandang }) =>
            jenis_kandang ? jenis_kandang.jenis_kandang : "-", // Memperbaiki render jenis_kandang
        },
        {
          name: "populasi",
          th: "Jumlah Populasi Ternak",
        },
        {
          name: "jenis_pakan",
          th: "Jenis Pakan",
          render: ({ jenis_pakan }) =>
            jenis_pakan ? jenis_pakan.jenis_pakan : null, // Memperbaiki render jenis_pakan
        },
        {
          name: "berat_domba",
          th: "Berat Domba",
          render: ({ jenis_pakan }) =>
            jenis_pakan ? jenis_pakan.jenis_pakan : "-", 
        },
      ],
      action: [
        {
          text: "Detail",
          color: "info",
          event: "detail-kandang",
        },
        {
          text: "Ubah",
          color: "warning",
          event: "ubah-kandang",
        },
        {
          text: "Hapus",
          color: "danger",
          event: "hapus-kandang",
        },
      ],
    },
    totalKandang: 0,
  }),
  computed: {
    ...mapState(d$daftarkandang, ["g$kandangList"]),
    ...mapState(d$dropdown, ["g$ddJenisKandang", "g$ddListJenisPakan"]),
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
    this.a$kandangList().catch((error) => this.notify(error, false));
  },
  methods: {
    ...mapActions(d$daftarkandang, [
      "a$kandangAdd",
      "a$kandangList",
      "a$kandangDelete",
      "a$kandangEdit",
    ]),
    ...mapActions(d$dropdown, ["a$ddListJenisPakan", "a$ddJenisKandang"]),
    clearInput() {
      this.input = {
        kode_kandang: "",
        jenis_kandang: "",
        jenis_pakan: "",
        berat_domba: "",
      };
    },

    // Tambah kandang
    async addFattening() {
      this.loading = true;
      try {
        const { kode_kandang, jenis_kandang, jenis_pakan, berat_domba } = this.input;
        const data = {
          kode_kandang,
          jenis_kandang,
          jenis_pakan,
          berat_domba,
        };
        await this.schema.validate(data);
        await this.a$kandangAdd(data);
        this.modal.addFattening = false;
        this.notify(`Tambah ${this.pageTitle} Sukses!`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$kandangList();
        this.loading = false;
      }
    },

    // Ubah kandang
    async editFattening() {
      this.loading = true;
      try {
        const { kode_kandang, jenis_kandang, jenis_pakan, berat_domba } = this.input;
        const data = {
          kode_kandang,
          jenis_kandang,
          jenis_pakan,
          berat_domba,
        };
        await this.schema.validate(data);
        await this.a$kandangEdit(data);
        this.modal.ubahKandang = false;
        this.notify(`Edit ${this.pageTitle} Sukses!`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$kandangList();
        this.loading = false;
      }
    },

    // Hapus kandang
    async delKandang() {
      this.loading = true;
      try {
        const { kode_kandang } = this.input;
        const data = {
          kode_kandang,
        };
        await this.a$kandangDelete(data);
        this.modal.confirm = false;
        this.notify(`Hapus ${this.pageTitle} Sukses!`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$kandangList();
        this.loading = false;
      }
    },

    async triggerCreate() {
      this.modal.addFattening = true;
      this.loadingModal = true;
      await this.a$ddListJenisPakan("").catch((error) =>
        this.notify(error, false)
      );
      await this.a$ddJenisKandang().catch((error) => this.notify(error, false));
      this.loadingModal = false;
    },

    async triggerEditModal(row) {
      this.modal.ubahKandang = true;
      this.loadingModal = true;
      await this.a$ddListJenisPakan("").catch((error) =>
        this.notify(error, false)
      );
      await this.a$ddJenisKandang().catch((error) => this.notify(error, false));
      try {
        const { kode_kandang, jenis_kandang, jenis_pakan, berat_domba } = row;
        this.input = {
          kode_kandang,
          jenis_kandang,
          jenis_pakan,
          berat_domba,
        };
      } catch (error) {
        this.clearInput();
        this.notify(error, false);
      } finally {
        this.loadingModal = false;
      }
    },

    async triggerDelete(row) {
      try {
        const { kode_kandang } = row;
        this.input = {
          kode_kandang,
        };
        this.modal.confirm = true;
      } catch (error) {
        this.clearInput();
        this.notify(error, false);
      }
    },

    async triggerDetail(row) {
      try {
        // Dapatkan data berdasarkan id atau atribut yang sesuai
        const { kode_kandang } = row;
        router.push({
          name: "Detail Kandang",
          params: {
            id: kode_kandang, // Gunakan id atau atribut yang sesuai
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
      <div class="row align-items-center">
        <div class="col-auto">
          <h3>Daftar {{ pageTitle }}</h3>
        </div>
        <div class="col text-right">
          <base-button type="success" @click="triggerCreate">
            <span>Tambah {{ pageTitle }}</span>
          </base-button>
        </div>
      </div>
    </template>

    <template #body>
      <empty-result v-if="!g$kandangList.length" :text="`${pageTitle}`" />
      <data-table
        v-else
        :index="true"
        :data="g$kandangList"
        :columns="dt.column"
        :actions="dt.action"
        @ubah-kandang="triggerEditModal"
        @hapus-kandang="triggerDelete"
        @detail-kandang="triggerDetail"
      />
    </template>

    <template #modal>
      <!-- Tambah kandang -->
      <modal-comp v-model:show="modal.addFattening" modal-classes="modal-md">
        <template #header>
          <h3 class="modal-title">Tambah {{ pageTitle }} Baru</h3>
        </template>
        <template #body>
          <div v-if="loadingModal">
            <i class="fa fa-spinner fa-spin"></i> Sedang memuat...
          </div>
          <div v-else>
            <form-comp v-if="modal.addFattening" :validation-schema="schema">
              <div class="row">
                <!-- Kode kandang -->
                <div class="col-12">
                  <field-form
                    v-slot="{ field }"
                    v-model="input.kode_kandang"
                    type="text"
                    name="kode_kandang"
                  >
                    <base-input
                      v-bind="field"
                      placeholder="Kode Kandang"
                      label="Kode Kandang"
                      required
                    ></base-input>
                  </field-form>
                </div>

                <!-- Jenis Kandang -->
                <div class="col-12">
                  <base-input
                    name="jeniskandang"
                    placeholder="Jenis Kandang"
                    label="Jenis Kandang"
                    required
                  >
                    <multi-select
                      v-model="input.jenis_kandang"
                      :options="g$ddJenisKandang"
                      label="name"
                      track-by="id"
                      placeholder="Pilih Jenis Kandang"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- jenis pakan -->
                <div class="col-12">
                  <base-input
                    name="jenispakan"
                    placeholder="Jenis Pakan"
                    label="Jenis Pakan"
                    required
                  >
                    <multi-select
                      v-model="input.jenis_pakan"
                      :options="g$ddListJenisPakan"
                      label="name"
                      track-by="id"
                      placeholder="Pilih Jenis Pakan"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- persentase kebutuhan pakan -->
                <div class="col-12">
                  <field-form
                    v-slot="{ field }"
                    v-model="input.berat_domba"
                    name="beratdomba"
                  >
                    <base-input
                      v-bind="field"
                      placeholder="Masukkan dalam bentuk kg"
                      label="Berat Badan Domba"
                      type="number"
                      required
                    ></base-input>
                  </field-form>
                </div>
              </div>
            </form-comp>
          </div>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.addFattening = false">
            Tutup
          </base-button>
          <base-button type="primary" @click="addFattening()">
            <span v-if="!loading">Tambah {{ pageTitle }}</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang menambahkan...
            </span>
          </base-button>
        </template>
      </modal-comp>

      <!-- Ubah kandang -->
      <modal-comp v-model:show="modal.ubahKandang" modal-classes="modal-md">
        <template #header>
          <h3 class="modal-title">Detail {{ pageTitle }}</h3>
        </template>
        <template #body>
          <div v-if="loadingModal">
            <i class="fa fa-spinner fa-spin"></i> Sedang memuat...
          </div>
          <div v-else>
            <form-comp v-if="modal.ubahKandang" :validation-schema="schema">
              <div class="row">
                <!-- Kode kandang -->
                <div class="col-12">
                  <field-form
                    v-slot="{ field }"
                    v-model="input.kode_kandang"
                    type="text"
                    name="kode_kandang"
                  >
                    <base-input
                      v-bind="field"
                      placeholder="Kode Kandang"
                      label="Kode Kandang"
                      required
                    ></base-input>
                  </field-form>
                </div>

                <!-- Jenis kandang -->
                <div class="col-12">
                  <base-input
                    name="jeniskandang"
                    placeholder="Jenis Kandang"
                    label="Jenis Kandang"
                    required
                  >
                    <multi-select
                      v-model="input.jenis_kandang"
                      :options="g$ddJenisKandang"
                      label="name"
                      track-by="id"
                      placeholder="Pilih Jenis Kandang"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- jenis pakan -->
                <div class="col-12">
                  <base-input
                    name="jenispakan"
                    placeholder="Jenis Pakan"
                    label="Jenis Pakan"
                    required
                  >
                    <multi-select
                      v-model="input.jenis_pakan"
                      :options="g$ddListJenisPakan"
                      label="name"
                      track-by="id"
                      placeholder="Pilih Jenis Pakan"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- persentase kebutuhan pakan -->
                <div class="col-12">
                  <field-form
                    v-slot="{ field }"
                    v-model="input.berat_domba"
                    name="beratdomba"
                  >
                    <base-input
                      v-bind="field"
                      placeholder="Masukkan dalam bentuk kg"
                      label="Berat Badan Domba"
                      type="number"
                      required
                    ></base-input>
                  </field-form>
                </div>
              </div>
            </form-comp>
          </div>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.ubahKandang = false">
            Tutup
          </base-button>
          <base-button type="primary" @click="editFattening()">
            <span v-if="!loading">Simpan perubahan</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang menyimpan...
            </span>
          </base-button>
        </template>
      </modal-comp>

      <!-- Hapus kandang -->
      <modal-comp v-model:show="modal.confirm" modal-classes="modal-lg">
        <template #header>
          <h3 class="modal-title">Hapus {{ pageTitle }}</h3>
        </template>
        <template #body>
          <p>
            Yakin ingin menghapus {{ pageTitle }}:
            <strong>{{ input.kode_kandang }}</strong>
          </p>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.confirm = false">
            Tutup
          </base-button>
          <base-button type="danger" @click="delKandang()"
            ><span v-if="!loading">Hapus</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang menghapus...
            </span>
            </base-button>
        </template>
      </modal-comp>
    </template>
  </main-layout>
</template>