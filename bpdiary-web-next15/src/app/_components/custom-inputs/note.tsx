import React, { useState, useLayoutEffect, useRef } from "react";
import { cn } from "~/lib/utils";

const useTruncatedElement = ({
  ref,
}: {
  ref: React.RefObject<HTMLParagraphElement | null>;
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [isShowingMore, setIsShowingMore] = useState(false);

  useLayoutEffect(() => {
    const { offsetHeight, scrollHeight } = ref.current ?? {};

    if (offsetHeight && scrollHeight && offsetHeight < scrollHeight) {
      setIsTruncated(true);
    } else {
      setIsTruncated(false);
    }
  }, [ref]);

  const toggleIsShowingMore = () => setIsShowingMore((prev) => !prev);

  return {
    isTruncated,
    isShowingMore,
    toggleIsShowingMore,
  };
};

export default function Note({
  note,
  className,
}: {
  note?: string | null;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { isTruncated, isShowingMore, toggleIsShowingMore } =
    useTruncatedElement({
      ref,
    });
  return (
    <div>
      <div
        ref={ref}
        className={cn(
          !isShowingMore && "line-clamp-1",
          note ? "" : "h-5",
          className,
        )}
      >
        {note}
      </div>
      {false && isTruncated && (
        <button onClick={toggleIsShowingMore}>
          {isShowingMore ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
