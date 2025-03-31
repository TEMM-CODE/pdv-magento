import { RegionList, postcodeInfo } from "@/types";
import { axiosApi } from "../api";

export const utilsApi = {
  async getRegions(): Promise<RegionList> {
    return axiosApi
      .get<RegionList>("/directory/countries")
      .then((response) => response.data);
  },

  async consultPostcode(postcode: string): Promise<postcodeInfo> {
    return axiosApi
      .get<postcodeInfo>(`/consultaCep/${postcode}`)
      .then((response) => response.data);
  },
};
