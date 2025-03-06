import { RegionList, ZipcodeInfo } from "@/types";
import { axiosApi } from "../api";

export const utilsApi = {
  async getRegions(): Promise<RegionList> {
    return axiosApi
      .get<RegionList>("/directory/countries")
      .then((response) => response.data);
  },

  async consultZipcode(zipCode: string): Promise<ZipcodeInfo> {
    return axiosApi
      .get<ZipcodeInfo>(`/consultaCep/${zipCode}`)
      .then((response) => response.data);
  },
};
