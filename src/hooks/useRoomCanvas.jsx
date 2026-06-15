import { useState, useRef } from "react";

const GRID_STEP = 0.1;
const CELL_SIZE = 40;

export const useRoomCanvas = (roomConfig, showNotification) => {
  const [placedFurniture, setPlacedFurniture] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const checkCollision = (id, x, y, w, h, currentFurniture = placedFurniture) => {
    if (!roomConfig) return true;
    const eps = 0.001;

    if (x < 0 || y < 0 || x + w > roomConfig.width + eps || y + h > roomConfig.height + eps) {
      return true;
    }

    for (let item of currentFurniture) {
      if (item.id === id) continue;
      const isOverlappingX = x < item.x + item.width - eps && x + w > item.x + eps;
      const isOverlappingY = y < item.y + item.height - eps && y + h > item.y + eps;
      if (isOverlappingX && isOverlappingY) return true;
    }
    return false;
  };

  const handleMouseDown = (e, item) => {
    if (e.button !== 0) return;
    setActiveId(item.id);
    setIsDragging(true);

    const rect = canvasRef.current.getBoundingClientRect();
    const clickXExact = (e.clientX - rect.left) / CELL_SIZE;
    const clickYExact = (e.clientY - rect.top) / CELL_SIZE;

    setDragOffset({
      x: clickXExact - item.x,
      y: clickYExact - item.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!activeId || !isDragging || !roomConfig || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentXExact = (e.clientX - rect.left) / CELL_SIZE;
    const currentYExact = (e.clientY - rect.top) / CELL_SIZE;

    let targetX = currentXExact - dragOffset.x;
    let targetY = currentYExact - dragOffset.y;

    targetX = Math.round(targetX / GRID_STEP) * GRID_STEP;
    targetY = Math.round(targetY / GRID_STEP) * GRID_STEP;

    targetX = Number(targetX.toFixed(2));
    targetY = Number(targetY.toFixed(2));

    const currentItem = placedFurniture.find((i) => i.id === activeId);
    if (!currentItem) return;

    targetX = Math.max(0, Math.min(targetX, roomConfig.width - currentItem.width));
    targetY = Math.max(0, Math.min(targetY, roomConfig.height - currentItem.height));

    if (!checkCollision(activeId, targetX, targetY, currentItem.width, currentItem.height)) {
      setPlacedFurniture(
        placedFurniture.map((item) =>
          item.id === activeId ? { ...item, x: targetX, y: targetY } : item
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRotate = (id) => {
    if (!id) return;
    const updated = placedFurniture.map((item) => {
      if (item.id === id) {
        const nextRotation = (item.rotation + 90) % 360;
        const newWidth = item.height;
        const newHeight = item.width;

        if (!checkCollision(id, item.x, item.y, newWidth, newHeight)) {
          return { ...item, rotation: nextRotation, width: newWidth, height: newHeight };
        } else {
          if (showNotification) showNotification("Cannot rotate: Object intersects boundaries or other furniture.", "error");
        }
      }
      return item;
    });
    setPlacedFurniture(updated);
  };

  const addFurniture = (template) => {
    const newItem = {
      ...template,
      id: crypto.randomUUID(),
      x: 0,
      y: 0,
      rotation: 0,
    };

    if (!checkCollision(newItem.id, newItem.x, newItem.y, newItem.width, newItem.height)) {
      setPlacedFurniture([...placedFurniture, newItem]);
      setActiveId(newItem.id);
    } else {
      if (showNotification) showNotification("No space at starting position", "error");
    }
  };

  const removeFurniture = (id) => {
    setPlacedFurniture(placedFurniture.filter((item) => item.id !== id));
    if (activeId === id) setActiveId(null);
  };

  return {
    placedFurniture,
    activeId,
    canvasRef,
    setActiveId,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleRotate,
    addFurniture,
    removeFurniture,
    CELL_SIZE,
  };
}; 