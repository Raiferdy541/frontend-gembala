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
          <base-button type="success" @click="triggerExport">
            <span>Export Excel</span>
          </base-button>
          <base-button type="success" @click="modal.addPembukuanPakan = true">
            Tambah {{ pageTitle }}
          </base-button>
        </div>
      </div>
    </template>

    <template #body>
      <empty-result
        v-if="!g$PembukuanPakanList.length"
        :text="`${pageTitle}`"
      />
      <data-table
        v-else
        :index="true"
        :data="g$PembukuanPakanList"
        :columns="dt.column"
        :actions="dt.action"
        @ubah-pakan="triggerEditModal"
        @hapus-pakan="triggerDelete"
        @detail-pakan="triggerDetail"
      />
    </template>

    <template #modal>
      <modal-comp
        v-model:show="modal.addPembukuanPakan"
        modal-classes="modal-md"
      >
        <template #header>
          <h3 class="modal-title">Tambah {{ pageTitle }} Baru</h3>
        </template>
        <template #body>
          <form-comp v-if="modal.addPembukuanPakan" :validation-schema="schema">
            <div class="row">
              <div class="col-12">
                <base-input
                  name="tanggal"
                  class=""
                  placeholder="Pilih tanggal"
                  label="Tanggal"
                  required
                >
                  <flat-pickr
                    v-model.lazy="input.tanggal"
                    :config="{
                      mode: 'single',
                      allowInput: true,
                      maxDate: new Date(),
                      defaultDate: 'today',
                    }"
                    class="form-control datepicker"
                    placeholder="Pilih tanggal"
                  />
                </base-input>
              </div>

              <!-- Keterangan -->
              <div class="col-12">
                <base-input
                  name="keterangan"
                  placeholder="Pakan masuk atau keluar?"
                  label="Keterangan"
                  required
                >
                  <multi-select
                    v-model="input.keterangan"
                    :options="g$ddKeteranganDetailPakan"
                    placeholder="Masuk atau keluar"
                    :show-labels="false"
                  />
                </base-input>
              </div>

              <div class="col-12">
                <base-input
                  name="penanggung_jawab"
                  placeholder="Penanggung Jawab"
                  label="Penanggung Jawab"
                  required
                >
                  <multi-select
                    v-model="input.penanggung_jawab"
                    :options="g$ddPenanggungJawab"
                    placeholder="Pilih Nama"
                    :show-labels="false"
                  />
                </base-input>
              </div>
              <!-- Berat Masuk -->
              <div class="col-12">
                <field-form
                  v-slot="{ field }"
                  v-model="input.berat_pakan"
                  type="number"
                  name="berat_pakan"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Masukkan dalam kg"
                    label="Berat Pakan"
                    type="number"
                    required
                  >
                  </base-input>
                </field-form>
              </div>
            </div>
          </form-comp>
        </template>
        <template #footer>
          <base-button
            type="secondary"
            @click="modal.addPembukuanPakan = false"
          >
            Tutup
          </base-button>
          <base-button type="primary" @click="addPembukuanPakan()">
            <span v-if="!loading">Tambah {{ pageTitle }}</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang menambahkan...
            </span>
          </base-button>
        </template>
      </modal-comp>

      <modal-comp
        v-model:show="modal.ubahPembukuanPakan"
        modal-classes="modal-md"
      >
        <template #header>
          <h3 class="modal-title">Detail {{ pageTitle }}</h3>
        </template>
        <template #body>
          <form-comp
            v-if="modal.ubahPembukuanPakan"
            :validation-schema="schema"
          >
            <div class="row">
              <div class="col-12">
                <base-input
                  name="tanggal"
                  class=""
                  placeholder="Pilih tanggal"
                  label="Tanggal"
                  required
                >
                  <flat-pickr
                    v-model.lazy="input.tanggal"
                    :config="{
                      mode: 'single',
                      allowInput: true,
                      maxDate: new Date(),
                      defaultDate: 'today',
                    }"
                    class="form-control datepicker"
                    placeholder="Pilih tanggal"
                  />
                </base-input>
              </div>

              <!-- Keterangan -->
              <div class="col-12">
                <base-input
                  name="keterangan"
                  placeholder="Pakan masuk atau keluar?"
                  label="Keterangan"
                  required
                >
                  <multi-select
                    v-model="input.keterangan"
                    :options="g$ddKeteranganDetailPakan"
                    placeholder="Masuk atau keluar"
                    :show-labels="false"
                  />
                </base-input>
              </div>

              <div class="col-12">
                <base-input
                  name="penanggung jawab"
                  placeholder="Penanggung Jawab"
                  label="Penanggung Jawab"
                  required
                >
                  <multi-select
                    v-model="input.penanggung_jawab"
                    :options="g$ddPenanggungJawab"
                    placeholder="Pilih Nama"
                    :show-labels="false"
                  />
                </base-input>
              </div>
              <!-- Berat Masuk -->
              <div class="col-12">
                <field-form
                  v-slot="{ field }"
                  v-model="input.berat_pakan"
                  type="number"
                  name="berat_pakan"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Masukkan dalam kg"
                    label="Berat Pakan"
                    type="number"
                    required
                  >
                  </base-input>
                </field-form>
              </div>
            </div>
          </form-comp>
        </template>
        <template #footer>
          <base-button
            type="secondary"
            @click="modal.ubahPembukuanPakan = false"
          >
            Tutup
          </base-button>
          <base-button type="primary" @click="ubahPembukuanPakan()">
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
            <strong>{{ input.tanggal }}</strong>
          </p>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.confirm = false">
            Tutup
          </base-button>
          <base-button type="danger" @click="delPakan()">
            <span v-if="!loading">Hapus</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang menghapus...
            </span>
          </base-button>
        </template>
      </modal-comp>
    </template>
  </main-layout>
