// Get the container where all tiles and windows will be added
const container = document.getElementById('tilesContainer');

// Keep track of z-index so clicked items are always on top
let highestZ = 10;

// Fetch the tiles data from JSON file
fetch('assets/data/library.json')
  .then(res => res.json())
  .then(tilesData => {

    // Create initial floating tiles with calculated positions
    tilesData.forEach((t,i) => {
      createTile(t, 'main', 100 + i*200, 200); // x positions spread out
    });

    // Function to create a tile element
    function createTile(data, type='main', x=100, y=100) {
      const tile = document.createElement('div');
      tile.className = `tile ${type}`;  // main, sub, or leaf
      tile.textContent = data.title;
      tile.style.left = x + 'px';
      tile.style.top = y + 'px';
      container.appendChild(tile);

      // Clicking tile triggers expansion or opens leaf content
      tile.onclick = () => expandTile(tile, data, type);
      return tile;
    }

    // Expand a tile: show subtiles or open content if leaf
    function expandTile(tile, data, type) {

      // Shrink other tiles for visual focus
      document.querySelectorAll('.tile').forEach(t => {
        if (t !== tile) t.classList.add('shrink');
        else t.classList.remove('shrink');
        t.style.zIndex = ++highestZ;  // bring clicked tile on top
      });

      // Remove old temporary subtiles from previous expansion
      container.querySelectorAll('.tile.temp').forEach(t => t.remove());

      if (data.subtiles) {
        // Place subtiles in a circular layout around parent
        const n = data.subtiles.length;
        const radius = 150; // distance from parent tile
        data.subtiles.forEach((sub, i) => {
          const angle = (i / n) * Math.PI * 2; // distribute evenly in circle
          const x = parseInt(tile.style.left) + Math.cos(angle) * radius;
          const y = parseInt(tile.style.top) + Math.sin(angle) * radius;
          const subType = sub.subtiles ? 'sub' : 'leaf';
          const subTile = createTile(sub, subType, x, y);
          subTile.classList.add('temp'); // mark as temporary
        });

        // Optional: open parent tile homepage in a window
        if (data.content) openWindow(data.title + " Homepage", data.content);

      } else if (data.content) {
        // Leaf node → open content in a movable window
        openWindow(data.title, data.content);
      }
    }

    // Function to create a floating window
    function openWindow(title, url) {
      const win = document.createElement('div');
      win.className = 'window';
      win.style.left = '200px';
      win.style.top = '200px';
      win.style.zIndex = ++highestZ; // bring to front

      // Create header with title and buttons
      const header = document.createElement('div');
      header.className = 'window-header';
      header.innerHTML = `<span>${title}</span>`;
      
      // Add close and minimize buttons
      const buttons = document.createElement('div');
      buttons.className = 'window-buttons';
      const closeBtn = document.createElement('button'); closeBtn.textContent = 'X';
      const minBtn = document.createElement('button'); minBtn.textContent = '_';
      buttons.appendChild(minBtn); 
      buttons.appendChild(closeBtn);
      header.appendChild(buttons);
      win.appendChild(header);

      // Add iframe to load content (PDF, HTML, website, YouTube, etc.)
      const iframe = document.createElement('iframe');
      iframe.src = url;
      win.appendChild(iframe);

      // Add window to the container
      container.appendChild(win);

      // --- Dragging logic ---
      let isDragging = false, offsetX, offsetY;
      header.onmousedown = (e) => {
        if(e.target.tagName==='BUTTON') return; // don't drag when clicking buttons
        isDragging = true;
        offsetX = e.clientX - win.offsetLeft;
        offsetY = e.clientY - win.offsetTop;
        win.style.zIndex = ++highestZ; // bring window on top while dragging
      };
      document.onmousemove = (e) => {
        if (!isDragging) return;
        win.style.left = e.clientX - offsetX + 'px';
        win.style.top = e.clientY - offsetY + 'px';
      };
      document.onmouseup = () => { isDragging = false; };

      // --- Close button ---
      closeBtn.onclick = () => win.remove();

      // --- Minimize button ---
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
