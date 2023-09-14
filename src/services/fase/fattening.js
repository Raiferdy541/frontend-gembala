import { baseApi } from "@/services/api";
import { subApiUrl } from "@/utils/constant";

const { api } = subApiUrl;

const list = () => baseApi.get(`${api}/main_ternak`);

// Summary
// const listKebuntingan = () => baseApi.get(`${api}/kebuntingan/all-ternak`);


// const sedangBunting = () => baseApi.get(`${api}/kebuntingan/ternak`);
// const setAbortus = (req) => baseApi.post(`${api}/kebuntingan/set-abortus`, req);

export { list };
