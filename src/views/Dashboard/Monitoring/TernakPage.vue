<script>
import { mapActions, mapState } from "pinia";
import d$ternak from "@/stores/monitoring/ternak";
import d$dropdown from "@/stores/dropdown";
import d$kesehatan from "@/stores/monitoring/kesehatan";
import HcLine from "@/components/HighCharts/Line.vue";
import { ubahTanggal } from "@/utils/locale/ubahTanggal";

import {
  object as y$object,
  array as y$array,
  string as y$string,
  ref as y$ref,
} from "yup";

export default {
  metaInfo: () => ({
    title: "Data Ternak",
  }),
  components: {
    HcLine,
  },
  setup() {
    const schema = y$object({
      qr_id: y$string().required().label("QR ID"),
      berat: y$string().nullable().label("Berat"),
      suhu: y$string().nullable().label("Suhu"),
    });
    return {
      schema,
    };
  },
  data: () => ({
    pageTitle: "Data Ternak",
    // Input
    input: {
      id_ternak: null,
      qr_id: null,
      image: null,
      jenis_kelamin: null,
      id_bangsa: null,
      berat: null,
      suhu: null,
      tanggal_lahir: null,
      tanggal_masuk: null,
      id_dam: null,
      id_sire: null,
      fase: {
        id: 1,
        name: "Pemasukan",
      },
      id_kandang: null,
      tanggal_keluar: null,
      status_keluar: null,
      status_ternak: null,
      // imageUrl: null,
    },
    // UI
    modal: {
      addTernak: false,
      ubahTernak: false,
      confirm: false,
      detailTernak: false,
    },
    loading: false,
    loadingModal: false,
    // DataTable
    dt: {
      column: [
        {
          name: "qr_id",
          th: "QR ID Ternak",
        },
        {
          name: "bangsa",
          th: "Bangsa",
          render: ({ bangsa }) => (bangsa ? bangsa.bangsa : null),
        },
        {
          name: "jenis_kelamin",
          th: "Jenis Kelamin",
        },
        {
          th: "Fase",
          render: ({ fase }) => (fase ? fase.fase : null),
        },
        {
          th: "Status",
          render: ({ status_ternak }) =>
            status_ternak ? status_ternak.status_ternak : null,
        },
        {
          name: "umur",
          th: "Umur",
        },
      ],
      action: [
        {
          text: "Detail",
          color: "info",
          event: "detail-ternak",
        },
        {
          text: "Ubah",
          color: "warning",
          event: "ubah-ternak",
        },
        {
          text: "Hapus",
          color: "danger",
          event: "hapus-ternak",
        },
      ],
    },
    infoTernak: {},
  }),
  computed: {
    ...mapState(d$ternak, [
      "g$ternakList",
      "g$perlakuan",
      "g$statusTernak",
      "g$byTimbangan",
    ]),
    ...mapState(d$kesehatan, ["g$riwayatKesehatan"]),
    ...mapState(d$dropdown, [
      "g$ddJenisKelamin",
      "g$ddBangsa",
      "g$ddStatusSehat",
      "g$ddFasePemeliharaan",
      "g$ddStatusKeluar",
      "g$ddKandang",
      "g$ddPakan",
      "g$ddListPenyakit",
      "g$ddListBetina",
      "g$ddListPejantan",
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
    this.a$ternakList().catch((error) => this.notify(error, false));
  },
  methods: {
    ...mapActions(d$ternak, [
      "a$ternakAdd",
      "a$ternakList",
      "a$ternakDelete",
      "a$ternakEdit",
      "a$perlakuan",
      "a$statusTernak",
      "a$byTimbangan",
    ]),
    ...mapActions(d$dropdown, [
      "a$ddBangsa",
      "a$ddFasePemeliharaan",
      "a$ddKandang",
      "a$ddPakan",
      "a$ddListPenyakit",
      "a$ddListBetina",
      "a$ddListPejantan",
    ]),
    ...mapActions(d$kesehatan, ["a$riwayatKesehatan"]),
    resetImage() {
      this.input.imageUrl = "";
      this.input.image = "";
    },
    clearInput() {
      this.input = {
        id_ternak: null,
        qr_id: null,
        image: null,
        jenis_kelamin: null,
        bangsa: null,
        berat: null,
        suhu: null,
        tanggal_lahir: null,
        tanggal_masuk: null,
        id_dam: null,
        id_sire: null,
        fase: {
          id: 1,
          name: "Pemasukan",
        },
        kandang: null,
        tanggal_keluar: null,
        status_keluar: null,
      };
    },
    async addTernak() {
      this.loading = true;
      try {
        const {
          qr_id,
          // image,
          jenis_kelamin,
          bangsa,
          berat,
          suhu,
          tanggal_lahir,
          tanggal_masuk,
          id_dam,
          id_sire,
          fase,
          kandang,
          status_ternak,
        } = this.input;
        const data = {
          // qr_id,
          qr_id: qr_id ? qr_id : null,
          // image,
          jenis_kelamin: jenis_kelamin ? jenis_kelamin : null,
          id_bangsa: bangsa ? bangsa.id : null,
          berat,
          suhu,
          tanggal_lahir: tanggal_lahir ? tanggal_lahir : null,
          tanggal_masuk: tanggal_masuk ? tanggal_masuk : null,
          id_dam: id_dam ? id_dam.id : null,
          id_sire: id_sire ? id_sire.id : null,
          id_fp: fase ? fase.id : null,
          id_status_ternak: status_ternak
            ? status_ternak.id_status_ternak
            : null,
          id_kandang: kandang ? kandang.id : null,
        };
        await this.schema.validate(data);
        const tambahTernak = await this.a$ternakAdd(data);
        this.modal.addTernak = false;
        this.notify(
          `Ternak dengan QR ID Ternak ${tambahTernak.qr_id} berhasil ditambahkan`
        );
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$ternakList();
      }
      this.loading = false;
    },
    async editTernak() {
      this.loading = true;
      try {
        const {
          id_ternak,
          qr_id,
          // image,
          jenis_kelamin,
          bangsa,
          berat,
          suhu,
          tanggal_lahir,
          tanggal_masuk,
          id_dam,
          id_sire,
          fase,
          status_ternak,
          kandang,
        } = this.input;
        const data = {
          id_ternak,
          qr_id,
          // image,
          jenis_kelamin: jenis_kelamin ? jenis_kelamin : null,
          id_bangsa: bangsa ? bangsa.id : null,
          berat,
          suhu,
          tanggal_lahir: tanggal_lahir ? tanggal_lahir : null,
          tanggal_masuk: tanggal_masuk ? tanggal_masuk : null,
          id_dam: id_dam ? id_dam.id : null,
          id_sire: id_sire ? id_sire.id : null,
          id_fp: fase ? fase.id : null,
          id_status_ternak: status_ternak
            ? status_ternak.id_status_ternak
            : null,
          id_kandang: kandang ? kandang.id : null,
        };
        await this.schema.validate(data);
        const editTernak = await this.a$ternakEdit(data);
        this.modal.ubahTernak = false;
        this.notify(`Ternak dengan ID Ternak ${editTernak.qr_id} berhasil diubah`);
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$ternakList();
      }
      this.loading = false;
    },
    async delTernak() {
      this.loading = true;
      try {
        const { id_ternak, status_keluar } = this.input;
        const data = {
          id_ternak,
          status_keluar,
          tanggal_keluar: new Date(),
        };
        const deleteTernak = await this.a$ternakDelete(data);
        this.modal.confirm = false;
        this.notify(
          `Ternak dengan ID Ternak ${deleteTernak.qr_id} berhasil dihapus`
        );
      } catch (error) {
        this.notify(error, false);
      } finally {
        this.a$ternakList(this.userInfo.id);
      }
      this.loading = false;
    },
    async triggerAddTernak() {
      this.loadingModal = true;
      this.modal.addTernak = true;
      await this.a$ddBangsa().catch((error) => this.notify(error, false));
      await this.a$ddFasePemeliharaan().catch((error) =>
        this.notify(error, false)
      );
      await this.a$ddKandang().catch((error) => this.notify(error, false));
      await this.a$ddListBetina().catch((error) => this.notify(error, false));
      await this.a$ddListPejantan().catch((error) => this.notify(error, false));
      await this.a$statusTernak().catch((error) => this.notify(error, false));
      this.loadingModal = false;
    },
    async triggerEditModal(row) {
      this.modal.ubahTernak = true;
      this.loadingModal = true;
      await this.a$ddBangsa().catch((error) => this.notify(error, false));
      await this.a$ddFasePemeliharaan().catch((error) =>
        this.notify(error, false)
      );
      await this.a$ddKandang().catch((error) => this.notify(error, false));
      await this.a$ddListBetina().catch((error) => this.notify(error, false));
      await this.a$ddListPejantan().catch((error) => this.notify(error, false));
      await this.a$statusTernak().catch((error) => this.notify(error, false));
      const {
        id_ternak,
        qr_id,
        image,
        jenis_kelamin,
        bangsa,
        berat,
        suhu,
        tanggal_lahir,
        tanggal_masuk,
        id_dam,
        id_sire,
        penyakit,
        fase,
        kandang,
        tanggal_keluar,
        status_keluar,
        status_ternak,
      } = row;
      this.input = {
        id_ternak,
        qr_id,
        jenis_kelamin,
        bangsa: {
          id: bangsa ? bangsa.id_bangsa : null,
          name: bangsa ? bangsa.bangsa : null,
        },
        berat,
        suhu,
        tanggal_lahir,
        tanggal_masuk,
        id_dam: {
          id: id_dam ? id_dam : null,
          name: id_dam ? id_dam : null,
        },
        id_sire: {
          id: id_sire ? id_sire : null,
          name: id_sire ? id_sire : null,
        },
        kandang: {
          id: kandang ? kandang.id_kandang : null,
          name: kandang ? kandang.kode_kandang : null,
        },
        penyakit: {
          id: penyakit ? penyakit.id_penyakit : null,
          name: penyakit ? penyakit.nama_penyakit : null,
        },
        fase: {
          id: fase ? fase.id_fp : null,
          name: fase ? fase.fase : null,
        },
        status_ternak: {
          id_status_ternak: status_ternak
            ? status_ternak.id_status_ternak
            : null,
          status_ternak: status_ternak ? status_ternak.status_ternak : null,
        },

        tanggal_keluar,
        status_keluar,
        image,
      };
      this.loadingModal = false;
    },
    async triggerDelete(row) {
      try {
        const { id_ternak, status_keluar } = row;
        this.input = {
          id_ternak,
          status_keluar,
        };
        this.modal.confirm = true;
      } catch (error) {
        this.clearInput();
        this.notify(error, false);
      }
    },
    async triggerDetail(row) {
      try {
        this.infoTernak = { ...row };
        this.modal.detailTernak = true;
        this.a$riwayatKesehatan(this.infoTernak.id_ternak);
        this.a$perlakuan(this.infoTernak.id_ternak);
        this.a$byTimbangan(this.infoTernak.id_ternak);
      } catch (error) {}
    },
    handleFileUpload() {
      const file = this.$refs.image.files[0];
      this.input.image = file;
      this.input.imageUrl = URL.createObjectURL(this.input.image);
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
        <div class="col text-right">
          <base-button type="success" @click="triggerAddTernak">
            <span>Tambah {{ pageTitle }}</span>
          </base-button>
        </div>
      </div>
    </template>

    <template #body>
      <empty-result v-if="!g$ternakList.length" :text="`${pageTitle}`" />
      <data-table
        v-else
        :index="true"
        :data="g$ternakList"
        :columns="dt.column"
        :actions="dt.action"
        @ubah-ternak="triggerEditModal"
        @hapus-ternak="triggerDelete"
        @detail-ternak="triggerDetail"
      />
    </template>

    <template #modal>
      <!-- add modal -->
      <modal-comp v-model:show="modal.addTernak" modal-classes="modal-lg">
        <template #header>
          <h3 class="modal-title">Tambah {{ pageTitle }} Baru</h3>
        </template>
        <template #body>
          <div v-if="loadingModal">
            <i class="fa fa-spinner fa-spin"></i> Sedang memuat...
          </div>
          <div v-else>
            <form-comp v-if="modal.addTernak" :validation-schema="schema">
              <div class="row">
                <!-- RFID -->
                <div class="col-6">
                  <field-form
                    v-slot="{ field }"
                    v-model="input.qr_id"
                    type="text"
                    name="qr_id"
                  >
                    <base-input
                      v-bind="field"
                      placeholder="QR ID dari kalung domba"
                      label="QR ID"
                      required
                    ></base-input>
                  </field-form>
                </div>

                <!-- Berat -->
                <div class="col-6">
                  <field-form
                    v-slot="{ field }"
                    v-model="input.berat"
                    name="berat"
                  >
                    <base-input
                      v-bind="field"
                      placeholder="Masukan berat"
                      label="Berat"
                      type="number"
                    ></base-input>
                  </field-form>
                </div>

                <!-- suhu -->
                <div class="col-6">
                  <field-form
                    v-slot="{ field }"
                    v-model="input.suhu"
                    name="suhu_berkala"
                  >
                    <base-input
                      v-bind="field"
                      placeholder="Masukan suhu"
                      label="Suhu"
                      type="number"
                    ></base-input>
                  </field-form>
                </div>

                <!-- Bangsa -->
                <div class="col-6">
                  <base-input name="bangsa" label="Bangsa">
                    <multi-select
                      v-model="input.bangsa"
                      :options="g$ddBangsa"
                      label="name"
                      track-by="id"
                      placeholder="Pilih bangsa"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- Jenis kelamin -->
                <div class="col-6">
                  <base-input name="jenis_kelamin" label="Jenis Kelamin">
                    <multi-select
                      v-model="input.jenis_kelamin"
                      :options="g$ddJenisKelamin"
                      placeholder="Pilih Jenis Kelamin"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- Tanggal lahir -->
                <div class="col-6">
                  <base-input name="tanggal_lahir" label="Tanggal Lahir">
                    <flat-pickr
                      v-model.lazy="input.tanggal_lahir"
                      :config="{
                        mode: 'single',
                        allowInput: true,
                        maxDate: new Date(),
                      }"
                      class="form-control datepicker"
                      placeholder="Pilih tanggal"
                    />
                  </base-input>
                </div>

                <!-- ID sire -->
                <div class="col-6">
                  <base-input name="id_sire" label="ID Sire (Bapak)" nullable>
                    <multi-select
                      v-model="input.id_sire"
                      :options="g$ddListPejantan"
                      label="name"
                      track-by="id"
                      placeholder="Pilih ID sire (bapak) dari domba"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- ID dam -->
                <div class="col-6">
                  <base-input name="id_dam" label="ID Dam (Ibu)" nullable>
                    <multi-select
                      v-model="input.id_dam"
                      :options="g$ddListBetina"
                      label="name"
                      track-by="id"
                      placeholder="Pilih ID dam (ibu) dari domba"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- Tanggal masuk -->
                <div class="col-6">
                  <base-input name="tanggal_masuk" label="Tanggal Masuk">
                    <flat-pickr
                      v-model.lazy="input.tanggal_masuk"
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

                <!-- Kandang -->
                <div class="col-6">
                  <base-input name="kandang" label="Kandang">
                    <multi-select
                      v-model="input.kandang"
                      :options="g$ddKandang"
                      label="name"
                      track-by="id"
                      placeholder="Pilih kandang"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- Fase-->
                <div class="col-6">
                  <base-input name="fase" placeholder="Fase" label="Fase">
                    <multi-select
                      v-model="input.fase"
                      :options="g$ddFasePemeliharaan"
                      label="name"
                      track-by="id"
                      placeholder="Pilih fase pemeliharaan"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- Status ternak -->
                <div class="col-6">
                  <base-input name="status_ternak" label="Status Ternak">
                    <multi-select
                      v-model="input.status_ternak"
                      :options="g$statusTernak"
                      label="status_ternak"
                      track-by="id_status_ternak"
                      placeholder="Pilih status ternak"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- Image-->
                <!-- <div class="col-6" v-if="!this.input.image">
                  <div class="form-group has-label">
                    <label class="form-control-label">image</label>
                    <input
                      class="form-control file"
                      id="image"
                      type="file"
                      ref="image"
                      accept="image/*"
                      @change="handleFileUpload()"
                    />
                  </div>
                </div>
                <div class="col-6" v-if="this.input.imageUrl">
                  <div class="text-center pb-2">
                    <base-button type="danger" size="sm" @click="resetImage()">
                      Reset Image
                    </base-button>
                  </div>
                  <div class="text-center">
                    <img
                      width="250"
                      v-if="input.imageUrl"
                      :src="input.imageUrl"
                    />
                  </div>
                </div> -->
              </div>
            </form-comp>
          </div>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.addTernak = false">
            Tutup
          </base-button>
          <base-button type="primary" @click="addTernak()">
            <span v-if="!loading">Tambah {{ pageTitle }}</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang menambahkan...
            </span>
          </base-button>
        </template>
      </modal-comp>

      <!-- Edit Modal -->
      <modal-comp v-model:show="modal.ubahTernak" modal-classes="modal-lg">
        <template #header>
          <h3 class="modal-title">
            Detail {{ pageTitle }} Nomor {{ input.id_ternak }}
          </h3>
        </template>
        <template #body>
          <div v-if="loadingModal">
            <i class="fa fa-spinner fa-spin"></i> Sedang memuat...
          </div>
          <div v-else>
            <form-comp v-if="modal.ubahTernak" :validation-schema="schema">
              <div class="row">
                <!-- RFID -->
                <div class="col-6">
                  <field-form
                    v-slot="{ field }"
                    v-model="input.qr_id"
                    type="text"
                    name="qr_id"
                  >
                    <base-input
                      v-bind="field"
                      placeholder="QR ID dari kalung domba"
                      label="QR ID"
                      required
                    ></base-input>
                  </field-form>
                </div>

                <!-- Berat -->
                <div class="col-6">
                  <field-form
                    v-slot="{ field }"
                    v-model="input.berat"
                    name="berat"
                  >
                    <base-input
                      v-bind="field"
                      placeholder="Berat"
                      label="Berat"
                      type="number"
                    ></base-input>
                  </field-form>
                </div>

                <!-- Suhu -->
                <div class="col-6">
                  <field-form
                    v-slot="{ field }"
                    v-model="input.suhu"
                    name="suhu"
                  >
                    <base-input
                      v-bind="field"
                      placeholder="Suhu"
                      label="Suhu"
                      type="number"
                    ></base-input>
                  </field-form>
                </div>

                <!-- Bangsa -->
                <div class="col-6">
                  <base-input name="bangsa" label="Bangsa">
                    <multi-select
                      v-model="input.bangsa"
                      :options="g$ddBangsa"
                      label="name"
                      track-by="id"
                      placeholder="Pilih bangsa"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- Jenis kelamin -->
                <div class="col-6">
                  <base-input name="jenis_kelamin" label="Jenis Kelamin">
                    <multi-select
                      v-model="input.jenis_kelamin"
                      :options="g$ddJenisKelamin"
                      placeholder="Pilih Jenis Kelamin"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- Tanggal lahir -->
                <div class="col-6">
                  <base-input name="tanggal_lahir" label="Tanggal Lahir">
                    <flat-pickr
                      v-model.lazy="input.tanggal_lahir"
                      :config="{
                        mode: 'single',
                        allowInput: true,
                        maxDate: new Date(),
                      }"
                      class="form-control datepicker"
                      placeholder="Pilih tanggal"
                    />
                  </base-input>
                </div>

                <!-- ID sire -->
                <div class="col-6">
                  <base-input name="id_sire" label="ID Sire (Bapak)" nullable>
                    <multi-select
                      v-model="input.id_sire"
                      :options="g$ddListPejantan"
                      label="name"
                      track-by="id"
                      placeholder="Pilih ID sire (bapak) dari domba"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- ID dam -->
                <div class="col-6">
                  <base-input name="id_dam" label="ID Dam (Ibu)" nullable>
                    <multi-select
                      v-model="input.id_dam"
                      :options="g$ddListBetina"
                      label="name"
                      track-by="id"
                      placeholder="Pilih ID dam (ibu) dari domba"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- Tanggal masuk -->
                <div class="col-6">
                  <base-input name="tanggal_masuk" label="Tanggal Masuk">
                    <flat-pickr
                      v-model.lazy="input.tanggal_masuk"
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

                <!-- Kandang -->
                <div class="col-6">
                  <base-input name="kandang" label="Kandang">
                    <multi-select
                      v-model="input.kandang"
                      :options="g$ddKandang"
                      label="name"
                      track-by="id"
                      placeholder="Pilih Kandang"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- Fase -->
                <div class="col-6">
                  <base-input name="fase" label="Fase Pemeliharaan">
                    <multi-select
                      v-model="input.fase"
                      :options="g$ddFasePemeliharaan"
                      label="name"
                      track-by="id"
                      placeholder="Pilih fase pemeliharaan"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- Status-->
                <div class="col-6">
                  <base-input
                    name="status_ternak"
                    placeholder="Status Ternak"
                    label="Status"
                  >
                    <multi-select
                      v-model="input.status_ternak"
                      :options="g$statusTernak"
                      label="status_ternak"
                      track-by="id_status_ternak"
                      placeholder="Pilih status ternak"
                      :show-labels="false"
                    />
                  </base-input>
                </div>

                <!-- Image-->
                <!-- <div class="col-6" v-if="!this.input.image">
                  <div class="form-group has-label">
                    <label class="form-control-label">image</label>
                    <input
                      class="form-control file"
                      id="image"
                      type="file"
                      ref="image"
                      accept="image/*"
                      @change="handleFileUpload()"
                    />
                  </div>
                </div>
                <div class="col-6" v-if="this.input.imageUrl">
                  <div class="text-center pb-2">
                    <base-button type="danger" size="sm" @click="resetImage()">
                      Reset Image
                    </base-button>
                  </div>
                  <div class="text-center">
                    <img
                      width="250"
                      v-if="input.imageUrl"
                      :src="input.imageUrl"
                    />
                  </div>
                </div> -->
              </div>
            </form-comp>
          </div>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.ubahTernak = false">
            Tutup
          </base-button>
          <base-button type="primary" @click="editTernak()">
            <span v-if="!loading">Simpan Perubahan</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang menyimpan...
            </span>
          </base-button>
        </template>
      </modal-comp>

      <!-- delete modal -->
      <modal-comp v-model:show="modal.confirm" modal-classes="modal-md">
        <template #header>
          <h3 class="modal-title">
            Hapus {{ pageTitle }} Nomor {{ input.id_ternak }}
          </h3>
        </template>
        <template #body>
          <div class="col-12">
            <base-input
              name="status_keluar"
              label="Pilih Alasan Untuk Menghapus Data Ternak ini"
            >
              <multi-select
                v-model="input.status_keluar"
                :options="g$ddStatusKeluar"
                placeholder="Pilih Alasan Hapus"
                :show-labels="false"
              />
            </base-input>
            <p class="mt--4 text-danger text-sm">
              Setelah dihapus, Anda tidak dapat memulihkan data ini!
            </p>
          </div>
        </template>
        <template #footer>
          <base-button type="secondary" @click="modal.confirm = false">
            Tutup
          </base-button>
          <base-button type="danger" @click="delTernak()">
            <span v-if="!loading">Hapus</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang mennghapus...
            </span></base-button
          >
        </template>
      </modal-comp>

      <!-- Modal Detail Ternak -->
      <modal-comp v-model:show="modal.detailTernak" modal-classes="modal-md">
        <template #header>
          <h3 class="modal-title">
            Detail Ternak Nomor {{ infoTernak.id_ternak }}
          </h3>
        </template>
        <template v-if="modal.detailTernak" #body>
          <tabs>
            <tab-pane title="Detail">
              <div
                style="max-height: 450px; overflow-y: auto; overflow-x: hidden"
              >
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
                    <span style="font-weight: 600">QR ID</span>
                  </div>
                  <div class="col">
                    :
                    <span style="font-weight: 300">
                      {{ infoTernak.qr_id }}</span
                    >
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
                        infoTernak.jenis_kelamin
                          ? infoTernak.jenis_kelamin
                          : "---"
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
                        infoTernak.kandang
                          ? infoTernak.kandang.kode_kandang
                          : "---"
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
            </tab-pane>
            <tab-pane title="Kesehatan">
              <div
                style="max-height: 500px; overflow-y: 800px; overflow-x: hidden"
              >
                <h3 class="my-3">Riwayat Kesehatan</h3>
                <empty-result
                  v-if="!g$riwayatKesehatan.length"
                  :text="`Kesehatan`"
                />
                <div class="m-3" v-for="item in g$riwayatKesehatan">
                  <hr class="m-0" />
                  <div class="row">
                    <div class="col-5">
                      <span style="font-weight: 400">Nama Penyakit</span>
                    </div>
                    <div class="col">
                      :
                      <span style="font-weight: 200">{{ item.penyakit }}</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-5">
                      <span style="font-weight: 400">Tanggal Sakit</span>
                    </div>
                    <div class="col">
                      :
                      <span style="font-weight: 200">{{
                        item.tanggal_sakit
                          ? ubahTanggal(item.tanggal_sakit)
                          : "-"
                      }}</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-5">
                      <span style="font-weight: 400">Tanggal Sembuh</span>
                    </div>
                    <div class="col">
                      :
                      <span style="font-weight: 200">{{
                        item.tanggal_sembuh
                          ? ubahTanggal(item.tanggal_sakit)
                          : "-"
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </tab-pane>
            <tab-pane title="Perlakuan">
              <h3 class="my-3">Perlakuan yang telah diberikan</h3>
              <empty-result v-if="!g$perlakuan.length" :text="`Perlakuan`" />
              <div v-for="(key, index) in g$perlakuan">
                <hr class="m-0" />
                <div class="row">
                  <div class="col-7">
                    <small class="text-sm mb-1 mt-1">
                      <ol>
                        <li :value="index + 1" class="ml--2">
                          {{ key.treatment }}
                        </li>
                      </ol>
                    </small>
                  </div>
                  <div class="col-5">
                    <small>
                      {{ ubahTanggal(key.tanggal_adaptasi) }}
                    </small>
                  </div>
                </div>
              </div>
            </tab-pane>
            <tab-pane title="Grafik">
              <h3 class="my-4">Grafik Bobot dan Suhu</h3>
              <hc-line
                :height="250"
                :data="g$byTimbangan"
                :data-labels="true"
                :legend="true"
              />
            </tab-pane>
          </tabs>
        </template>
      </modal-comp>
    </template>
  </main-layout>
</template>
