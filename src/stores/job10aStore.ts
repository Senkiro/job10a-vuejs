import { defineStore } from "pinia";

type Job10aState = {
  initialized: boolean;
  workingKesn: string | null;
  periodLabel: string;    
  rirekiType: number;
  currentSyorikiDensiTyouboHozonUsage: number;
  isCurrentKaisyaDensiTyouboHozonUsage: boolean;
};

export const useJob10aStore = defineStore("job10a", {
  state: (): Job10aState => ({
    initialized: false,
    workingKesn: null,
    periodLabel: "",
    rirekiType: 0,
    currentSyorikiDensiTyouboHozonUsage: 0,
    isCurrentKaisyaDensiTyouboHozonUsage: false,
  }),

  actions: {
    initFromAuth(payload: { kesn: string | null; periodLabel: string | null }) {
      this.workingKesn = payload.kesn;
      this.periodLabel = payload.periodLabel ?? "";
      this.initialized = true;
    },

    setProcessingPeriod(kesn: string, label: string) {
      this.workingKesn = kesn;
      this.periodLabel = label;
    },

    saveStatus(status: {
      rirekiType: number;
      currentSyorikiDensiTyouboHozonUsage: number;
      isCurrentKaisyaDensiTyouboHozonUsage: boolean;
    }) {
      this.rirekiType = status.rirekiType;
      this.currentSyorikiDensiTyouboHozonUsage =
        status.currentSyorikiDensiTyouboHozonUsage;
      this.isCurrentKaisyaDensiTyouboHozonUsage =
        status.isCurrentKaisyaDensiTyouboHozonUsage;
    },

    resetScreenState() {
      this.initialized = false;
      this.workingKesn = null;
      this.periodLabel = "";
      this.rirekiType = 0;
      this.currentSyorikiDensiTyouboHozonUsage = 0;
      this.isCurrentKaisyaDensiTyouboHozonUsage = false;
    },
  },

  persist: {
    storage: localStorage,
    pick: [
      "workingKesn",
      "periodLabel",
      "rirekiType",
      "currentSyorikiDensiTyouboHozonUsage",
      "isCurrentKaisyaDensiTyouboHozonUsage",
    ],
  },
});