</template>

<script>
import { mapActions, mapState } from "pinia";
import d$PembukuanPakan from "@/stores/monitoring/pembukuan";
import { ubahTanggal } from "@/utils/locale/ubahTanggal";
import d$dropdown from "@/stores/dropdown";
import * as ExcelJS from "exceljs";
import * as FileSaver from "file-saver";

import {
  object as y$object,
  string as y$string,
  number as y$number,
  date as y$date,
} from "yup";
import router from "../../../router";

export default {
  metaInfo: () => ({
    title: "Pembukuan Pakan",
  }),
  setup() {
    const schema = y$object({
      tanggal: y$date().required().label("Tanggal"),
      keterangan: y$string().required().label("Keterangan"),
      penanggung_jawab: y$string().required().label("Penanggung Jawab"),
      berat_pakan: y$number().required().label("Berat Pakan"),
    });
    return {
      schema,
    };
  },
  data: () => ({
    pageTitle: "Pembukuan Pakan",
    // Input
    input: {
      id_pembukuan_pakan: null,
      tanggal: null,
      keterangan: null,
      penanggung_jawab: null,
      berat_pakan: null,
    },
    // UI
    modal: {
      addPembukuanPakan: false,
      ubahPembukuanPakan: false,
      confirm: false,
    },
    loading: false,
    // DataTable
    dt: {
      column: [
        {
          name: "tanggal",
          th: "Tanggal",
          render: ({ tanggal }) => ubahTanggal(tanggal),
        },
        {
          name: "keterangan",
          th: "Keterangan",
        },
        {
          name: "penanggung_jawab",
          th: "Penanggung Jawab",
        },
        {
          name: "berat_pakan",
          th: "Berat Pakan",
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
    ...mapState(d$PembukuanPakan, [
      "g$exportExcel",
      "g$PembukuanPakanList",
      "g$detailPembukuanPakan",
    ]),
    ...mapState(d$dropdown, [
      "g$ddKeteranganDetailPakan",
      "g$ddPenanggungJawab",
    ]),
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
    await this.a$PembukuanPakanList("").catch((error) =>
      this.notify(error, false)
    );
  },
  methods: {
    ...mapActions(d$PembukuanPakan, [
      "a$exportExcel",
      "a$PembukuanPakanList",
      "a$PembukuanPakanAdd",
      "a$PembukuanPakanEdit",
      "a$PembukuanPakanDelete",
      "a$PembukuanPakanDetail",
      "a$PembukuanPakanDetailAdd",
    ]),
    clearInput() {
      this.input = {
        id_pembukuan_pakan: null,
        tanggal: null,
        keterangan: null,
        penanggung_jawab: null,
        berat_pakan: null,
      };
    },

    async triggerExport() {
      try {
        // Ambil data yang akan dtriggiekspor
        const dataToExport = this.g$PembukuanPakanList; // Ganti dengan data yang sesuai

        // Membuat objek workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Data Pakan");

        // Menambahkan header kolom
        worksheet.columns = [
          { header: "Tanggal", key: "tanggal", width: 15 },
          { header: "Keterangan", key: "keterangan", width: 30 },
          { header: "Penanggung Jawab", key: "penanggung_jawab", width: 20 },
          { header: "Berat Pakan", key: "berat_pakan", width: 15 },
        ];

        // Menambahkan data ke worksheet
        dataToExport.forEach((item) => {
          worksheet.addRow({
            tanggal: item.tanggal,
            keterangan: item.keterangan,
            penanggung_jawab: item.penanggung_jawab,
            berat_pakan: item.berat_pakan,
          });
        });

        // Menghasilkan file Excel
        const buffer = await workbook.xlsx.writeBuffer();

        // Menyimpan file Excel sebagai Blob
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Menyimpan dan menamai file Excel
        FileSaver.saveAs(blob, "data-pembukuan-pakan.xlsx");
        this.notify("Export Data ke Excel Telah Berhasil");
      } catch (error) {
        this.notify(error, false);
      }
    },

    async addPembukuanPakan() {
      this.loading = true;
      try {
        const { tanggal, keterangan, penanggung_jawab, berat_pakan } =
          this.input;
        const data = {
          tanggal,
          keterangan,
          penanggung_jawab,
          berat_pakan,
        };
        await this.schema.validate(data);
        await this.a$PembukuanPakanAdd(data);
        this.modal.addPembukuanPakan = false;
        this.notify(`Tambah ${this.pageTitle} Sukses!`);
        // Refresh data after successful submit
        await this.a$PembukuanPakanList("");
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.loading = false;
      }
    },

    async ubahPembukuanPakan() {
      this.loading = true;
      try {
        const {
          id_pembukuan_pakan,
          tanggal,
          keterangan,
          penanggung_jawab,
          berat_pakan,
        } = this.input;
        const data = {
          id_pembukuan_pakan,
          tanggal,
          keterangan,
          penanggung_jawab,
          berat_pakan,
        };
        await this.schema.validate(data);
        await this.a$PembukuanPakanEdit(data);
        this.modal.ubahPembukuanPakan = false;
        this.notify(`Edit ${this.pageTitle} Sukses!`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$PembukuanPakanList("");
        this.loading = false;
      }
    },

    async delPakan() {
      this.loading = true;
      try {
        const { id_pembukuan_pakan } = this.input;
        const data = {
          id_pembukuan_pakan,
        };
        await this.a$PembukuanPakanDelete(data);
        this.modal.confirm = false;
        this.notify(`Hapus ${this.pageTitle} Sukses!`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$PembukuanPakanList("");
        this.loading = false;
      }
    },

    async triggerEditModal(row) {
      try {
        const {
          id_pembukuan_pakan,
          tanggal,
          keterangan,
          penanggung_jawab,
          berat_pakan,
        } = row;
        this.input = {
          id_pembukuan_pakan,
          tanggal,
          keterangan,
          penanggung_jawab,
          berat_pakan,
        };
        this.modal.ubahPembukuanPakan = true;
      } catch (error) {
        this.clearInput();
        this.notify(error, false);
      }
    },

    async triggerDelete(row) {
      try {
        const { id_pembukuan_pakan, tanggal, keterangan, berat_pakan } = row;
        this.input = {
          id_pembukuan_pakan,
          tanggal,
          keterangan,
          berat_pakan,
        };
        this.modal.confirm = true;
      } catch (error) {
        this.clearInput();
        this.notify(error, false);
      }
    },

    async triggerDetail(row) {
      try {
        const { id_pembukuan_pakan } = row;
        router.push({
          name: "Detail Pembukuan Pakan",
          params: {
            id: id_pembukuan_pakan,
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