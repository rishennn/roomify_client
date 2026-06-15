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
        const availableWidth = rect.width - 24;
        const availableHeight = rect.height - 24;
        const maxCellWidth = Math.floor((availableWidth * 0.9) / roomConfig.width);
        const maxCellHeight = Math.floor((availableHeight * 0.9) / roomConfig.height);
        let idealSize = Math.min(maxCellWidth, maxCellHeight, 50);
        setCellSize(Math.max(idealSize, 12));
      }
    });
    resizeObserver.observe(canvasContainerRef.current);
    return () => resizeObserver.disconnect();
  }, [roomConfig]);

  const showNotification = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCompaniesData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/companies`);
      setCompaniesData(response.data || []);
    } catch (error) { console.error(error.message); }
  };

  const fetchSavedLayouts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/layouts`, { headers: { Authorization: `Bearer ${token}` } });
      setSavedLayouts(response.data || []);
    } catch (error) { console.error(error.message); }
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
    if (x < 0 || y < 0 || x + w > roomConfig.width + eps || y + h > roomConfig.height + eps) return true;
    for (let item of currentFurniture) {
      if (item.id === id) continue;
      if (x < item.x + item.width - eps && x + w > item.x + eps && y < item.y + item.height - eps && y + h > item.y + eps) return true;
    }
    return false;
  };

  const selectedCompany = companiesData.find((comp) => comp.id === selectedCompanyId);

  const addFurnitureToCanvas = (item) => {
    if (!roomConfig || !selectedCompany) return;
    const id = `f-${Date.now()}`;
    let placed = false;
    for (let y = 0; y <= roomConfig.height - item.height; y = Number((y + GRID_STEP).toFixed(1))) {
      for (let x = 0; x <= roomConfig.width - item.width; x = Number((x + GRID_STEP).toFixed(1))) {
        if (!checkCollision(id, x, y, item.width, item.height)) {
          setPlacedFurniture([...placedFurniture, { id, name: item.name, company: selectedCompany.name, x, y, width: item.width, height: item.height, rotation: 0 }]);
          setActiveId(id);
          placed = true;
          setIsRightSidebarOpen(false);
          break;
        }
      }
      if (placed) break;
    }
    if (!placed) showNotification("No space available!", "error");
  };

  const handleRotate = (id) => {
    setPlacedFurniture(placedFurniture.map(item => item.id === id ? { ...item, rotation: (item.rotation + 90) % 360, width: item.height, height: item.width } : item));
  };

  const handleRemove = (id) => {
    setPlacedFurniture(placedFurniture.filter((item) => item.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const handleCanvasClick = (e) => { if (e.target.id === "grid-canvas") setActiveId(null); };

  const handleLogout = () => { localStorage.removeItem("token"); window.location.reload(); };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-200 flex flex-col h-screen overflow-hidden relative">
      <Notification toast={toast} onClose={() => setToast(null)} />
      
      {!roomConfig && <RoomSizeModal onConfirm={handleInitRoom} />}
      
      <Header roomConfig={roomConfig} onSave={() => {}} onLogout={handleLogout} />

      <div className="flex-1 flex overflow-hidden relative">
        <div className={`absolute inset-y-0 left-0 z-40 w-72 bg-[#0d1527] border-r border-slate-800 lg:static lg:translate-x-0 ${isLeftSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <LeftSidebar savedLayouts={savedLayouts} onLoadLayout={(l) => { setRoomConfig({name: l.name, width: l.roomWidth, height: l.roomHeight}); setPlacedFurniture(l.furniture); setIsLeftSidebarOpen(false); }} onResetRoom={() => setRoomConfig(null)} />
        </div>
        
        <div ref={canvasContainerRef} className="flex-1 overflow-hidden flex items-center justify-center bg-[#090e1a]">
          <CanvasArea roomConfig={roomConfig} placedFurniture={placedFurniture} activeId={activeId} cellSize={cellSize} onRotate={handleRotate} onRemove={handleRemove} onCanvasClick={handleCanvasClick} onMouseDown={(e, item) => { setActiveId(item.id); setIsDragging(true); }} />
        </div>

        <div className={`absolute inset-y-0 right-0 z-40 w-80 bg-[#0d1527] border-l border-slate-800 lg:static lg:translate-x-0 ${isRightSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
          <RightSidebar companiesData={companiesData} selectedCompany={selectedCompany} roomConfig={roomConfig} onSelectCompanyId={setSelectedCompanyId} onAddFurniture={addFurnitureToCanvas} />
        </div>
      </div>
    </div>
  );
}