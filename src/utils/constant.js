// const host = import.meta.env.VITE_BASE_API_URL;
// const host = "http://localhost:51009";
const host = "http://be.gembala.sembadafarm.com";
// const host = "http://be-breeding.sinergifarm.id/";


const baseApiUrl = `${host}/`;

const subApiUrl = {
  // Base
  auth: "auth",
  api: "api",
  // Sub Sub URL
  pakan: "pakan",
  kawin: "kawin",
  kandang: "kandang",
  kesehatan: "kesehatan",
  penyakit: "penyakit",
  ternak: "ternak",
  costumer: "costumer",
  total: "total",
  timbangan: "timbangan",
};

export { host, baseApiUrl, subApiUrl };
