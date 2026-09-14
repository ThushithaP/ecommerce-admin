// // sidebar.config.ts
// export interface SidebarItem {
//   label: string;
//   icon: string;
//   route: string;
//   requiredPermission?: string;   // e.g. 'staff.view' — hide item if missing
// }

// export const SIDEBAR_ITEMS: SidebarItem[] = [
//   { label: 'Staff', icon: 'pi pi-users', route: '/staff', requiredPermission: 'staff.view' },
//   { label: 'Roles', icon: 'pi pi-shield', route: '/rbac/roles', requiredPermission: 'roles.view' },
//   { label: 'Orders', icon: 'pi pi-shopping-cart', route: '/orders', requiredPermission: 'orders.view' },
// ];

// sidebar.config.ts

export interface SidebarItem {
    label: string;
    icon: string;
    route: string;
    requiredPermission?: string;
}

export interface SidebarSection {
    label: string;
    items: SidebarItem[];
}

export const SIDEBAR_SECTIONS: SidebarSection[] = [
    {
        label: 'Overview',
        items: [
            {
                label: 'Dashboard',
                icon: 'pi pi-home',
                route: '/',
            },
        ],
    },

    {
        label: 'Organization',
        items: [
            {
                label: 'Branches',
                icon: 'pi pi-building',
                route: 'branch',
                // requiredPermission: 'branches.view',
            },
            {
                label: 'Warehouse',
                icon: 'pi pi-box',
                route: 'warehouse',
                // requiredPermission: 'branches.view',
            },
            {
                label: 'Staff',
                icon: 'pi pi-users',
                route: 'staff',
                // requiredPermission: 'staff.view',
            },
        ],
    },
    {
        label: 'Sales',
        items: [
            {
                label: 'Customers',
                icon: 'pi pi-users',
                route: 'sales/customer',
            },
            {
                label: 'Orders',
                icon: 'pi pi-shopping-cart',
                route: 'sales/order',
            },
            {
                label: 'Promotion',
                icon: 'pi pi-megaphone',
                route: 'sales/promotion',
            },
            {
                label: 'Coupons',
                icon: 'pi pi-ticket',
                route: 'sales/coupon',
            },
            {
                label: 'Shipping Method',
                icon: 'pi pi-truck',
                route: 'sales/shipping-method',
            },
            {
                label: 'Tax Class',
                icon: 'pi pi-truck',
                route: 'sales/tax-class',
            },
        ],
    },

    {
        label: 'Catalog',
        items: [
            {
                label: 'Products',
                icon: 'pi pi-box',
                route: 'product',
                // requiredPermission: 'products.view',
            },
            {
                label: 'Brands',
                icon: 'pi pi-tag',
                route: 'brand',
                // requiredPermission: 'brands.view',
            },
            {
                label: 'Categories',
                icon: 'pi pi-sitemap',
                route: 'category',
                // requiredPermission: 'categories.view',
            },
            {
                label: 'Category Paths',
                icon: 'pi pi-share-alt',
                route: 'category-path',
                // requiredPermission: 'category_paths.view',
            },
            {
                label: 'Attribute Groups',
                icon: 'pi pi-list',
                route: 'attribute-group',
                // requiredPermission: 'attribute_groups.view',
            },
            {
                label: 'Attribute Definitions',
                icon: 'pi pi-sliders-h',
                route: 'attribute-definition',
                // requiredPermission: 'attribute_definitions.view',
            },

            {
                label: 'Units',
                icon: 'pi pi-calculator',
                route: 'unit',
                // requiredPermission: 'units.view',
            },
        ],
    },
    {
        label: 'Procurement',
        items: [
            {
                label: 'Payment Term',
                icon: 'pi pi-credit-card',
                route: 'procurement/payment-term',
            },
            {
                label: 'Supplier',
                icon: 'pi pi-truck',
                route: 'procurement/supplier',
            },
            {
                label: 'Purchase Order',
                icon: 'pi pi-file-edit',
                route: 'procurement/purchase-order',
            },
            {
                label: 'Goods Receipt',
                icon: 'pi pi-inbox',
                route: 'procurement/goods-receipt',
            },
        ],
    },
    {
        label:'Inventory',
        items:[
            {
                label:'Inventory',
                icon:'pi pi-warehouse',
                route:'inventory/inventory'
            },
            {
                label:'Stock Adjustment',
                icon:'pi pi-sliders-v',
                route:'inventory/stock-adjustment'
            },
            {
                label:'Stock Transfer',
                icon:'pi pi-arrow-right-arrow-left',
                route:'inventory/stock-transfer'
            },
        ]
    },

    {
        label: 'RBAC',
        items: [
            {
                label: 'Roles',
                icon: 'pi pi-shield',
                route: 'rbac/roles',
                // requiredPermission: 'roles.view',
            },
            {
                label: 'Modules',
                icon: 'pi pi-th-large',
                route: 'rbac/modules',
                // requiredPermission: 'modules.view',
            },
            {
                label: 'Permissions',
                icon: 'pi pi-lock',
                route: 'rbac/permissions',
                // requiredPermission: 'permissions.view',
            },
        ],
    },
];