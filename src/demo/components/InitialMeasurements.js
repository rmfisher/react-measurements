import { EditorState, ContentState } from 'draft-js';

export const createInitialState = () => [
  {
    "id": 0,
    "type": "line",
    "startX": 0.183,
    "startY": 0.33,
    "endX": 0.316,
    "endY": 0.224,
  },
  {
    "id": 1,
    "type": "circle",
    "centerX": 0.863,
    "centerY": 0.414,
    "radius": 0.0255,
  },
  {
    "id": 2,
    "type": "text",
    "arrowX": 0.482,
    "arrowY": 0.739, "textX": 0.532,
    "textY": 0.809,
    "editorState": EditorState.createWithContent(ContentState.createFromText("Pollen Grain")),
  }
];