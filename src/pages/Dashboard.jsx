import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import RoomSizeModal from "../components/RoomSizeModal";
import Notification from "../components/Notification";
import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import CanvasArea from "../components/CanvasArea";
import RightSidebar from "../components/RightSidebar";

const GRID_STEP = 0.1;

export default function Dashboard() {
  const [companiesData, setCompaniesData] = useState([]);
  const [roomConfig, setRoomConfig] = useState(null);
  const [placedFurniture, setPlacedFurniture] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [savedLayouts, setSavedLayouts] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [toast, setToast] = useState(null);
  const [currentLayoutId, setCurrentLayoutId] = useState(null);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [cellSize, setCellSize] = useState(50);

  const canvasContainerRef = useRef(null);

  useEffect(() => {
    fetchSavedLayouts();
    fetchCompaniesData();
  }, []);

  useEffect(() => {
    if (!roomConfig || !canvasContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const rect = entry.target.getBoundingClientRect();
        const padding = 24;
        
        const availableWidth = (rect.width || entry.contentRect.width) - padding;
        const availableHeight = (rect.height || entry.contentRect.height) - padding;

        if (availableWidth <= 0 || availableHeight <= 0) continue;

        const maxCellWidth = Math.floor((availableWidth * 0.9) / roomConfig.width);
        const maxCellHeight = Math.floor((availableHeight * 0.9) / roomConfig.height);

        let idealSize = Math.min(maxCellWidth, maxCellHeight, 50);
        idealSize = Math.max(idealSize, 12);

        setCellSize(idealSize);
      }
    });

    resizeObserver.observe(canvasContainerRef.current);
    return () => resizeObserver.disconnect();
  }, [roomConfig]);

  useEffect(() => {
    if (!isDragging || !activeId) return;

    const handleMove = (e) => {
      if (!roomConfig) return;
      const rect = document.getElementById("grid-canvas")?.getBoundingClientRect();
      if (!rect) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const currentXExact = (clientX - rect.left) / cellSize;
      const currentYExact = (clientY - rect.top) / cellSize;

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
        setPlacedFurniture((prev) =>
          prev.map((item) => (item.id === activeId ? { ...item, x: targetX, y: targetY } : item))
        );
      }
    };

    const handleUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging, activeId, dragOffset, roomConfig, placedFurniture, cellSize]);

  const showNotification = (message, type = "error") => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  };

  const fetchCompaniesData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/companies`);
      setCompaniesData(response.data);
    } catch (error) {
      console.error(error.message);
      showNotification("Failed to load furniture catalogs", "error");
    }
  };

  const fetchSavedLayouts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/layouts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedLayouts(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleInitRoom = (config) => {
    setRoomConfig(config);
    setPlacedFurniture([]);
    setActiveId(null);
    setCurrentLayoutId(null);
  };

  const checkCollision = (id, x, y, w, h, currentFurniture = placedFurniture) => {
    if (!roomConfig) return true;
    const eps = 0.001;

    if (
      x < 0 ||
      y < 0 ||
      x + w > roomConfig.width + eps ||
      y + h > roomConfig.height + eps
    ) {
      return true;
    }

    for (let item of currentFurniture) {
      if (item.id === id) continue;
      if (
        x < item.x + item.width - eps &&
        x + w > item.x + eps &&
        y < item.y + item.height - eps &&
        y + h > item.y + eps
      ) {
        return true;
      }
    }
    return false;
  };

  const selectedCompany = companiesData.find((comp) => comp.id === selectedCompanyId);

  const addFurnitureToCanvas = (item) => {
    if (!roomConfig || !selectedCompany) return;

    if (item.width > roomConfig.width || item.height > roomConfig.height) {
      showNotification(
        `This item (${item.width}m × ${item.height}m) is larger than your room dimensions!`,
        "error"
      );
      return;
    }

    const id = `f-${Date.now()}`;
    let placed = false;

    for (
      let y = 0;
      y <= roomConfig.height - item.height;
      y = Number((y + GRID_STEP).toFixed(1))
    ) {
      for (
        let x = 0;
        x <= roomConfig.width - item.width;
        x = Number((x + GRID_STEP).toFixed(1))
      ) {
        if (!checkCollision(id, x, y, item.width, item.height)) {
          const newItem = {
            id,
            name: item.name,
            company: selectedCompany.name,
            x,
            y,
            width: item.width,
            height: item.height,
            rotation: 0,
          };
          setPlacedFurniture([...placedFurniture, newItem]);
          setActiveId(id);
          placed = true;
          setIsRightSidebarOpen(false);
          break;
        }
      }
      if (placed) break;
    }
    if (!placed) {
      showNotification("No space available on the canvas grid!", "error");
    }
  };

  const handleRotate = (id) => {
    if (!id) return;
    const updated = placedFurniture.map((item) => {
      if (item.id === id) {
        const nextRotation = (item.rotation + 90) % 360;
        const newWidth = item.height;
        const newHeight = item.width;
        if (!checkCollision(id, item.x, item.y, newWidth, newHeight)) {
          return {
            ...item,
            rotation: nextRotation,
            width: newWidth,
            height: newHeight,
          };
        } else {
          showNotification(
            "Cannot rotate: Object intersects or goes out of boundaries.",
            "error"
          );
        }
      }
      return item;
    });
    setPlacedFurniture(updated);
  };

  const handleRemove = (id) => {
    if (!id) return;
    setPlacedFurniture(placedFurniture.filter((item) => item.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const handleMouseDown = (e, item) => {
    if (e.cancelable) e.preventDefault();
    setActiveId(item.id);
    setIsDragging(true);

    const rect = document.getElementById("grid-canvas").getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const clickXExact = (clientX - rect.left) / cellSize;
    const clickYExact = (clientY - rect.top) / cellSize;

    setDragOffset({
      x: clickXExact - item.x,
      y: clickYExact - item.y,
    });
  };

  const handleCanvasClick = (e) => {
    if (e.target.id === "grid-canvas") {
      setActiveId(null);
    }
  };

  const handleSaveLayout = async () => {
    if (!roomConfig || placedFurniture.length === 0) return;
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: roomConfig.name,
        roomWidth: roomConfig.width,
        roomHeight: roomConfig.height,
        furniture: placedFurniture,
      };

      if (currentLayoutId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/layouts/${currentLayoutId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification("Layout updated successfully!", "success");
      } else {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/layouts`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.data?._id) {
          setCurrentLayoutId(response.data._id);
        }
        showNotification("Layout successfully saved!", "success");
      }

      fetchSavedLayouts();
    } catch (error) {
      showNotification("Error saving layout: " + error.message, "error");
    }
  };

  const handleDeleteLayout = async (e, layoutId) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/layouts/${layoutId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification("Layout deleted successfully.", "success");
      
      if (currentLayoutId === layoutId) {
        setCurrentLayoutId(null);
      }
      
      fetchSavedLayouts();
    } catch (error) {
      showNotification("Error deleting layout: " + error.message, "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const activeItem = placedFurniture.find((item) => item.id === activeId);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200 flex flex-col selection:bg-blue-500/30 font-sans h-screen overflow-hidden relative">

      {!roomConfig && <RoomSizeModal onConfirm={handleInitRoom} />}

      <Header
        roomConfig={roomConfig}
        onSave={handleSaveLayout}
        onLogout={handleLogout}
      />

      <div className="lg:hidden flex justify-between bg-[#0e1626] border-b border-slate-800 p-2 text-sm z-30">
        <button 
          onClick={() => { setIsLeftSidebarOpen(!isLeftSidebarOpen); setIsRightSidebarOpen(false); }}
          className={`px-3 py-1.5 rounded transition ${isLeftSidebarOpen ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          📁 Schemas ({savedLayouts.length})
        </button>
        <button 
          onClick={() => { setIsRightSidebarOpen(!isRightSidebarOpen); setIsLeftSidebarOpen(false); }}
          className={`px-3 py-1.5 rounded transition ${isRightSidebarOpen ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}
        >
          🛋️ Furniture catalog
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        
        <div className={`
          absolute inset-y-0 left-0 z-40 w-72 bg-[#0d1527] border-r border-slate-800/80 transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:flex
          ${isLeftSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <LeftSidebar
            savedLayouts={savedLayouts}
            onLoadLayout={(layout) => {
              setRoomConfig({
                name: layout.name,
                width: layout.roomWidth,
                height: layout.roomHeight,
              });
              setPlacedFurniture(layout.furniture);
              setActiveId(null);
              setCurrentLayoutId(layout._id); 
              setIsLeftSidebarOpen(false); 
            }}
            onDeleteLayout={handleDeleteLayout}
            onResetRoom={() => {
              setRoomConfig(null);
              setCurrentLayoutId(null);
              setIsLeftSidebarOpen(false);
            }}
          />
        </div>
        
      <Notification toast={toast} onClose={() => setToast(null)} />

        <div ref={canvasContainerRef} className="flex-1 overflow-hidden flex items-center justify-center bg-[#090e1a]">
          <CanvasArea
            roomConfig={roomConfig}
            placedFurniture={placedFurniture}
            activeItem={activeItem}
            activeId={activeId}
            cellSize={cellSize}
            onRotate={handleRotate}
            onRemove={handleRemove}
            onCanvasClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
          />
        </div>

        <div className={`
          absolute inset-y-0 right-0 z-40 w-80 bg-[#0d1527] border-l border-slate-800/80 transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:flex
          ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full"}
        `}>
          <RightSidebar
            companiesData={companiesData}
            selectedCompany={selectedCompany}
            roomConfig={roomConfig}
            onSelectCompanyId={setSelectedCompanyId}
            onAddFurniture={addFurnitureToCanvas}
          />
        </div>

        {(isLeftSidebarOpen || isRightSidebarOpen) && (
          <div 
            className="absolute inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => { setIsLeftSidebarOpen(false); setIsRightSidebarOpen(false); }}
          />
        )}

      </div>
    </div>
  );
}