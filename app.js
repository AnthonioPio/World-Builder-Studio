// --- 1. Asset Catalog ---
const ASSET_CATEGORIES = [
  {
    name: "Terrain & Nature",
    items: [
      {
        id: "mountain",
        label: "Mountain Peak",
        size: 96,
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><polygon points="50,12 90,85 10,85" fill="#78716c" stroke="#292524" stroke-width="3"/><polygon points="50,12 65,40 55,36 50,44 43,35 35,40" fill="#f8fafc"/></svg>`
      },
      {
        id: "forest",
        label: "Pine Woods",
        size: 80,
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><polygon points="35,20 55,60 15,60" fill="#15803d" stroke="#14532d" stroke-width="2.5"/><polygon points="65,30 88,75 42,75" fill="#166534" stroke="#14532d" stroke-width="2.5"/><rect x="32" y="60" width="6" height="12" fill="#713f12"/><rect x="62" y="75" width="6" height="12" fill="#713f12"/></svg>`
      },
      {
        id: "volcano",
        label: "Volcano",
        size: 100,
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><polygon points="38,22 62,22 92,86 8,86" fill="#57534e" stroke="#1c1917" stroke-width="3"/><path d="M38,22 Q50,32 62,22 L66,35 L56,28 L50,38 L44,28 L34,35 Z" fill="#ef4444"/></svg>`
      }
    ]
  },
  {
    name: "Settlements",
    items: [
      {
        id: "castle",
        label: "Citadel",
        size: 92,
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect x="22" y="42" width="56" height="44" fill="#d6d3d1" stroke="#292524" stroke-width="3"/><rect x="16" y="28" width="16" height="58" fill="#a8a29e" stroke="#292524" stroke-width="3"/><rect x="68" y="28" width="16" height="58" fill="#a8a29e" stroke="#292524" stroke-width="3"/><path d="M43,86 V66 a7,7 0 0,1 14,0 V86 Z" fill="#44403c"/></svg>`
      },
      {
        id: "village",
        label: "Village",
        size: 76,
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><polygon points="32,32 54,50 10,50" fill="#b91c1c" stroke="#292524" stroke-width="2.5"/><rect x="15" y="50" width="34" height="26" fill="#fef3c7" stroke="#292524" stroke-width="2.5"/><polygon points="68,42 90,58 46,58" fill="#991b1b" stroke="#292524" stroke-width="2.5"/><rect x="51" y="58" width="34" height="24" fill="#fde68a" stroke="#292524" stroke-width="2.5"/></svg>`
      },
      {
        id: "tower",
        label: "Watchtower",
        size: 72,
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect x="36" y="30" width="28" height="56" fill="#cbd5e1" stroke="#1e293b" stroke-width="3"/><polygon points="50,10 70,30 30,30" fill="#1d4ed8" stroke="#1e293b" stroke-width="3"/></svg>`
      }
    ]
  },
  {
    name: "Markers & Lore",
    items: [
      {
        id: "compass",
        label: "Compass Rose",
        size: 110,
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="36" fill="none" stroke="#78350f" stroke-width="2" stroke-dasharray="4 3"/><polygon points="50,6 58,42 94,50 58,58 50,94 42,58 6,50 42,42" fill="#b45309" stroke="#451a03" stroke-width="2"/><circle cx="50" cy="50" r="6" fill="#fef3c7"/></svg>`
      },
      {
        id: "ship",
        label: "Galleon",
        size: 74,
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M18,66 L82,66 L70,82 L30,82 Z" fill="#78350f" stroke="#292524" stroke-width="2.5"/><line x1="50" y1="20" x2="50" y2="66" stroke="#292524" stroke-width="3"/><path d="M50,24 Q74,40 50,58 Z" fill="#fffbeb" stroke="#292524" stroke-width="2"/></svg>`
      }
    ]
  }
];

// --- 2. Application State ---
const state = {
  tool: "select", // 'select' | 'pan' | 'zoom'
  panX: -400,
  panY: -250,
  scale: 1,
  isPanning: false,
  panStartX: 0,
  panStartY: 0,
  selectedAssetEl: null,
  spacePressed: false
};

// --- 3. DOM Elements ---
const sidebar = document.getElementById("asset-sidebar");
const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
const expandSidebarBtn = document.getElementById("expand-sidebar-btn");
const assetLibrary = document.getElementById("asset-library");
const assetSearch = document.getElementById("asset-search");

