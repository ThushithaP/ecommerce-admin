export interface TableColumn<T = any> {
  key: keyof T | string;          // property to read from row, supports dot notation e.g. 'role.name'
  label: string;                   // header text
  sortable?: boolean;
  width?: string;                  // e.g. '120px', '20%'
  align?: 'left' | 'center' | 'right';
  // type?: 'text' | 'badge' | 'date' | 'boolean' | 'custom';
  type?: 'text' | 'image' | 'badge' | 'date' | 'boolean' | 'custom';
  badgeMap?: Record<string, string>;   // value -> css class, for 'badge' type
  imageUrl?: (value: any, row: T) => string | null;
  imageAlt?: (row: T) => string;
  formatter?: (value: any, row: T) => string;   // custom display transform
}

export interface TableAction<T = any> {
  label: string;
  icon?: string;
  tooltip?: string;
  color?: 'primary' | 'danger' | 'warn' | 'green'| 'default';
  handler: (row: T) => void;
  visible?: (row: T) => boolean;   // conditionally show action per row
}

export interface PageEvent {
  pageIndex: number;
  pageSize: number;
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc' | '';
}