import { baseApi } from "@/services/api";
import { subApiUrl } from "@/utils/constant";

const { api } = subApiUrl;

// Pembukuan
const add = (req) => baseApi.post(`${api}/pembukuan-pakan/`, req);
const edit = (req) => baseApi.put(`${api}/pembukuan-pakan/`, req);
const del = (req) => baseApi.delete(`${api}/pembukuan-pakan/`, { data: req });

// Detail Pembukuan
const listPembukuanPakan = (req) =>
  baseApi.get(`${api}/pembukuan-pakan?id_pembukuan_pakan=${req}`);
const tambahPembukuanPakan = (req) => baseApi.post(`${api}/pembukuan-pakan`, req);

export {
  add,
  edit,
  del,
  listPembukuanPakan,
  tambahPembukuanPakan
};
