const container = document.getElementById('tilesContainer');
let highestZ = 10;
const tempTiles = new Set(); // tracks hover-generated subtiles
const allTiles = [];         // tracks all tiles for repositioning

fetch('assets/data/library.json')
  .then(res => res.json())
  .then(tilesData => {

    // Create initial main tiles
    tilesData.forEach((t,i) => {
      const tile = createTile(t, 'main', 100 + i*200, 200);
      allTiles.push(tile);
    });

    function createTile(data, type='main', x=100, y=100) {
      const tile = document.createElement('div');
      tile.className = `tile ${type}`;
      tile.textContent = data.title;
      tile.dataset.locked = "false"; // clicked tiles stay
      tile.dataset.type = type;
      tile.dataset.origX = x;
      tile.dataset.origY = y;

      // Constrain to viewport
      const clampPosition = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const rect = tile.getBoundingClientRect();
        tile.style.left = Math.min(Math.max(0, parseInt(tile.style.left)), w - rect.width) + 'px';
        tile.style.top = Math.min(Math.max(0, parseInt(tile.style.top)), h - rect.height) + 'px';
      };

      tile.style.left = x + 'px';
      tile.style.top = y + 'px';
      container.appendChild(tile);

      // Dragging
      let isDragging = false, offsetX, offsetY;
      tile.onmousedown = (e) => {
        isDragging = true;
        offsetX = e.clientX - tile.offsetLeft;
        offsetY = e.clientY - tile.offsetTop;
        tile.style.zIndex = ++highestZ;
      };
      document.onmousemove = (e) => {
        if(!isDragging) return;
        tile.style.left = e.clientX - offsetX + 'px';
        tile.style.top = e.clientY - offsetY + 'px';
        clampPosition();
      };
      document.onmouseup = () => { isDragging = false; };

      // Hover → show subtiles
      tile.onmouseenter = () => {
        if (data.subtiles) showSubtiles(tile, data.subtiles);
      };
      tile.onmouseleave = () => {
        tempTiles.forEach(t => {
          if(t.dataset.locked !== "true") {
            t.remove();
            tempTiles.delete(t);
          }
        });
      };

      // Click → lock tile and move other tiles away if needed
      tile.onclick = () => {
        tile.dataset.locked = "true";

        // Move/shrink nearby tiles
        allTiles.forEach(t => {
          if(t !== tile && t.dataset.locked !== "true") {
            t.classList.add('shrink');
            // Optionally push away slightly
            const dx = parseInt(t.style.left) - parseInt(tile.style.left);
            const dy = parseInt(t.style.top) - parseInt(tile.style.top);
            const dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 150) {
              t.style.left = parseInt(t.style.left) + Math.sign(dx)*50 + 'px';
              t.style.top = parseInt(t.style.top) + Math.sign(dy)*50 + 'px';
            }
          }
        });

        // Leaf node → open window
        if(!data.subtiles && data.content) openWindow(data.title, data.content);
      };

      return tile;
    }

    function showSubtiles(parentTile, subtiles) {
      const n = subtiles.length;
      const radius = 150;

      subtiles.forEach((sub, i) => {
        const angle = (i / n) * Math.PI * 2;
        let x = parseInt(parentTile.style.left) + Math.cos(angle) * radius;
        let y = parseInt(parentTile.style.top) + Math.sin(angle) * radius;

        // Keep subtiles inside viewport
        x = Math.min(Math.max(0, x), window.innerWidth - 100);
        y = Math.min(Math.max(0, y), window.innerHeight - 100);
