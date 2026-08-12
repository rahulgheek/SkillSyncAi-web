import GradualBlur from "@/components/ui/react-bits/GradualBlur";

/** Fixed vignette blur pinned to the viewport bottom, sits above all sections. */
export function BottomBlurOverlay() {
  return (
    <div className="fixed bottom-0 left-0 w-full pointer-events-none z-50">
      <GradualBlur
        target="parent"
        position="bottom"
        height="2rem"
        strength={5}
        divCount={8}
        exponential
        opacity={1}
      />
    </div>
  );
}
