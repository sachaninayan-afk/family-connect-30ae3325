export const KARYAKAR_LIST = [
  "Anav Moradiya",
  "Bhavik Sachani",
  "Daksh Parmar",
  "Dharam Saliya",
  "Harsh Makwana",
  "Harsh Sondigadla",
  "Kavya Sondigadla",
  "Maharshi Bhadani",
  "Malav Jiyani",
  "Mayur Bhavsar",
  "Mayur Makwana",
  "Nayan Sachani",
  "Neel Kalathiya",
  "Om Vadher",
  "Prince Mangukiya",
  "Sagar Vaja",
  "Umang Oza",
  "Uttam Davra",
  "Yash Vaja",
] as const;

// June 4 - June 30, 2026
export const VISIT_DATES: string[] = Array.from({ length: 30 - 4 + 1 }, (_, i) => {
  const day = String(4 + i).padStart(2, "0");
  return `2026-06-${day}`;
});

export const CATEGORIES = ["Satsangi", "Non-Satsangi"] as const;

export interface FamilyVisit {
  id: string;
  karyakar_names: string[];
  date_of_visit: string;
  surname: string;
  family_head_name: string;
  total_males: number;
  total_females: number;
  total_kids: number;
  kid1_name: string | null;
  kid1_std: string | null;
  kids_mother_mobile: string | null;
  kid2_name: string | null;
  kid2_std: string | null;
  kid3_name: string | null;
  kid3_std: string | null;
  family_head_mobile: string;
  category: string;
  home_address: string | null;
  created_at: string;
  updated_at: string;
}

export type FamilyVisitInput = Omit<FamilyVisit, "id" | "created_at" | "updated_at">;
