"use client";

import PreloaderWrapper from "./products/preloader";

export default function ShopLayout({ children }) {
  return <PreloaderWrapper>{children}</PreloaderWrapper>;
}