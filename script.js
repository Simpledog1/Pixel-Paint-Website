/* ========================================
   PIXEL PAINT - JAVASCRIPT
   ======================================== */

// ========== HAMBURGER MENU FUNCTIONALITY ==========
function toggleMenu() {
  const nav = document.getElementById('nav-menu');
  const hamburger = document.getElementById('hamburger');
  
  if (nav && hamburger) {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
  }
}

// Event listener for hamburger menu
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }


  // Close menu when clicking nav links on mobile
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth < 768) {
        const nav = document.getElementById('nav-menu');
        if (nav) {
          nav.classList.remove('active');
        }
      }
    });
  });
});

// ========== SMOOTH SCROLL WITH OFFSET ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const targetPos = target.offsetTop - offset;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    }
  });
});

// ========== HOME PAGE - FORM VALIDATION ==========
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = this.querySelector('#name');
      const email = this.querySelector('#email');
      const message = this.querySelector('#message');
      const subject = this.querySelector('#subject');
      
      if (!name || !email || !message || !subject) return;
      
      let isValid = true;
      let errors = [];

      // Name validation
      if (name.value.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
        isValid = false;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        errors.push('Please enter a valid email address');
        isValid = false;
      }
      
      // Subject validation
      if (subject.value === '') {
        errors.push('Please select a subject');
        isValid = false;
      }
      
      // Message validation
      if (message.value.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
        isValid = false;
      }
      
      // Display errors or submit
      if (!isValid) {
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
      } else {
        alert('Thank you for your message! We\'ll get back to you soon.');
        this.reset();
      }
    });
  }
});

// ========== EDITOR PAGE FUNCTIONALITY ==========

// Global State for Editor
let gridSize = 32;
let zoom = 1;
let currentColor = '#8B5CF6';
let currentTool = 'brush';
let brushSize = 1;
let layers = [
  { id: 1, name: 'Layer 1', visible: true, pixels: {} }
];
let activeLayerId = 1;
let nextLayerId = 2;
let isDrawing = false;

const colors = [
  '#000000', '#FFFFFF', '#8B5CF6', '#EC4899', '#10B981',
  '#F59E0B', '#3B82F6', '#EF4444', '#6B7280', '#14B8A6'
];

// ========== TOOLS ==========
function setTool(tool) {
  currentTool = tool;
  document.getElementById('brush-tool')?.classList.remove('active');
  document.getElementById('eraser-tool')?.classList.remove('active');
  document.getElementById('bucket-tool')?.classList.remove('active');
  document.getElementById(`${tool}-tool`)?.classList.add('active');
}

// ========== ZOOM ==========
function zoomIn() {
  zoom = Math.min(2, zoom + 0.25);
  updateZoom();
}

function zoomOut() {
  zoom = Math.max(0.5, zoom - 0.25);
  updateZoom();
}

function updateZoom() {
  const zoomLevel = document.getElementById('zoom-level');
  if (zoomLevel) {
    zoomLevel.textContent = Math.round(zoom * 100) + '%';
  }
  drawCanvas();
}

// ========== BRUSH SIZE ==========
function increaseBrushSize() {
  brushSize = Math.min(5, brushSize + 1);
  updateBrushSizeDisplay();
}

function decreaseBrushSize() {
  brushSize = Math.max(1, brushSize - 1);
  updateBrushSizeDisplay();
}

function updateBrushSizeDisplay() {
  const display = document.getElementById('brush-size-display');
  if (display) {
    display.textContent = brushSize + 'px';
  }
}

// ========== COLOR VALIDATION ==========
function isValidHex(hex) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

function updateCurrentColorDisplay() {
  const display = document.getElementById('current-color-display');
  if (display) {
    display.style.backgroundColor = currentColor;
  }
}

// ========== COLOR PALETTE ==========
function renderColorPalette() {
  const palette = document.getElementById('color-palette');
  if (!palette) return;
  
  palette.innerHTML = '';
  
  colors.forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color;
    if (color === currentColor) {
      swatch.classList.add('active');
    }
    swatch.onclick = () => {
      currentColor = color;
      document.getElementById('color-picker').value = color;
      document.getElementById('hex-input').value = color;
      updateColorSelection();
      updateCurrentColorDisplay();
    };
    palette.appendChild(swatch);
  });
}

function updateColorSelection() {
  document.querySelectorAll('.color-swatch').forEach((swatch, i) => {
    if (colors[i] === currentColor) {
      swatch.classList.add('active');
    } else {
      swatch.classList.remove('active');
    }
  });
}


// ========== LAYERS ==========
function renderLayers() {
  const list = document.getElementById('layers-list');
  if (!list) return;
  
  list.innerHTML = '';
  
  [...layers].reverse().forEach(layer => {
    const item = document.createElement('div');
    item.className = 'layer-item';
    if (layer.id === activeLayerId) {
      item.classList.add('active');
    }
    
    item.innerHTML = `
      <span class="layer-name">${layer.name}</span>
      <div class="layer-controls">
        <button class="layer-control-btn" onclick="toggleLayerVisibility(${layer.id}); event.stopPropagation()">
          ${layer.visible ? '👁️' : '👁️‍🗨️'}
        </button>
        ${layers.length > 1 ? `
          <button class="layer-control-btn delete" onclick="deleteLayer(${layer.id}); event.stopPropagation()">
            🗑️
          </button>
        ` : ''}
      </div>
    `;
    
    item.onclick = () => {
      activeLayerId = layer.id;
      renderLayers();
    };
    
    list.appendChild(item);
  });
}

