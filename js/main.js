const container = document.getElementById('tilesContainer');
let highestZ = 10;
const tempTiles = new Set(); // keep track of temporary hover subtiles

// Fetch tiles from JSON
fetch('assets/data/library.json')
  .then(res => res.json())
  .then(tilesData => {
    tilesData.forEach((t,i) => {
      createTile(t, 'main', 100 + i*200, 200);
    });

    function createTile(data, type='main', x=100, y=100) {
      const tile = document.createElement('div');
      tile.className = `tile ${type}`;
      tile.textContent = data.title;
      tile.style.left = x + 'px';
      tile.style.top = y + 'px';
      tile.dataset.locked = "false"; // whether tile stays after click
      container.appendChild(tile);

      // Dragging tiles
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
      };
      document.onmouseup = () => { isDragging = false; };

      // Hover → show subtiles temporarily
      tile.onmouseenter = () => {
        if (data.subtiles) {
          showSubtiles(tile, data.subtiles);
        }
      };
      tile.onmouseleave = () => {
        // remove hover subtiles not locked
        tempTiles.forEach(t => {
          if (t.dataset.locked !== "true") {
            t.remove();
            tempTiles.delete(t);
          }
        });
      };

      // Click → lock tile in place
      tile.onclick = () => {
        tile.dataset.locked = "true"; 
        // Leaf node → open window
        if (!data.subtiles && data.content) openWindow(data.title, data.content);
      };

      return tile;
    }

    function showSubtiles(parentTile, subtiles) {
      const n = subtiles.length;
      const radius = 150;
      subtiles.forEach((sub, i) => {
        const angle = (i / n) * Math.PI * 2;
        const x = parseInt(parentTile.style.left) + Math.cos(angle) * radius;
        const y = parseInt(parentTile.style.top) + Math.sin(angle) * radius;
        const subType = sub.subtiles ? 'sub' : 'leaf';
        const subTile = createTile(sub, subType, x, y);
        subTile.classList.add('temp');
        tempTiles.add(subTile);
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

      // Dragging window
      let isDragging = false, offsetX, offsetY;
      header.onmousedown = (e) => {
        if(e.target.tagName==='BUTTON') return;
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        win.style.zIndex = ++highestZ;
      };
      document.onmousemove = (e) => {
        if (!isDragging) return;
        win.style.left = e.clientX - offsetX + 'px';
        win.style.top = e.clientY - offsetY + 'px';
      };
      document.onmouseup = () => { isDragging = false; };

      // Close
      closeBtn.onclick = () => win.remove();

      // Minimize
      minBtn.onclick = () => {
        if (iframe.style.display !== 'none') {
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
