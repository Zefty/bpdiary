import { type ReactNode } from "react";
import "../../../styles/heart-loaders.css";

const Switch = ({
  children,
  value,
  className,
}: {
  children: ReactNode;
  value: boolean | string | number;
  className?: string;
}) => {
  if (Array.isArray(children)) {
    return (
      <div className={className}>
        {children.find((child: React.ReactElement) => {
          const props = child.props as {
            "data-value": boolean | string | number;
          };
          return props["data-value"] === value;
        })}
      </div>
    );
  }
};

export default function HeartLoader({
  className,
  variant,
}: {
  className?: string;
  variant: "beat" | "fill" | "pulse";
}) {
  return (
    <Switch value={variant} className={className}>
      <div data-value="beat" className="beater"></div>
      <div data-value="fill" className="heartFill"></div>
      <div data-value="pulse" className="pulse">
        <svg viewBox="0 0 64 48" preserveAspectRatio="xMidYMid meet">
          <polyline
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
            id="back"
          ></polyline>
          <polyline
            points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
            id="front"
          ></polyline>
        </svg>
      </div>
    </Switch>
  );
}
