"use client";

import { useEffect } from "react";
import { getSiteTitle, getFavicon } from "@/lib/content-manager";

export function DynamicHead() {
  useEffect(() => {
    getSiteTitle().then((title) => {
      if (title) document.title = title;
    });
    getFavicon().then((url) => {
      if (url) {
        let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = url;
      }
    });
  }, []);
  return null;
}
