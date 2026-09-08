import { Routes } from '@angular/router';
import { Signin } from './features/auth/signin/signin';
import { Signup } from './features/auth/signup/signup';
import { Dashboard } from './features/dashboard/dashboard';
import { MainLayout } from './core/layouts/main-layout/main-layout';
import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { Roles } from './features/rbac/roles/roles';
import { Modules } from './features/rbac/modules/modules';
import { Permissions } from './features/rbac/permissions/permissions';
import { RolesPermissions } from '@features/rbac/roles-permissions/roles-permissions';
import { permissionGuard } from '@core/guard/permission-guard';
import { guestGuard } from '@core/guard/guest-guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'signin'
    },
    {
        path: '', component: AuthLayout, canActivate: [guestGuard],
        children: [
            {
                path: 'signin', component: Signin,
                // canActivate: [guestGuard]
            },
            // {
            //     path: 'signup', component: Signup
            // }
        ]
    },

    {
        path: 'admin', component: MainLayout,
        children: [
            {
                path: 'dashboard', component: Dashboard
            },
            {
                path: 'rbac',
                children: [
                    {
                        path: 'roles', component: Roles,
                    },
                    {
                        path: 'modules', component: Modules,
                    },
                    {
                        path: 'permissions', component: Permissions,
                    },
                    {
                        path: 'roles-permissions/:id', component: RolesPermissions,
                    }

                ]
            },

            {
                path: 'staff',
                loadComponent: () => import('@features/staff/staff').then(m => m.Staff),
                // canActivate: [permissionGuard],
                // data: { permission: 'staff.view' }
            },
            {
                path: 'category',
                loadComponent: () => import('@features/catalog/category/category').then(m => m.Category),
                // canActivate:[permissionGuard],
                // data:{permission:'staff.view'}
            },
            {
                path: 'category-path',
                loadComponent: () => import('@features/catalog/category-path/category-path').then(m => m.CategoryPath),
                // canActivate:[permissionGuard],
                // data:{permission:'staff.view'}
            },
            {
                path: 'category-attribute/:id',
                loadComponent: () => import('@features/catalog/category-attribute/category-attribute').then(m => m.CategoryAttribute),
                // canActivate:[permissionGuard],
                // data:{permission:'staff.view'}
            },
            {
                path: 'brand',
                loadComponent: () => import('@features/catalog/brand/brand').then(m => m.Brand),
                // canActivate:[permissionGuard],
                // data:{permission:'staff.view'}
            },
            {
                path: 'attribute-group',
                loadComponent: () => import('@features/catalog/attribute-group/attribute-group').then(m => m.AttributeGroup),
                // canActivate:[permissionGuard],
                // data:{permission:'staff.view'}
            },
            {
                path: 'unit',
                loadComponent: () => import('@features/units/unit').then(m => m.Unit),
                // canActivate:[permissionGuard],
                // data:{permission:'staff.view'}
            },
            {
                path: 'attribute-definition',
                loadComponent: () => import('@features/catalog/attribute-definition/attribute-definition').then(m => m.AttributeDefinition),
                // canActivate:[permissionGuard],
                // data:{permission:'staff.view'}
            },
            {
                path: 'attribute-option/:id',
                loadComponent: () => import('@features/catalog/attribute-option/attribute-option').then(m => m.AttributeOption),
                // canActivate:[permissionGuard],
                // data:{permission:'staff.view'}
            },
            {
                path: 'product',
                loadComponent: () => import('@features/catalog/product/product').then(m => m.Product),
                // canActivate:[permissionGuard],
                // data:{permission:'staff.view'}
            },
            {
                path: 'product/manage/:action',
                loadComponent: () => import('@features/catalog/product/pages/manage/manage').then(m => m.Manage),
                // canActivate:[permissionGuard],
                // data:{permission:'staff.view'}
            },
            {
                path: 'product/manage/:action/:id',
                loadComponent: () => import('@features/catalog/product/pages/manage/manage').then(m => m.Manage),
                // canActivate:[permissionGuard],
                // data:{permission:'staff.view'}
            },
            {
                path: 'branch',
                loadComponent: () => import('@features/branch/branch').then(m => m.Branch),
                // canActivate:[permissionGuard],
                // data:{permission:'staff.view'}
            },
            {
                path: 'warehouse',
                loadComponent: () => import('@features/warehouse/warehouse').then(m => m.Warehouse),
                // canActivate:[permissionGuard],
                // data:{permission:'staff.view'}
            },

            {
                path: 'procurement',
                children: [
                    {
                        path: 'payment-term',
                        loadComponent: () => import('@features/procurement/payment-term/payment-term').then(m => m.PaymentTerm)
                    },
                    {
                        path: 'supplier',
                        loadComponent: () => import('@features/procurement/supplier/supplier').then(m => m.Supplier)
                    },
                    {
                        path: 'supplier/manage/:action',
                        loadComponent: () => import('@features/procurement/supplier/pages/manage/manage').then(m => m.Manage),
                        // canActivate:[permissionGuard],
                        // data:{permission:'staff.view'}
                    },
                    {
                        path: 'supplier/manage/:action/:id',
                        loadComponent: () => import('@features/procurement/supplier/pages/manage/manage').then(m => m.Manage),
                        // canActivate:[permissionGuard],
                        // data:{permission:'staff.view'}
                    },
                    {
                        path: 'purchase-order',
                        loadComponent: () => import('@features/procurement/purchase-order/purchase-order').then(m => m.PurchaseOrder)
                    },
                    {
                        path: 'purchase-order/manage/:action',
                        loadComponent: () => import('@features/procurement/purchase-order/pages/manage/manage').then(m => m.Manage),
                        // canActivate:[permissionGuard],
                        // data:{permission:'staff.view'}
                    },
                    {
                        path: 'purchase-order/manage/:action/:id',
                        loadComponent: () => import('@features/procurement/purchase-order/pages/manage/manage').then(m => m.Manage),
                        // canActivate:[permissionGuard],
                        // data:{permission:'staff.view'}
                    },
                    {
                        path: 'goods-receipt',
                        loadComponent: () => import('@features/procurement/goods-receipt/goods-receipt').then(m => m.GoodsReceipt)
                    },
                    {
                        path: 'goods-receipt/manage/create',
                        loadComponent: () => import('@features/procurement/goods-receipt/pages/manage/manage').then(m => m.Manage),
                        // canActivate:[permissionGuard],
                        // data:{permission:'staff.view'}
                    },
                    {
                        path: 'goods-receipt/manage/view/:id',
                        loadComponent: () => import('@features/procurement/goods-receipt/pages/manage/manage').then(m => m.Manage),
                        // canActivate:[permissionGuard],
                        // data:{permission:'staff.view'}
                    },
                ]
            },
            {
                path:'sales',
                children: [
                    {
                        path: 'customer',
                        loadComponent: () => import('@features/sales/customer/customer').then(m => m.Customer),
                    },
                    {
                        path: 'shipping-method',
                        loadComponent: () => import('@features/sales/shipping-method/shipping-method').then(m => m.ShippingMethod),
                    },
                    {
                        path: 'order',
                        loadComponent: () => import('@features/sales/order/order').then(m => m.Order),
                    },
                    {
                        path: 'order/view/:id',
                        loadComponent: () => import('@features/sales/order/pages/view/view').then(m => m.View),
                    },
                    {
                        path: 'promotion',
                        loadComponent: () => import('@features/sales/promotion/promotion').then(m => m.Promotion),
                    },
                    {
                        path: 'promotion/:action/:id',
                        loadComponent: () => import('@features/sales/promotion/pages/manage/manage').then(m => m.Manage),
                    },
                    {
                        path: 'coupon',
                        loadComponent: () => import('@features/sales/coupon/coupon').then(m => m.Coupon),
                    },
                ]
            },
            {
                path: 'inventory',
                children: [
                    {
                        path: 'inventory',
                        loadComponent: () => import('@features/inventory/inventory/inventory').then(m => m.Inventory)
                    },
                    {
                        path: 'inventory/manage/:action',
                        loadComponent: () => import('@features/inventory/inventory/pages/manage/manage').then(m => m.Manage),
                        // canActivate:[permissionGuard],
                        // data:{permission:'staff.view'}
                    },
                    {
                        path: 'inventory/manage/:action/:id',
                        loadComponent: () => import('@features/inventory/inventory/pages/manage/manage').then(m => m.Manage),
                        // canActivate:[permissionGuard],
                        // data:{permission:'staff.view'}
                    },
                    {
                        path: 'stock-adjustment',
                        loadComponent: () => import('@features/inventory/stock-adjustment/stock-adjustment').then(m => m.StockAdjustment),
                        // canActivate:[permissionGuard],
                        // data:{permission:'staff.view'}
                    },
                    {
                        path: 'stock-transfer',
                        loadComponent: () => import('@features/inventory/stock-transfer/stock-transfer').then(m => m.StockTransfer),
                        // canActivate:[permissionGuard],
                        // data:{permission:'staff.view'}
                    },
                ]
            },
            {
                path: 'report',
                loadComponent: () => import('@features/report/report').then(m => m.Report),
            },
        ]
    },

];
