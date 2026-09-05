import {useState} from "react";

export function usePointerGlow() {
  const [position, setPosition] = useState({x: 0, y: 0, active: false});

  const onMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true,
    });
  };

  const onMouseLeave = () => {
    setPosition((current) => ({...current, active: false}));
  };

  return {position, handlers: {onMouseMove, onMouseLeave}};
}
