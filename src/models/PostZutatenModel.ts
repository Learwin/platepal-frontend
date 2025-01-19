import { PostEinheitModel } from "./PostEinheitModel";


export interface PostZutatenModel {
    id: number;
    menge: number;
    einheit: PostEinheitModel;
  }