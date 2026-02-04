import { Landmark, GestureType } from '../types';

/**
 * Calculates Euclidean distance between two 3D points
 */
const distance = (p1: Landmark, p2: Landmark): number => {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + 
    Math.pow(p1.y - p2.y, 2) + 
    Math.pow(p1.z - p2.z, 2)
  );
};

/**
 * Robust Gesture Classification Engine
 * Uses geometric heuristics to classify gestures from 3D landmarks.
 * 
 * Logic:
 * 1. Calculate finger states (Extended vs Curled) using distance from Wrist.
 * 2. Apply decision tree based on finger states and geometric relations (angles/distances).
 */
export const classifyGesture = (landmarks: Landmark[]): GestureType => {
  if (!landmarks || landmarks.length !== 21) return GestureType.None;

  const wrist = landmarks[0];

  /**
   * Helper to check if a finger is extended.
   * A finger is considered extended if the Tip is significantly further 
   * from the Wrist than the PIP joint is.
   * @param tipIdx Index of the finger tip
   * @param pipIdx Index of the finger PIP joint (knuckle)
   */
  const isExtended = (tipIdx: number, pipIdx: number) => {
    const dTip = distance(wrist, landmarks[tipIdx]);
    const dPip = distance(wrist, landmarks[pipIdx]);
    // 1.15 threshold helps filter out loosely curled fingers
    return dTip > (dPip * 1.15); 
  };

  // 1. Analyze Finger States
  
  // Thumb logic: Check distance of Tip vs IP relative to Pinky MCP (Landmark 17)
  // This detects abduction (moving thumb away from palm).
  const isThumbOpen = (() => {
    const dTipToPinkyRoot = distance(landmarks[4], landmarks[17]);
    const dIpToPinkyRoot = distance(landmarks[3], landmarks[17]);
    return dTipToPinkyRoot > (dIpToPinkyRoot * 1.1);
  })();

  const isIndexOpen = isExtended(8, 6);
  const isMiddleOpen = isExtended(12, 10);
  const isRingOpen = isExtended(16, 14);
  const isPinkyOpen = isExtended(20, 18);

  const openFingersCount = [isIndexOpen, isMiddleOpen, isRingOpen, isPinkyOpen].filter(Boolean).length;

  // 2. Classification Decision Tree

  // THUMBS UP / DOWN
  // Thumb must be open, other 4 fingers must be closed.
  if (isThumbOpen && openFingersCount === 0) {
    // Check vertical orientation of the thumb
    // We compare Y coordinates of Tip(4) and IP(3).
    // Note: In MediaPipe/Screen coords, Y=0 is top, Y=1 is bottom.
    // Thumbs Up: Tip is ABOVE IP (Tip.y < IP.y)
    // Thumbs Down: Tip is BELOW IP (Tip.y > IP.y)
    
    // Also check X alignment to ensure it's vertical-ish
    const yDiff = landmarks[4].y - landmarks[3].y;
    const xDiff = Math.abs(landmarks[4].x - landmarks[3].x);
    
    // Ensure the thumb is pointing more vertically than horizontally
    if (Math.abs(yDiff) > xDiff) {
       if (yDiff < 0) return GestureType.ThumbsUp;
       if (yDiff > 0) return GestureType.ThumbsDown;
    }
  }

  // VICTORY (Peace Sign)
  // Index and Middle open, others closed
  if (isIndexOpen && isMiddleOpen && !isRingOpen && !isPinkyOpen) {
     // Geometric check: Tips must be spread apart (V shape)
     // If they are together, it looks like "Number 2" or "Rabbit ears" closed.
     const tipDistance = distance(landmarks[8], landmarks[12]);
     const middleFingerLen = distance(landmarks[12], landmarks[9]); // Tip to MCP
     
     // Threshold: Spread is at least 30% of finger length
     if (tipDistance > (middleFingerLen * 0.3)) {
       return GestureType.Victory;
     }
  }

  // POINTING
  // Index open, Middle/Ring/Pinky closed.
  if (isIndexOpen && !isMiddleOpen && !isRingOpen && !isPinkyOpen) {
     return GestureType.Pointing;
  }

  // I LOVE YOU
  // Thumb, Index, Pinky Open. Middle, Ring Closed.
  if (isThumbOpen && isIndexOpen && !isMiddleOpen && !isRingOpen && isPinkyOpen) {
    return GestureType.Love;
  }

  // OPEN HAND
  // All 5 fingers open (Thumb + 4 fingers)
  if (isThumbOpen && openFingersCount === 4) {
    return GestureType.OpenHand;
  }
  
  // Relaxed Open Hand check (sometimes thumb is loose)
  if (openFingersCount === 4) {
      return GestureType.OpenHand;
  }

  // CLOSED FIST
  // No fingers open, or maybe just thumb loosely curled
  if (openFingersCount === 0 && !isThumbOpen) {
    return GestureType.ClosedFist;
  }

  return GestureType.None;
};