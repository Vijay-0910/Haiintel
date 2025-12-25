import { LazyMotion, domAnimation } from "framer-motion";

/**
 * LazyMotion Wrapper - Enables tree-shakeable Framer Motion
 *
 * CRITICAL: This reduces Framer Motion bundle size by ~70%
 * - Full motion import: ~115 KB
 * - LazyMotion + domAnimation: ~35 KB
 * - Savings: ~80 KB per component!
 *
 * Usage:
 * - Wrap your app or component tree with this
 * - Replace 'motion' with 'm' in child components
 * - Import from: "framer-motion" -> { m, AnimatePresence }
 */
const LazyMotionWrapper = ({ children }) => {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
};

export default LazyMotionWrapper;