function addLayer() {
  layers.push({
    id: nextLayerId,
    name: `Layer ${nextLayerId}`,
    visible: true,
    pixels: {}
  });
  activeLayerId = nextLayerId;
  nextLayerId++;
  renderLayers();
  drawCanvas();
}

function deleteLayer(id) {
  if (layers.length === 1) return;
  layers = layers.filter(l => l.id !== id);
  if (activeLayerId === id) {
    activeLayerId = layers[0].id;
  }
  renderLayers();
  drawCanvas();
}

function toggleLayerVisibility(id) {
  layers = layers.map(l => 
    l.id === id ? { ...l, visible: !l.visible } : l
  );
  renderLayers();
  drawCanvas();
}

// ========== CANVAS DRAWING ==========
function drawCanvas() {
  const canvas = document.getElementById('pixel-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const pixelSize = 20 * zoom;
  const size = gridSize * pixelSize;
  
  canvas.width = size;
  canvas.height = size;
  
  // Clear and draw background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  
  // Draw grid
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * pixelSize, 0);
    ctx.lineTo(i * pixelSize, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * pixelSize);
    ctx.lineTo(size, i * pixelSize);
    ctx.stroke();
  }
  
  // Draw pixels from visible layers
  layers.forEach(layer => {
    if (!layer.visible) return;
    Object.entries(layer.pixels).forEach(([key, color]) => {
      const [row, col] = key.split('-').map(Number);
      ctx.fillStyle = color;
      ctx.fillRect(col * pixelSize + 1, row * pixelSize + 1, pixelSize - 2, pixelSize - 2);
    });
  });
}

// ========== PAINTING ==========
function handleCanvasMouseDown(e) {
  isDrawing = true;
  const { row, col } = getPixelCoords(e);
  
  if (currentTool === 'brush') {
    paintPixel(row, col);
  } else if (currentTool === 'eraser') {
    erasePixel(row, col);
  } else if (currentTool === 'bucket') {
    bucketFill(row, col);
  }
}

function handleCanvasMouseMove(e) {
  if (!isDrawing) return;
  const { row, col } = getPixelCoords(e);
  
  if (currentTool === 'brush') {
    paintPixel(row, col);
  } else if (currentTool === 'eraser') {
    erasePixel(row, col);
  }
}

function handleCanvasMouseUp() {
  isDrawing = false;
}

function getPixelCoords(e) {
  const canvas = document.getElementById('pixel-canvas');
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const pixelSize = 20 * zoom;
  const col = Math.floor(x / pixelSize);
  const row = Math.floor(y / pixelSize);
  return { row, col };
}

function paintPixel(row, col) {
  if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return;
  
  const halfSize = Math.floor(brushSize / 2);
  
  for (let r = row - halfSize; r <= row + halfSize; r++) {
    for (let c = col - halfSize; c <= col + halfSize; c++) {
      if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
        layers = layers.map(l => {
          if (l.id === activeLayerId) {
            const key = `${r}-${c}`;
            return {
              ...l,
              pixels: { ...l.pixels, [key]: currentColor }
            };
          }
          return l;
        });
      }
    }
  }
  
  drawCanvas();
}

function erasePixel(row, col) {
  if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return;
  
  const halfSize = Math.floor(brushSize / 2);
  
  for (let r = row - halfSize; r <= row + halfSize; r++) {
    for (let c = col - halfSize; c <= col + halfSize; c++) {
      if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
        layers = layers.map(l => {
          if (l.id === activeLayerId) {
            const key = `${r}-${c}`;
            const newPixels = { ...l.pixels };
            delete newPixels[key];
            return {
              ...l,
              pixels: newPixels
            };
          }
          return l;
        });
      }
    }
  }
  
  drawCanvas();
}

function bucketFill(startRow, startCol) {
  if (startRow < 0 || startRow >= gridSize || startCol < 0 || startCol >= gridSize) return;
  
  const activeLayer = layers.find(l => l.id === activeLayerId);
  if (!activeLayer) return;

  const startKey = `${startRow}-${startCol}`;
  const targetColor = activeLayer.pixels[startKey] || null;
  
  if (targetColor === currentColor) return;

  const newPixels = { ...activeLayer.pixels };
  const stack = [[startRow, startCol]];
  const visited = new Set();

  while (stack.length > 0) {
    const [row, col] = stack.pop();
    const key = `${row}-${col}`;

    if (visited.has(key)) continue;
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) continue;

    const currentPixelColor = newPixels[key] || null;
    if (currentPixelColor !== targetColor) continue;

    visited.add(key);
    newPixels[key] = currentColor;

    stack.push([row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]);
  }

  layers = layers.map(l => 
    l.id === activeLayerId ? { ...l, pixels: newPixels } : l
  );
  
  drawCanvas();
}

// ========== INITIALIZE EDITOR ==========
function initEditor() {
  const canvas = document.getElementById('pixel-canvas');
  if (!canvas) return; // Not on editor page
  
  renderColorPalette();
  renderLayers();
  drawCanvas();
  updateCurrentColorDisplay();
  updateBrushSizeDisplay();
  
// Color picker listener
  const colorPicker = document.getElementById('color-picker');
  if (colorPicker) {
    colorPicker.addEventListener('input', (e) => {
      currentColor = e.target.value.toUpperCase();
      document.getElementById('hex-input').value = currentColor;
      updateColorSelection();
      updateCurrentColorDisplay();
    });
  }