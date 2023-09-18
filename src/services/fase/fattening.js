// frontend/service/fattening.js
import { baseApi } from "@/services/api";
import { subApiUrl } from "@/utils/constant";

const { api } = subApiUrl;

//list new fattening (??)
const listMainTernak = () => baseApi.get(`${api}/fattening/main_ternak`); 
const create = (req) => baseApi.post(`${api}/fattening/main_ternak`, req);
const edit = (req) => baseApi.put(`${api}/fattening/main_ternak`, req); 
const remove = (req) => baseApi.delete(`${api}/fattening/main_ternak`, req);

//Summary Fattening (??)
const listTernak = () => baseApi.get(`${api}/fattening/ternak`);

export { listTernak, listMainTernak, create, edit, remove };
