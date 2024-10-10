"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface TableOfContents {
  text: string;
  id: string;
  depth: number;
}

interface TocProps {
  toc: TableOfContents[];
}

export function TableOfContents({ toc }: TocProps) {
  const itemIds = toc.map((item) => item.id);
  const activeHeading = useActiveItem(itemIds);

  if (toc.length === 0) {
    return null;
  }

  const filteredToc = toc.filter((item) => item.depth > 1 && item.depth < 4);

  return (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <ul className={cn("m-0 list-none")}>
        {filteredToc.map((item, index) => {
          return (
            <li key={index} className={cn("mt-0 pt-2")}>
              <a
                href={`#${item.id}`}
                className={cn(
                  item.depth == 2 ? "pl-0" : "",
                  item.depth == 3 ? "pl-4" : "",

                  "inline-block no-underline transition-colors hover:text-foreground",
                  item.id === `${activeHeading}`
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: `0% 0% -80% 0%` },
    );

    itemIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      itemIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [itemIds]);

  return activeId;
}
