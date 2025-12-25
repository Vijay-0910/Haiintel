import { useState, useEffect, useRef, useMemo } from "react";

/**
 * Optimized streaming text hook - shows text character by character
 * Uses requestAnimationFrame for perfectly consistent timing
 *
 * Performance optimizations:
 * - Uses refs to avoid stale closures
 * - Proper cleanup on unmount
 * - Memoized return value to prevent unnecessary re-renders
 * - Dynamic speed based on text length for better UX
 */
export const useStreamingText = (fullText, speed = 30, shouldStart = true) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const rafRef = useRef(null);
  const indexRef = useRef(0);
  const lastUpdateTimeRef = useRef(0);
  const textRef = useRef("");

  // Cleanup function - extracted for reuse
  const cleanup = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  useEffect(() => {
    // Always cleanup first
    cleanup();

    // Reset if text changed
    if (fullText !== textRef.current) {
      textRef.current = fullText;
      indexRef.current = 0;
      lastUpdateTimeRef.current = 0;
      setDisplayedText("");
      setIsComplete(false);
    }

    // Early exit conditions
    if (!shouldStart || !fullText) {
      return cleanup;
    }

    // Skip animation if text is too short
    if (fullText.length < 10) {
      setDisplayedText(fullText);
      setIsComplete(true);
      return cleanup;
    }

    // Dynamic speed: faster for longer texts
    const effectiveSpeed =
      fullText.length > 200 ? Math.max(speed * 0.5, 10) : speed;

    // Start animation loop
    lastUpdateTimeRef.current = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - lastUpdateTimeRef.current;

      // Only update when enough time has passed
      if (elapsed >= effectiveSpeed) {
        lastUpdateTimeRef.current = currentTime;

        // Batch multiple characters for longer texts (smoother feel)
        const charsPerFrame =
          fullText.length > 500 ? 3 : fullText.length > 200 ? 2 : 1;
        indexRef.current = Math.min(
          indexRef.current + charsPerFrame,
          fullText.length
        );

        if (indexRef.current < fullText.length) {
          setDisplayedText(fullText.substring(0, indexRef.current));
          rafRef.current = requestAnimationFrame(animate);
        } else {
          // Done - show full text
          setDisplayedText(fullText);
          setIsComplete(true);
          rafRef.current = null;
        }
      } else {
        // Not enough time passed, continue loop
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return cleanup;
  }, [fullText, speed, shouldStart]);

  // Handle stop generation - show full text immediately
  useEffect(() => {
    if (!shouldStart && !isComplete && fullText) {
      cleanup();
      setDisplayedText(fullText);
      setIsComplete(true);
    }
  }, [shouldStart, fullText, isComplete]);

  // Memoize return value to prevent unnecessary re-renders in consumers
  return useMemo(
    () => ({ displayedText, isComplete }),
    [displayedText, isComplete]
  );
};

export default useStreamingText;
