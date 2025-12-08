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
    // ... existing logic ...
    subtiles.forEach((sub, i) => {
        // ... existing logic to calculate x, y ...

        const subType = sub.subtiles ? 'sub' : 'leaf';
        const subTile = createTile(sub, subType, x, y);
        subTile.classList.add('temp');
        tempTiles.add(subTile);
        // REMOVE: allTiles.push(subTile); <-- This line breaks the logic
    });
}

    function openWindow(title, url) {
      const win = document.createElement('div');
      win.className = 'window';
      win.style.left = '200px';
      win.style.top = '200px';
      win.style.zIndex = ++highestZ;

      const header = document.createElement('div');
      header.className = 'window-header';
      header.innerHTML = `<span>${title}</span>`;
      const buttons = document.createElement('div');
      buttons.className = 'window-buttons';
      const closeBtn = document.createElement('button'); closeBtn.textContent = 'X';
      const minBtn = document.createElement('button'); minBtn.textContent = '_';
      buttons.appendChild(minBtn); buttons.appendChild(closeBtn);
      header.appendChild(buttons);
      win.appendChild(header);

      const iframe = document.createElement('iframe');
      iframe.src = url;
      win.appendChild(iframe);
      container.appendChild(win);

      // Drag window
      let isDragging = false, offsetX, offsetY;
      header.onmousedown = (e) => {
        if(e.target.tagName==='BUTTON') return;
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        win.style.zIndex = ++highestZ;
      };
      document.onmousemove = (e) => {
        if(!isDragging) return;
        win.style.left = Math.min(Math.max(0, e.clientX - offsetX), window.innerWidth - win.offsetWidth) + 'px';
        win.style.top = Math.min(Math.max(0, e.clientY - offsetY), window.innerHeight - win.offsetHeight) + 'px';
      };
      document.onmouseup = () => { isDragging = false; };

      closeBtn.onclick = () => {
        win.remove();
        // Restore other tiles
        allTiles.forEach(t => {
          if(t.dataset.locked !== "true") {
            t.style.left = t.dataset.origX + 'px';
            t.style.top = t.dataset.origY + 'px';
            t.classList.remove('shrink');
          }
        });
      };

      minBtn.onclick = () => {
        if(iframe.style.display !== 'none') {
          iframe.style.display = 'none';
          win.style.height = '40px';
        } else {
          iframe.style.display = 'block';
          win.style.height = '300px';
        }
      };
    }

  })
  .catch(err => console.error("JSON ERROR:", err));
