const container = document.getElementById('tilesContainer');
let highestZ = 10;

// Fetch tiles from JSON
fetch('assets/data/library.json')
  .then(res => res.json())
  .then(tilesData => {
    // Initial positions
    tilesData.forEach((t,i) => {
      createTile(t, 'main', 100 + i*200, 200);
    });

    function createTile(data, type='main', x=100, y=100) {
      const tile = document.createElement('div');
      tile.className = `tile ${type}`;
      tile.textContent = data.title;
      tile.style.left = x + 'px';
      tile.style.top = y + 'px';
      container.appendChild(tile);

      tile.onclick = () => expandTile(tile, data, type);
      return tile;
    }

    function expandTile(tile, data, type) {
      // shrink others
      document.querySelectorAll('.tile').forEach(t => {
        if (t !== tile) t.classList.add('shrink');
        else t.classList.remove('shrink');
        t.style.zIndex = ++highestZ;
      });

      // remove old subtiles
      container.querySelectorAll('.tile.temp').forEach(t => t.remove());

      if (data.subtiles) {
        const n = data.subtiles.length;
        const radius = 150;
        data.subtiles.forEach((sub, i) => {
          const angle = (i / n) * Math.PI * 2;
          const x = parseInt(tile.style.left) + Math.cos(angle) * radius;
          const y = parseInt(tile.style.top) + Math.sin(angle) * radius;
          const subType = sub.subtiles ? 'sub' : 'leaf';
          const subTile = createTile(sub, subType, x, y);
          subTile.classList.add('temp');
        });

        if (data.content) openWindow(data.title + " Homepage", data.content);
      } else if (data.content) {
        openWindow(data.title, data.content);
      }
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

      // Dragging
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
