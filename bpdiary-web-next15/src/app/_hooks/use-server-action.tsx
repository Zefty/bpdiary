import { useEffect, useRef, useState, useTransition } from "react";

export const useServerAction = <P extends unknown[], R>(
  action: (...args: P) => Promise<R>,
  onFinished?: (_: R | undefined) => void,
): [(...args: P) => Promise<R | undefined>, boolean] => {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<R>();
  const [finished, setFinished] = useState(false);
  const resolver = useRef<(value?: R | PromiseLike<R>) => void>(() => {
    // No operation (this is intentional)
  });
  const onFinishRef = useRef(onFinished);

  useEffect(() => {
    if (!finished) return;
    if (onFinishRef.current) onFinishRef.current(result);
    resolver.current?.(result);
  }, [result, finished]);

  const runAction = async (...args: P): Promise<R | undefined> => {
    startTransition(() => {
      action(...args)
        .then((data) => {
          setResult(data);
          setFinished(true);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  };

  return [runAction, isPending];
};
