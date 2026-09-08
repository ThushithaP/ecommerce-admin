export interface OptionStatus {
  value: string;
  name: string;
}

export interface Staffs {
  address: string;
  created_at: string;
  date_joined: string;
  dob: string;
  emp_no: string;
  email: string;
  phone: string;
  employment_status: string;
  gender: string;
  id: string;
  is_active: boolean;
  is_system_user: boolean;
  name: string;
  role: string;
  updated_at: string;
  user: string;
}

export interface StaffFormValues {
  name: string;
  emp_no: string;
  address: string;
  dob: Date | null;
  email: string;
  phone: string;
  gender: string;
  date_joined: Date | null;
  is_system_user: boolean;
  employment_status: string;
  is_active: boolean;
  role: string;
}

export interface CreateStaffDto {
  name: string;
  emp_no: string;
  address: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  date_joined: string;
  is_system_user: boolean;
  employment_status: string;
  is_active: boolean;
  role: string;
}

export type UpdateStaffDto = Partial<CreateStaffDto>;

export interface StaffListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  ordering?: string;
}