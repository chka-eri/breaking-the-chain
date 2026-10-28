import React, { useEffect, useRef, useState } from "react";
import { Text, Pressable } from "react-native";

// Typewriter text. Tap to reveal instantly.
export default function TypeText({ text, style, speed = 14, onDone, complete }) {
  const [n, setN] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    setN(0);
    doneRef.current = false;
  }, [text]);

  useEffect(() => {
    if (complete) setN((text || "").length);
  }, [complete, text]);

  useEffect(() => {
    if (!text) return;
    if (n >= text.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        if (onDone) onDone();
      }
      return;
    }
    const t = setTimeout(() => setN((v) => Math.min(text.length, v + 2)), speed);
    return () => clearTimeout(t);
  }, [n, text, speed, onDone]);

  const isDone = n >= (text || "").length;

  return (
    <Pressable onPress={() => setN((text || "").length)}>
      <Text style={style}>
        {(text || "").slice(0, n)}
        {!isDone ? <Text style={{ opacity: 0.4 }}>▌</Text> : null}
      </Text>
    </Pressable>
  );
}
