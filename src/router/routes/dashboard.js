import DashboardLayout from "@/layout/DashboardLayout.vue";

import { certDetail } from "@/utils/cookies";

const dashboardRoutes = [
  {
    path: "/dashboard",
    component: DashboardLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Dashboard/Chart.vue"),
        meta: { requiresAuth: true, hideFooter: true },
      },
    ],
  },
  {
    path: "/monitoring",
    component: DashboardLayout,
    redirect: { name: "Home" },
    children: [
      {
        path: "data-kandang",
        name: "Data Kandang",
        component: () =>
          import("@/views/Dashboard/Monitoring/DaftarKandang.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "detail-kandang/:id",
        name: "Detail Kandang",
        component: () =>
          import("@/views/Dashboard/Monitoring/KandangDetail.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "data-pakan",
        name: "Data Pakan",
        component: () =>
          import("@/views/Dashboard/Monitoring/JenisPakanPage.vue"),
        meta: { requiresAuth: true },
      },
      // {
      //   path: "data-pakan/pembukuan-pakan",
      //   name: "Pembukuan Pakan",
      //   component: () =>
      //     import("@/views/Dashboard/Monitoring/Pembukuan.vue"),
      //   meta: { requiresAuth: true },
      // },
      {
        path: "detail-pakan/:id",
        name: "Detail Pakan",
        component: () =>
          import("@/views/Dashboard/Monitoring/JenisPakanDetail.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "data-pakan/pembukuan-pakan/:id",
        name: "Pembukuan Pakan",
        component: () =>
          import("@/views/Dashboard/Monitoring/PembukuanPakanDetail.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "data-pakan/bahan-pakan",
        name: "Bahan Pakan",
        component: () => import("@/views/Dashboard/Monitoring/PakanPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "data-pakan/detail-bahan-pakan/:id",
        name: "Detail Bahan Pakan",
        component: () => import("@/views/Dashboard/Monitoring/PakanDetail.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "data-penyakit",
        name: "Data Penyakit",
        component: () =>
          import("@/views/Dashboard/Monitoring/PenyakitPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "data-penyakit/data-kesehatan",
        name: "Data Kesehatan",
        component: () =>
          import("@/views/Dashboard/Monitoring/KesehatanPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "data-penyakit/riwayat-kesehatan",
        name: "Riwayat Kesehatan",
        component: () =>
          import("@/views/Dashboard/Monitoring/RiwayatKesehatan.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "data-penyakit/detail-ternak-sakit/:id",
        name: "Detail Ternak Sakit",
        component: () =>
          import("@/views/Dashboard/Monitoring/KesehatanDetail.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "data-ternak",
        name: "Data Ternak",
        component: () => import("@/views/Dashboard/Monitoring/TernakPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "data-perkawinan",
        name: "Data Perkawinan",
        component: () => import("@/views/Dashboard/Monitoring/KawinPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "riwayat-kawin/:id",
        name: "Detail Kawin",
        component: () => import("@/views/Dashboard/Monitoring/KawinDetail.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/user",
    component: DashboardLayout,
    redirect: { name: "Home" },
    children: [
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/Dashboard/User/ProfilePage.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/fase",
    component: DashboardLayout,
    redirect: { name: "Home" },
    children: [
      {
        path: "pemasukan",
        name: "Summary Pemasukan",
        component: () =>
          import("@/views/Dashboard/Fase/Pemasukan/SummaryPemasukan.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "pemasukan/data-pemasukan",
        name: "Fase Pemasukan",
        component: () =>
          import("@/views/Dashboard/Fase/Pemasukan/Pemasukan.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "pemasukan/langkah-kerja",
        name: "Langkah Kerja Pemasukan",
        component: () =>
          import("@/views/Dashboard/Fase/Pemasukan/LK_Pemasukan.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "adaptasi",
        name: "Summary Adaptasi",
        component: () =>
          import("@/views/Dashboard/Fase/Adaptasi/SummaryAdaptasi.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "adaptasi/data-adaptasi",
        name: "Fase Adaptasi Hari 1",
        component: () => import("@/views/Dashboard/Fase/Adaptasi/Adaptasi.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "adaptasi/data-adaptasi-2",
        name: "Fase Adaptasi Hari 2",
        component: () =>
          import("@/views/Dashboard/Fase/Adaptasi/AdaptasiH2.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "adaptasi/data-adaptasi-3",
        name: "Fase Adaptasi Hari 3",
        component: () =>
          import("@/views/Dashboard/Fase/Adaptasi/AdaptasiH3.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "adaptasi/data-adaptasi-4",
        name: "Fase Adaptasi Hari 4",
        component: () =>
          import("@/views/Dashboard/Fase/Adaptasi/AdaptasiHari4.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "adaptasi/data-adaptasi-5",
        name: "Fase Adaptasi Hari 5",
        component: () =>
          import("@/views/Dashboard/Fase/Adaptasi/AdaptasiHari5.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "adaptasi/langkah-kerja",
        name: "Langkah Kerja Adaptasi",
        component: () =>
          import("@/views/Dashboard/Fase/Adaptasi/LK_Adaptasi.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "perkawinan",
        name: "Summary Perkawinan",
        component: () =>
          import("@/views/Dashboard/Fase/Perkawinan/SummaryPerkawinan.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "perkawinan/data-perkawinan",
        name: "Fase Perkawinan",
        component: () =>
          import("@/views/Dashboard/Fase/Perkawinan/Perkawinan.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "perkawinan/sedang-kawin",
        name: "Sedang Kawin",
        component: () =>
          import("@/views/Dashboard/Fase/Perkawinan/SedangKawin.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "perkawinan/langkah-kerja",
        name: "Langkah Kerja Perkawinan",
        component: () =>
          import("@/views/Dashboard/Fase/Perkawinan/LK_Perkawinan.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "kebuntingan",
        name: "Summary Kebuntingan",
        component: () =>
          import("@/views/Dashboard/Fase/Kebuntingan/Summarykebuntingan.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "kebuntingan/data-kebuntingan",
        name: "Fase Kebuntingan",
        component: () =>
          import("@/views/Dashboard/Fase/Kebuntingan/Kebuntingan.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "kebuntingan/sedang-bunting",
        name: "Sedang Bunting",
        component: () =>
          import("@/views/Dashboard/Fase/Kebuntingan/SedangBunting.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "kebuntingan/langkah-kerja",
        name: "Langkah Kerja Kebuntingan",
        component: () =>
          import("@/views/Dashboard/Fase/Kebuntingan/LK_Kebuntingan.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "kelahiran",
        name: "Summary Kelahiran",
        component: () =>
          import("@/views/Dashboard/Fase/Kelahiran/SummaryKelahiran.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "kelahiran/data-kelahiran",
        name: "Fase Kelahiran",
        component: () =>
          import("@/views/Dashboard/Fase/Kelahiran/Kelahiran.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "kelahiran/langkah-kerja",
        name: "Langkah Kerja Kelahiran",
        component: () =>
          import("@/views/Dashboard/Fase/Kelahiran/LK_Kelahiran.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "lepas-sapih",
        name: "Summary Lepas Sapih",
        component: () =>
          import("@/views/Dashboard/Fase/LepasSapih/SummaryLepasSapih.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "lepas-sapih/data-lepas-sapih",
        name: "Riwayat Lepas Sapih",
        component: () =>
          import("@/views/Dashboard/Fase/LepasSapih/LepasSapih.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "lepas-sapih/fase-lepas-sapih",
        name: "Fase Lepas Sapih",
        component: () =>
          import("@/views/Dashboard/Fase/LepasSapih/FaseLepasSapih.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "lepas-sapih/langkah-kerja",
        name: "Langkah Kerja Lepas Sapih",
        component: () =>
          import("@/views/Dashboard/Fase/LepasSapih/LK_LepasSapih.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "fattening",
        name: "Summary Fattening",
        component: () =>
          import("@/views/Dashboard/Fase/Fattening/SummaryFattening.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "fattening/data-fattening",
        name: "Fattening",
        component: () =>
          import("@/views/Dashboard/Fase/Fattening/Fattening.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/lembar-kerja",
    name: "Lembar Kerja",
    component: DashboardLayout,
    redirect: { name: "Home" },
    children: [
      {
        path: "pemeliharaan",
        name: "Lembar Kerja Pemeliharaan",
        component: () =>
          import("@/views/Dashboard/LembarKerja/Pemeliharaan.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "pemeliharaan/langkah-kerja",
        name: "Langkah Kerja Pemeliharaan",
        component: () =>
          import("@/views/Dashboard/LembarKerja/LangkahKerjaPemeliharaan.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "penanganan-penyakit",
        name: "Lembar Kerja Penanganan Penyakit",
        component: () =>
          import("@/views/Dashboard/LembarKerja/PenangananPenyakit.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "penanganan-penyakit/langkah-kerja",
        name: "Langkah Kerja Penanganan Penyakit",
        component: () =>
          import(
            "@/views/Dashboard/LembarKerja/LangkahKerjaPenangananPenyakit.vue"
          ),
        meta: { requiresAuth: true },
      },
      {
        path: "penanganan-penyakit/riwayat-sakit",
        name: "Riwayat Ternak Sakit",
        component: () =>
          import("@/views/Dashboard/LembarKerja/RiwayatSakit.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
];

export default dashboardRoutes;
