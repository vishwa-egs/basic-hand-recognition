import React from 'react';
import { Hand, ThumbsUp, ThumbsDown, UserCheck, AlertCircle, Heart, Pointer } from 'lucide-react';
import { GestureData, GestureType } from './types';

export const GESTURE_DICTIONARY: Record<GestureType, GestureData> = {
  [GestureType.None]: {
    id: 'none',
    name: 'No Gesture',
    description: 'No recognizable hand gesture detected.',
    icon: <AlertCircle className="w-6 h-6" />
  },
  [GestureType.OpenHand]: {
    id: 'open_hand',
    name: 'Open Hand',
    description: 'All fingers are extended. Used for waving or stopping.',
    icon: <Hand className="w-6 h-6" />
  },
  [GestureType.ClosedFist]: {
    id: 'closed_fist',
    name: 'Closed Fist',
    description: 'All fingers are curled inwards. Symbolizes strength or rock.',
    icon: <Hand className="w-6 h-6 rotate-90" /> // Simulating fist
  },
  [GestureType.ThumbsUp]: {
    id: 'thumbs_up',
    name: 'Thumbs Up',
    description: 'Thumb extended upward. Indicates approval or good job.',
    icon: <ThumbsUp className="w-6 h-6" />
  },
  [GestureType.ThumbsDown]: {
    id: 'thumbs_down',
    name: 'Thumbs Down',
    description: 'Thumb extended downward. Indicates disapproval.',
    icon: <ThumbsDown className="w-6 h-6" />
  },
  [GestureType.Victory]: {
    id: 'victory',
    name: 'Victory',
    description: 'Index and middle fingers extended in a V shape.',
    icon: <UserCheck className="w-6 h-6" />
  },
  [GestureType.Pointing]: {
    id: 'pointing',
    name: 'Pointing',
    description: 'Index finger extended, others curled. Used to point.',
    icon: <Pointer className="w-6 h-6" />
  },
  [GestureType.Love]: {
    id: 'love',
    name: 'I Love You',
    description: 'Thumb, Index, and Pinky extended. Signifies love.',
    icon: <Heart className="w-6 h-6" />
  }
};