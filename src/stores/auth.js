import { defineStore } from "pinia";
import * as s$auth from "@/services/auth";
import { login } from "@/services/auth";
import { setCk, delCk, certDetail } from "@/utils/cookies";

import d from "dayjs";

const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    id: undefined,
    name: undefined,
    role: undefined,
    status: undefined,
    id_peternakan: undefined,
    data: [],
  }),
  getters: {
    userInfo: (state) => ({
      id: state.id,
      name: state.name,
      role: state.role,
      status: state.status,
      id_peternakan: state.id_peternakan,
    }),
    isLoggedIn: (state) => !!state.id,
  },
  actions: {
    async a$setUserInfo() {
      try {
        const { id_user, role, nama_pengguna, status, id_peternakan } =
          certDetail();
        this.id = id_user;
        this.name = nama_pengguna;
        this.role = role;
        this.status = status;
        this.id_peternakan = id_peternakan;
        return "User Authenticated";
      } catch ({ message }) {
        this.id = "";
        this.name = "";
        this.role = "";
        this.status = "";
        this.id_peternakan = "";
        throw message;
      }
    },

    async a$login(payload) {
      try {
        const { data } = await login(payload);
        setCk("CERT", data.token, { datetime: d(data.expiresAt) });
        this.a$setUserInfo();

        if (this.userInfo.role == "superadmin") {
          return "Login Superadmin Berhasil!";
        }

        return "Login Berhasil!";
      } catch ({ error, message }) {
        throw (error || message) ?? "Login Gagal!";
      }
    },
    async a$logout() {
      try {
        const { id, role, username } = certDetail();
        if (id || role || username) delCk("CERT");
        this.a$setUserInfo();
        return "Logout Berhasil!";
      } catch ({ error, message }) {
        throw (error || message) ?? "Logout Gagal!";
      }
    },

    async a$register(request) {
      try {
        await s$auth.register(request);
        return "Register Berhasil!";
      } catch ({ error, message }) {
        throw (error || message) ?? "Register Gagal!";
      }
    },

    async a$forgotPassword(request) {
      try {
        await s$auth.forgotPassword(request);
        return "Password baru dikirim ke email anda!";
      } catch ({ error, message }) {
        throw (error || message) ?? "Gagal melakukan reset password!";
      }
    },
  },
});

export default useAuthStore;