const viewport = document.getElementById("map-viewport");
const worldStage = document.getElementById("world-stage");
const placedLayer = document.getElementById("placed-assets-layer");
const zoomReadout = document.getElementById("zoom-readout");
const deleteAssetBtn = document.getElementById("delete-asset-btn");
const toolButtons = document.querySelectorAll(".tool-btn");

// --- 4. Render Asset Sidebar ---
function renderSidebar(filterText = "") {
  assetLibrary.innerHTML = "";
  const query = filterText.trim().toLowerCase();

  ASSET_CATEGORIES.forEach((category) => {
    const matchingItems = category.items.filter((item) =>
      item.label.toLowerCase().includes(query)
    );
    if (matchingItems.length === 0) return;

    const section = document.createElement("div");
    section.innerHTML = `<h2 class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">${category.name}</h2>`;

    const grid = document.createElement("div");
    grid.className = "grid grid-cols-2 gap-2";

    matchingItems.forEach((asset) => {
      const card = document.createElement("div");
      card.draggable = true;
      card.className =
        "group flex flex-col items-center p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-400/60 cursor-grab active:cursor-grabbing transition";
      card.innerHTML = `
        <div class="w-12 h-12 mb-1.5 pointer-events-none group-hover:scale-105 transition-transform">${asset.svg}</div>
        <span class="text-[11px] text-slate-300 text-center leading-tight pointer-events-none">${asset.label}</span>
      `;

      // Drag start payload
      card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("application/json", JSON.stringify(asset));
      });

      // Allow click-to-spawn at center of viewport
      card.addEventListener("click", () => {
        const rect = viewport.getBoundingClientRect();
        const worldX = (rect.width / 2 - state.panX) / state.scale;
        const worldY = (rect.height / 2 - state.panY) / state.scale;
        spawnAssetOnMap(asset, worldX, worldY);
      });

      grid.appendChild(card);
    });

    section.appendChild(grid);
    assetLibrary.appendChild(section);
  });
}

// --- 5. Sidebar Collapse / Expand ---
toggleSidebarBtn.addEventListener("click", () => {
  sidebar.classList.add("sidebar-collapsed");
  expandSidebarBtn.classList.remove("hidden");
});

expandSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("sidebar-collapsed");
  expandSidebarBtn.classList.add("hidden");
});

assetSearch.addEventListener("input", (e) => renderSidebar(e.target.value));

