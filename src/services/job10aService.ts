import { job10aClient } from "@/api/job10aClient";

export type GetNamesPayload = {
  kesn: number;
  kicd: string;
};

export const getNames = (payload: GetNamesPayload) => {
  return job10aClient.get("api/History/names", {
    params: {
      Kesn: payload.kesn,
      Kicd: payload.kicd,
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
  return job10aClient.post("/api/history/latestKmrkiDisplay", payload);
};
