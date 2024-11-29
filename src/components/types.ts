// need this for unified Incident type

export interface Incident {
    id: number; //To ensure that the respective marker popups become visible when more info is clicked
    location: string; //This is the actual location from the geocoding API
    type: string;
    timeReported: string;
    status: string;
    latlng: [number, number];
    reportedBy?: string;
    phoneNumber?: string;
    comments?: string;
    image?: string;
}

// This class is required because Map is a conflicting keyword in App.tsx due to importing Map from Map.tsx
export class Dict {
    map: Map<Number, L.Marker>;
  
    constructor() {
      this.map = new Map<Number, L.Marker>();
    }
};