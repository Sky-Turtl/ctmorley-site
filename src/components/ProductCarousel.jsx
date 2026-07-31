import { useEffect, useRef } from "react";

const SPEED = 0.45;

const OFFSET_CLASS_PATTERN = /^(translate-y-|-translate-y-|m[lrtb]?-)/;

const stripOffsetClasses = (className) =>
  className
    .split(" ")
    .filter((token) => !OFFSET_CLASS_PATTERN.test(token))
    .join(" ");

function ProductCarousel({ items }) {
  const trackRef = useRef(null);
  const firstSetRef = useRef(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    let frameId;

    const animate = () => {
      const track = trackRef.current;
      const firstSet = firstSetRef.current;

      if (!track || !firstSet) {
        frameId = requestAnimationFrame(animate);
        return;
      }

      const singleSetWidth = firstSet.offsetWidth;

      offsetRef.current += SPEED;
      if (singleSetWidth > 0) {
        offsetRef.current = offsetRef.current % singleSetWidth;
      }

      track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div aria-hidden="true" className="w-full overflow-hidden lg:hidden">
      <div
        ref={trackRef}
        className="flex w-max items-center gap-6 bg-gradient-to-b from-orange-50 to-white will-change-transform select-none"
      >
        <div ref={firstSetRef} className="flex items-center gap-6 pr-6">
          {items.map((unit, index) => (
            <img
              key={`first-${index}`}
              src={unit.src}
              alt=""
              draggable={false}
              className={`${stripOffsetClasses(unit.className)} shrink-0 object-contain mix-blend-multiply`}
            />
          ))}
        </div>

        <div className="flex items-center gap-6 pr-6">
          {items.map((unit, index) => (
            <img
              key={`second-${index}`}
              src={unit.src}
              alt=""
              draggable={false}
              className={`${stripOffsetClasses(unit.className)} shrink-0 object-contain mix-blend-multiply`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductCarousel;
