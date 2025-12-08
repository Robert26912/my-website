fetch('assets/data/library.json')
  .then(res => res.json())
  .then(data => {
    const grid = document.querySelector('.grid');
    const contentFrame = document.getElementById('contentFrame');

    data.tiles.forEach(tile => {
      const tileDiv = document.createElement('div');
      tileDiv.className = 'tile';
      tileDiv.textContent = tile.title;

      // Container for subtiles
      let subtilesDiv = null;
      if (tile.subtiles) {
        subtilesDiv = document.createElement('div');
        subtilesDiv.style.display = 'none';
        tile.subtiles.forEach(sub => {
          const subDiv = document.createElement('div');
          subDiv.className = 'subtile';
          subDiv.textContent = sub.title;

          // Load subtile content in iframe
          subDiv.onclick = (e) => {
            e.stopPropagation();
            contentFrame.src = sub.content;
          };

          subtilesDiv.appendChild(subDiv);
        });
      }

      // Tile click
      tileDiv.onclick = () => {
        if (subtilesDiv) {
          subtilesDiv.style.display = subtilesDiv.style.display === 'block' ? 'none' : 'block';
          // Optional: load tile homepage if defined
          if (tile.content) contentFrame.src = tile.content;
        } else if (tile.content) {
          contentFrame.src = tile.content;
        }
      };

      grid.appendChild(tileDiv);
      if (subtilesDiv) grid.appendChild(subtilesDiv);
    });
  })
  .catch(err => console.error("JSON ERROR:", err));
