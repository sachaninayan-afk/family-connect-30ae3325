export type Category = "Satsangi" | "Non-Satsangi";

export interface FamilyRecord {
  id: string;
  date_of_visit: string;
  karyakar_name: string;
  family_number: string;
  child_name: string;
  father_name: string | null;
  mother_name: string | null;
  surname: string | null;
  standard: string | null;
  date_of_birth: string | null;
  school_name: string | null;
  home_address: string | null;
  father_mobile: string | null;
  mother_mobile: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}

export type FamilyInput = Omit<FamilyRecord, "id" | "created_at" | "updated_at">;