// --- 6. Transform & Camera Helpers ---
function updateTransform() {
  worldStage.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.scale})`;
  zoomReadout.textContent = `${Math.round(state.scale * 100)}%`;
}

function zoomAtPoint(factor, clientX, clientY) {
  const rect = viewport.getBoundingClientRect();
  const mouseX = clientX - rect.left;
  const mouseY = clientY - rect.top;

  const newScale = Math.min(Math.max(state.scale * factor, 0.35), 2.5);
  const scaleRatio = newScale / state.scale;

  state.panX = mouseX - (mouseX - state.panX) * scaleRatio;
  state.panY = mouseY - (mouseY - state.panY) * scaleRatio;
  state.scale = newScale;
  updateTransform();
}

// --- 7. Tool Selection ---
function setActiveTool(toolName) {
  state.tool = toolName;
  toolButtons.forEach((btn) => {
    const isMatch = btn.dataset.tool === toolName;
    btn.classList.toggle("active-tool", isMatch);
    btn.classList.toggle("text-slate-300", !isMatch);
  });

  viewport.classList.remove("cursor-pan", "cursor-zoom");
  if (toolName === "pan") viewport.classList.add("cursor-pan");
  if (toolName === "zoom") viewport.classList.add("cursor-zoom");
}

toolButtons.forEach((btn) => {
  btn.addEventListener("click", () => setActiveTool(btn.dataset.tool));
});

// --- 8. Drag & Drop onto Map Canvas ---
viewport.addEventListener("dragover", (e) => e.preventDefault());

viewport.addEventListener("drop", (e) => {
  e.preventDefault();
  const raw = e.dataTransfer.getData("application/json");
  if (!raw) return;

  const asset = JSON.parse(raw);
  const rect = viewport.getBoundingClientRect();
  const worldX = (e.clientX - rect.left - state.panX) / state.scale;
  const worldY = (e.clientY - rect.top - state.panY) / state.scale;

  spawnAssetOnMap(asset, worldX, worldY);
});

function spawnAssetOnMap(asset, x, y) {
  const el = document.createElement("div");
  el.className = "placed-asset";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.width = `${asset.size}px`;
  el.style.height = `${asset.size}px`;
  el.innerHTML = asset.svg;

  // Enable selecting and dragging placed assets
  el.addEventListener("mousedown", (e) => {
    if (state.tool !== "select" || state.spacePressed) return;
    e.stopPropagation();
    selectPlacedAsset(el);

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startLeft = parseFloat(el.style.left);
    const startTop = parseFloat(el.style.top);

    function onMouseMove(moveEvent) {
      const dx = (moveEvent.clientX - startMouseX) / state.scale;
      const dy = (moveEvent.clientY - startMouseY) / state.scale;
      el.style.left = `${startLeft + dx}px`;
      el.style.top = `${startTop + dy}px`;
    }

    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  });

  placedLayer.appendChild(el);
  selectPlacedAsset(el);
}

function selectPlacedAsset(el) {
  if (state.selectedAssetEl) {
    state.selectedAssetEl.classList.remove("selected");
  }
  state.selectedAssetEl = el;
  if (el) {
    el.classList.add("selected");
    deleteAssetBtn.disabled = false;
  } else {
    deleteAssetBtn.disabled = true;
  }
}

// --- 9. Viewport Pan & Zoom Interactions ---
viewport.addEventListener("mousedown", (e) => {
  // Deselect if clicking empty parchment with Select tool
  if (state.tool === "select" && !state.spacePressed && e.button === 0) {
    selectPlacedAsset(null);
  }

  // Zoom tool click
  if (state.tool === "zoom" && e.button === 0) {
    zoomAtPoint(e.altKey ? 0.8 : 1.25, e.clientX, e.clientY);
    return;
  }

  // Panning via Pan tool, Spacebar hold, or Middle Mouse button
  if (state.tool === "pan" || state.spacePressed || e.button === 1) {
    state.isPanning = true;
    state.panStartX = e.clientX - state.panX;
    state.panStartY = e.clientY - state.panY;
  }
});

window.addEventListener("mousemove", (e) => {
  if (!state.isPanning) return;
  state.panX = e.clientX - state.panStartX;
  state.panY = e.clientY - state.panStartY;
  updateTransform();
});

window.addEventListener("mouseup", () => {
  state.isPanning = false;
});

viewport.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    zoomAtPoint(factor, e.clientX, e.clientY);
  },
  { passive: false }
);

// --- 10. Toolbar Buttons & Keyboard Shortcuts ---
document.getElementById("zoom-in-btn").addEventListener("click", () => {
  const rect = viewport.getBoundingClientRect();
  zoomAtPoint(1.2, rect.left + rect.width / 2, rect.top + rect.height / 2);
});

document.getElementById("zoom-out-btn").addEventListener("click", () => {
  const rect = viewport.getBoundingClientRect();
  zoomAtPoint(0.8, rect.left + rect.width / 2, rect.top + rect.height / 2);
});

document.getElementById("reset-view-btn").addEventListener("click", () => {
  state.panX = -400;
  state.panY = -250;
  state.scale = 1;
  updateTransform();
});

deleteAssetBtn.addEventListener("click", () => {
  if (!state.selectedAssetEl) return;
  state.selectedAssetEl.remove();
  selectPlacedAsset(null);
});

window.addEventListener("keydown", (e) => {
  if (document.activeElement === assetSearch) return;

  if (e.code === "Space") {
    state.spacePressed = true;
    viewport.classList.add("cursor-pan");
  }
  if (e.key.toLowerCase() === "v") setActiveTool("select");
  if (e.key.toLowerCase() === "h") setActiveTool("pan");
  if (e.key.toLowerCase() === "z") setActiveTool("zoom");
  if ((e.key === "Delete" || e.key === "Backspace") && state.selectedAssetEl) {
    state.selectedAssetEl.remove();
    selectPlacedAsset(null);
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    state.spacePressed = false;
    if (state.tool !== "pan") viewport.classList.remove("cursor-pan");
  }
});

// Initialize
renderSidebar();
updateTransform();