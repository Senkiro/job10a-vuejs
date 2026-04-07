import { job10aClient } from "@/api/job10aClient";

export type GetNamesPayload = {
  Kesn: number;
  Kicd: string;
};

export const getNames = (payload: GetNamesPayload) => {
  return job10aClient.get("/api/History/names", {
    params: {
      Kesn: payload.Kesn,
      Kicd: payload.Kicd,
    },
  });
};

export type LatestKmrkiDisplayRequestDto = {
  UserCode: string;
  SelectOption: number;
  Date: number;
  Time: number;
  Add: number;
  Upd: number;
  Del: number;
  Kesn: number;
  Kicd: string;
};

export const latestKmrkiDisplayAsync = (
  payload: LatestKmrkiDisplayRequestDto,
) => {
  return job10aClient.post("/api/History/latestKmrkiDisplay", payload);
};

export const checkRirekiStatus = (kesn: number) => {
  return job10aClient.get("/api/History/checkRirekiStatus", {
    params: {
      Kesn: kesn,
    },
  });
};
