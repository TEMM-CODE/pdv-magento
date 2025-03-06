import { RegionList } from "@/types";
import { axiosApi } from "../api";

export const utilsApi = {
  async getRegions(): Promise<RegionList> {
    return axiosApi
      .get<RegionList>("/directory/countries")
      .then((response) => response.data);
  },
};
