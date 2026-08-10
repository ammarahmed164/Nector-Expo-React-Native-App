export type Zone = { id: string; name: string; areas: string[] };

export const locationZones: Zone[] = [
  {
    id: "karachi",
    name: "Karachi",
    areas: ["Clifton", "DHA", "Gulshan-e-Iqbal", "North Nazimabad", "Saddar", "Malir"],
  },
  {
    id: "lahore",
    name: "Lahore",
    areas: ["Gulberg", "DHA", "Model Town", "Johar Town", "Cantt", "Allama Iqbal Town"],
  },
  {
    id: "islamabad",
    name: "Islamabad",
    areas: ["F-6", "F-7", "G-10", "Blue Area", "Bahria Town", "Rawalpindi Saddar"],
  },
  {
    id: "rawalpindi",
    name: "Rawalpindi",
    areas: ["Saddar", "Bahria Town", "Satellite Town", "Chaklala"],
  },
  {
    id: "faisalabad",
    name: "Faisalabad",
    areas: ["D Ground", "Peoples Colony", "Madina Town"],
  },
];

export function getZoneById(id: string) {
  return locationZones.find((z) => z.id === id);
}
