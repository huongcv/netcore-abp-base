import {lazy} from 'react';
import {OrdRouterItem} from "@ord-core/model/ordRouter.model";

export const authRoutes: OrdRouterItem[] = [
    {
        path: 'login',
        lazyComponent: lazy(() => import('@pages/Auth/Login')),
    },
    {
        path: 'forgot-password',
        lazyComponent: lazy(() => import('@pages/Auth/ForgotPassword')),
    },
    {
        path: 'reset-password/:id',
        lazyComponent: lazy(() => import('@pages/Auth/ResetPassword')),
    }
];
