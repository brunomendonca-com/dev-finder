import { LatLng } from "react-native-maps";

export default interface User {
  id: number;
  github: string;
  location: LatLng;
}
