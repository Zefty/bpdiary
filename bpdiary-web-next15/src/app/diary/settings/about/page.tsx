export default function AboutAndSupport() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-medium">About & Support</h3>
        <p className="text-muted-foreground text-sm">
          Reach out to us for any questions or feedback.
        </p>
      </div>
      <p className="w-[50rem]">
        This is a simple and user-friendly hobby project designed to help you
        keep tabs on your blood pressure without the hassle.
        <br />
        <br />
        Whether you're monitoring for health reasons or just staying informed,
        this tool makes it easy to record your readings, view trends, and gain
        insights into your cardiovascular health.
        <br />
        <br />
        Stay on top of your wellness with effortless tracking and keep things in
        check!
        <br />
        <br />
        If you have any questions, feedback, or suggestions, please feel free to
        email us at{" "}
        <a
          href="mailto:bp.diary.hello@gmail.com"
          className="text-blue-600 underline hover:text-blue-800"
        >
          bp.diary.hello@gmail.com
        </a>
      </p>
    </div>
  );
}
