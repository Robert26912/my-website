fetch('assets/data/library.json')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('tilesContainer');

    data.tiles.forEach((tile, index) => {
      // Create tile bubble
      const tileDiv = document.createElement('div');
      tileDiv.className = 'tile';
      tileDiv.textContent = tile.title;

      // Random initial position
      tileDiv.style.top = `${50 + index*120}px`;
      tileDiv.style.left = `${50 + index*120}px`;

      tileDiv.onclick = () => openWindow(tile);

      container.appendChild(tileDiv);
    });

    function openWindow(tile) {
      const win = document.createElement('div');
      win.className = 'window';

      // Header
      const header = document.createElement('div');
      header.className = 'window-header';
      header.textContent = tile.title;
      win.appendChild(header);

      // Iframe content
      const iframe = document.createElement('iframe');
      iframe.src = tile.content || (tile.subtiles ? tile.subtiles[0].content : '');
      win.appendChild(iframe);

      container.appendChild(win);

      // Dragging logic
      let offsetX, offsetY, isDragging = false;
      header.onmousedown = (e) => {
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
    }

    let highestZ = 10;
  })
  .catch(err => console.error("JSON ERROR:", err));
