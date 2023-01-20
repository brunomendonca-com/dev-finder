export default interface User {
  id: number;
  github: string;
  location: {
    latitude: number;
    longitude: number;
  };
}
