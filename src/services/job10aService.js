import {} from "@/api/clients/job60Client";

export const getProcessingMonths = (
  kesn,
  isUserOrganizingMonthSetting,
  token,
) => {
  return VITE_JOB10A_API_URL.get("/api/Syzdsp/processing-months", {
    params: { kesn, isUserOrganizingMonthSetting },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
