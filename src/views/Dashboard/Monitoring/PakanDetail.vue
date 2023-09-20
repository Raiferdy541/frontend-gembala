<script>
import { mapActions, mapState } from "pinia";
import d$bahanPakan from "@/stores/monitoring/bahanPakan";
import d$dropdown from "@/stores/dropdown";
import { ubahTanggal } from "@/utils/locale/ubahTanggal";

export default {
  metaInfo: () => ({
    title: "Detail Bahan Pakan",
  }),
  data: () => ({
    pageTitle: "Detail Bahan Pakan",
    // Input
    input: {
      id_bahan_pakan: null,
      tanggal: null,
      keterangan: null,
      jumlah: null,
    },
    // UI
    modal: {
      detailTernak: false,
      addDetailPakan: false,
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
          th: "Jumlah",
          render: ({ jumlah, jenis_bahan_pakan }) =>
            `${jumlah} ${jenis_bahan_pakan.satuan}`,
        },
      ],
      action: [],
    },
  }),
  computed: {
    ...mapState(d$bahanPakan, ["g$detailBahanPakan", "g$detailNamaBahanPakan"]),
    ...mapState(d$dropdown, ["g$ddKeteranganDetailPakan", "g$ddSatuanPakan"]),
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
    await this.a$bahanPakan
    (this.$route.params.id).catch((error) =>
      this.notify(error, false)
    );
  },
  methods: {
    ...mapActions(d$bahanPakan, [
      "a$bahanPakanDetail",
      "a$bahanPakanDetailAdd",
    ]),
    clearInput() {
      this.input = {
        id_bahan_pakan: null,
        tanggal: null,
        keterangan: null,
        jumlah: null,
      };
    },

    async addDetailPakan() {
      this.loading = true;
      const id_jenis_bahan_pakan = this.$route.params.id;
      const { tanggal, keterangan, jumlah } = this.input;
      const data = {
        id_jenis_bahan_pakan,
        tanggal,
        keterangan,
        jumlah,
      };
      await this.a$bahanPakanDetailAdd(data).catch((error) =>
        this.notify(error, false)
      );
      await this.a$bahanPakanDetail(this.$route.params.id).catch((error) =>
        this.notify(error, false)
      );
      this.modal.addDetailPakan = false;
      this.loading = false;
    },
  },
};
</script>

<template>
  <main-layout
    :title="pageTitle + ' ' + g$detailNamaBahanPakan"
    disable-padding
  >
    <template #header>
      <div class="row align-items-center">
        <div class="col-auto">
          <h3>Daftar {{ pageTitle }}</h3>
        </div>

        <!-- Tambah detail pakan -->
        <div class="col text-right">
          <base-button type="success" @click="modal.addDetailPakan = true">
            Tambah {{ pageTitle }}
          </base-button>
        </div>
      </div>
    </template>

    <template #body>
      <empty-result v-if="!g$detailBahanPakan.length" :text="`${pageTitle}`" />
      <data-table
        v-else
        :index="true"
        :data="g$detailBahanPakan"
        :columns="dt.column"
        :actions="dt.action"
      />
    </template>

    <template #modal>
      <!-- Tambah detail pakan -->
      <modal-comp v-model:show="modal.addDetailPakan" modal-classes="modal-sm">
        <template #header>
          <h3 class="modal-title">Tambah {{ pageTitle }} Baru</h3>
        </template>
        <template #body>
          <form-comp v-if="modal.addDetailPakan">
            <div class="row">
              <!-- Tanggal -->
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

              <!-- Jumlah -->
              <div class="col-12">
                <field-form
                  v-slot="{ field }"
                  v-model="input.jumlah"
                  type="number"
                  name="jumlah"
                >
                  <base-input
                    v-bind="field"
                    placeholder="Jumlah dalam satuan"
                    label="Jumlah"
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
          <base-button type="secondary" @click="modal.addDetailPakan = false">
            Tutup
          </base-button>
          <base-button type="primary" @click="addDetailPakan">
            <span v-if="!loading">Tambah {{ pageTitle }}</span>
            <span v-else>
              <i class="fa fa-spinner fa-spin"></i> Sedang menambahkan...
            </span>
          </base-button>
        </template>
      </modal-comp>
    </template>
  </main-layout>
</template>
