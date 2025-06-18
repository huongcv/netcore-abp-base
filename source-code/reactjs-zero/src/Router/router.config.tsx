import {createBrowserRouter} from "react-router-dom";
import ProtectedRoute from "@ord-core/layout/ProtectedRoute";
import React, {lazy, Suspense} from "react";
import AuthLayout from "@ord-core/layout/AuthLayout";
import {authRoutes} from "./authRouter";
import {appRouters} from "./appRouters";
import AppSidebarLayout from "@ord-core/layout/AppSidebarLayout";
import NotFoundPage from "@ord-components/common/NotFoundPage";
import {RouteObject} from "react-router/dist/lib/context";
import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import DynamicRedirectWrapper from "./DynamicRedirectWrapper";
import {AdminRouter} from "@pages/Admin/AdminRouter";
import {DefaultAppPrefixUrl, DefaultHostPrefixUrl} from "@ord-core/AppConst";
import PrivacyPolicy from "@pages/Support/PrivacyPolicy";

const EMPTY_LAYOUT_PAGES = [...appRouters].filter(x => x.isEmptyLayout === true)
    .map(it => {
        return {
            index: it?.index,
            path: it.path,
            async lazy() {
                const Component = it.lazyComponent;
                return {
                    element:
                        <Suspense>
                            <ProtectedRoute permission={it?.permission}>
                                <Component/>
                            </ProtectedRoute>
                        </Suspense>

                };
            },
        }
    });

const mapRouter = (input: OrdRouterItem[]): RouteObject[] => {
    return input.filter(x => x.isEmptyLayout !== true)
        .map((it, index) => {
            return {
                index: it?.index,
                path: it.path,
                children: it.children && it.children.length > 0 ? mapRouter(it.children) : undefined,
                async lazy() {
                    const Component = it.lazyComponent;
                    return {
                        element:
                            <Suspense>
                                <ProtectedRoute permission={it?.permission}>
                                    <Component/>
                                </ProtectedRoute>
                            </Suspense>

                    };
                },
            } as RouteObject
        })
}
export const ROOT_ROUTER = createBrowserRouter([
    {
        path: "/",
        element: <DynamicRedirectWrapper/>,
        errorElement: <NotFoundPage/>,
    },
    {
        path: DefaultAppPrefixUrl,
        element: <ProtectedRoute>
            <AppSidebarLayout/>
        </ProtectedRoute>,
        children: mapRouter([...appRouters]),
        errorElement: <NotFoundPage/>,
    },
    {
        path: DefaultHostPrefixUrl,
        element: <ProtectedRoute>
            <AppSidebarLayout/>
        </ProtectedRoute>,
        children: mapRouter([...AdminRouter]),
        errorElement: <NotFoundPage/>,
    },

    ...EMPTY_LAYOUT_PAGES,
    {
        path: "/auth",
        element: <AuthLayout/>,
        children: [...authRoutes].map(it => {
            return {
                index: it?.index,
                path: it.path,
                async lazy() {
                    const Component = it.lazyComponent;
                    return {
                        element: <Suspense>
                            <Component/>
                        </Suspense>
                    };
                },
            }
        }),
        errorElement: <NotFoundPage/>,
    },
    {
        path: "/suport/privacy-policy",
        element: <PrivacyPolicy/>,
        errorElement: <NotFoundPage/>,
    },
]);
