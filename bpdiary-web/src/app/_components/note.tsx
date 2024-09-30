import React, { useState, useLayoutEffect, useRef } from "react";

const useTruncatedElement = ({
  ref,
}: {
  ref: React.RefObject<HTMLParagraphElement>;
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [isShowingMore, setIsShowingMore] = useState(false);

  useLayoutEffect(() => {
    const { offsetHeight, scrollHeight } = ref.current || {};

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

export default function Note({ note }: { note?: string | null }) {
  const ref = useRef(null);
  const { isTruncated, isShowingMore, toggleIsShowingMore } =
    useTruncatedElement({
      ref,
    });

  return (
    <div>
      <p ref={ref} className={`${!isShowingMore && "line-clamp-1"}`}>
        {note}
      </p>
      {isTruncated && (
        <button onClick={toggleIsShowingMore}>
          {isShowingMore ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
