import HeartLoader from "../navigation/heart-loader";

export default function LoadingPage() {
  return (
    <div className="bg-muted fixed top-0 left-0 z-[998] h-dvh w-dvw">
      <HeartLoader
        variant="pulse"
        className="fixed top-1/2 left-1/2 z-[999] w-24 -translate-x-1/2 -translate-y-1/2 transform"
      />
    </div>
  );
}
