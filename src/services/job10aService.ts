import { job10aClient } from "@/api/job10aClient";
import type { ApiResponse } from "@/services/api";

export type CheckRirekiStatusResponseDto = {
  rirekiType: number;
  currentSyorikiDensiTyouboHozonUsage: number;
  isCurrentKaisyaDensiTyouboHozonUsage: boolean;
};

export const checkRirekiStatus = async (kesn: number) => {
  const response = await job10aClient.get<
    ApiResponse<CheckRirekiStatusResponseDto>
  >("/api/History/checkRirekiStatus", {
    params: {
      Kesn: kesn,
    },
  });

  return response.data.data;
};

export type GetOptionRequest = {
  userCode: string;
  programId: string;
};

export type GetOptionResponseDto = {
  userCode: number;
  selectOption: number;
  date: number;
  time: number;
  add: number;
  upd: number;
  del: number;
};

export const getOption = async (payload: GetOptionRequest) => {
  const response = await job10aClient.get<ApiResponse<GetOptionResponseDto>>(
    "/api/RiOpt/getOption",
    {
      params: {
        userCode: payload.userCode,
        programId: payload.programId,
      },
    },
  );

  return response.data.data;
};

export type GetUprkiResponseDto = {
  no: number;
  processDateTime: string;
  processType: string;
  processContent: string;
  processUser: string;
  rmod: number;
  rtim: number;
};
export const getUprki = async (kesn: number) => {
  const response = await job10aClient.get<ApiResponse<GetUprkiResponseDto[]>>(
    "/api/RiOpt/getUprki",
    {
      params: {
        kesn: kesn,
      },
    },
  );

  return response.data.data;
};

export type SaveOptionRequest = {
  userCode: string;
  programId: string;
  selectOption: number;
  date: string;
  time: string;
  add: number;
  upd: number;
  del: number;
  kesn: number;
};

export type SaveOptionResponse = {
  userCode: string;
  programId: string;
  selectOption: number;
  date: number;
  time: number;
  add: number;
  upd: number;
  del: number;
};

export const saveOption = async (payload: SaveOptionRequest) => {
  const response = await job10aClient.post<ApiResponse<SaveOptionResponse>>(
    "/api/RiOpt/saveOption",
    payload,
  );
  return response.data.data;
};

export type LatestKmrkiDisplayRequest = {
  userCode: string;
  selectOption: number;
  date: string;
  time: string;
  add: number;
  upd: number;
  del: number;
  kesn: number;
  kicd: string;
};

export type LatestKmrkiDisplayResponse = {
  kesn: number;
  kicd: string;
  kcod: string;
  knmx: string;
  knld: string;
  rkbn: number;
  div: string;
}[];

export const latestKmrkiDisplay = async (
  payload: LatestKmrkiDisplayRequest,
) => {
  const response = await job10aClient.post<
    ApiResponse<LatestKmrkiDisplayResponse>
  >("/api/History/latestKmrkiDisplay", payload);

  return response.data.data;
};

export type GetNamesRequest = {
  kesn: number;
  kicd: string;
};

export type GetNamesResponse = {
  kesn: number;
  kcod: string;
  knmx: string;
  knam: string;
  kicd: string;
  lmod: number;
  fmod: number;
  ltim: number;
  ftim: number;
  case: string;
}[];

export const getNames = async (payload: GetNamesRequest) => {
  const response = await job10aClient.get<ApiResponse<GetNamesResponse>>(
    "/api/History/names",
    {
      params: {
        kesn: payload.kesn,
        kicd: payload.kicd,
      },
    },
  );

  return response.data.data;
};

export const getDetailHistory = async (payload: LatestKmrkiDisplayRequest) => {
  const response = await job10aClient.post<ApiResponse<GetNamesResponse>>(
    "/api/history/getDetailHistory",
    payload,
  );

  return response.data.data;
};

export type SyorikiListResponse = {
  ccod: string;
  kesn: number;
  label: string;
  syorikikanLabel: string;
}[];

export const getSyorikiList = async () => {
  const response = await job10aClient.get<ApiResponse<SyorikiListResponse>>(
    "/api/History/getSyorikiList",
  );

  return response.data.data;
};
