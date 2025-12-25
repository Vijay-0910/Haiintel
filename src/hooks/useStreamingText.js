import { useState, useEffect, useRef } from "react";

/**
 * Optimized streaming text hook - shows text character by character
 * Uses requestAnimationFrame for perfectly consistent timing
 */
export const useStreamingText = (fullText, speed = 80, shouldStart = true) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const rafRef = useRef(null);
  const indexRef = useRef(0);
  const lastUpdateTimeRef = useRef(0);
  const textRef = useRef("");

  useEffect(() => {
    // New text received - reset everything
    if (fullText !== textRef.current) {
      textRef.current = fullText;
      indexRef.current = 0;
      lastUpdateTimeRef.current = 0;
      setDisplayedText("");
      setIsComplete(false);

      // Cancel any ongoing animation
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (!shouldStart || !fullText) {
        return;
      }

      // Skip animation if text is too short
      if (fullText.length < 10) {
        setDisplayedText(fullText);
        setIsComplete(true);
        return;
      }

      // Start animation loop
      lastUpdateTimeRef.current = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - lastUpdateTimeRef.current;

        // Only update when enough time has passed (speed ms per character)
        if (elapsed >= speed) {
          lastUpdateTimeRef.current = currentTime;
          indexRef.current += 1;

          if (indexRef.current <= fullText.length) {
            setDisplayedText(fullText.substring(0, indexRef.current));
            rafRef.current = requestAnimationFrame(animate);
          } else {
            // Done
            setIsComplete(true);
            rafRef.current = null;
          }
        } else {
          // Not enough time passed, continue loop
          rafRef.current = requestAnimationFrame(animate);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [fullText, speed, shouldStart]);

  // Handle stop generation
  useEffect(() => {
    if (!shouldStart && rafRef.current && !isComplete) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setDisplayedText(fullText);
      setIsComplete(true);
    }
  }, [shouldStart, fullText, isComplete]);

  return { displayedText, isComplete };
};

export default useStreamingText;
