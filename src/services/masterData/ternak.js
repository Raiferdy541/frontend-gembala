import { baseApi } from "@/services/api";
import { subApiUrl } from "@/utils/constant";

const { api, ternak } = subApiUrl;

const list = (req) => baseApi.get(`${api}/${ternak}/byUserId/${req}`);
const add = (req) => baseApi.post(`${api}/${ternak}`, req, { headers: { "Content-Type": "multipart/form-data" } });
const edit = (req) => baseApi.put(`${api}/${ternak}/${req.id}`, req);
const del = (req) => baseApi.delete(`${api}/${ternak}/${req}`);

// Dropdown
const listVarietas = () => baseApi.get(`${api}/${ternak}/varietas`);
const listFase = () => baseApi.get(`${api}/${ternak}/fase`);

// Jumlah Ternak
const listBetina = (req) => baseApi.get(`${api}/${ternak}/listbetina/${req}`);

// Detail
const detailKandang = (req) => baseApi.get(`${api}/${ternak}/listbykandang/${req}`);
const detailPakan = (req) => baseApi.get(`${api}/${ternak}/listternakpakan/${req}`);

// Dashboard
const detailTernak = (req) => baseApi.get(`${api}/${ternak}/users/${req.id}`);
const totalSehat = (req) => baseApi.get(`${api}/${ternak}/totalsehat/${req}`);
const totalJeniskelamin = (req) => baseApi.get(`${api}/${ternak}/totaljeniskelamin/${req}`);
const populasi = (req) => baseApi.get(`${api}/${ternak}/total/${req}`);
const totalFase = (req) => baseApi.get(`${api}/${ternak}/totalfase/${req}`);

export { listBetina, list, add, edit, del, listVarietas, listFase, detailKandang, detailPakan, detailTernak, totalSehat, totalJeniskelamin, populasi, totalFase };
