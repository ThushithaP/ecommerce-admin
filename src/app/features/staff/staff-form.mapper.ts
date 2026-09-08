import { CreateStaffDto, StaffFormValues, Staffs } from './dto';
import { formatedDate } from '@shared/utills';

export function staffToFormValue(record: Staffs): StaffFormValues {
  return {
    ...record,
    dob: new Date(record.dob),
    date_joined: new Date(record.date_joined),
  };
}

export function staffFormValueToCreateDto(
  value: StaffFormValues
): CreateStaffDto {
  return {
    ...value,
    dob: formatedDate(value.dob),
    date_joined: formatedDate(value.date_joined),
  };
}