fetch('assets/data/library.json')
  .then(res => res.json())
  .then(data => {
    const grid = document.querySelector('.grid');

    data.tiles.forEach(tile => {
      const tileDiv = document.createElement('div');
      tileDiv.className = 'tile';
      tileDiv.textContent = tile.title;

      // Create a container for subtiles if they exist
      let subtilesDiv = null;
      if (tile.subtiles) {
        subtilesDiv = document.createElement('div');
        subtilesDiv.className = 'subtiles';
        subtilesDiv.style.display = 'none'; // hidden by default

        tile.subtiles.forEach(sub => {
          const subDiv = document.createElement('div');
          subDiv.className = 'subtile';
          subDiv.textContent = sub.title;

          // Always open subtiles in a new page/tab
          subDiv.onclick = (e) => {
            e.stopPropagation(); // prevent parent tile toggle
            window.open(sub.content, '_blank');
          };

          subtilesDiv.appendChild(subDiv);
        });
      }

      // Tile click: toggle subtiles if they exist, otherwise open content
      tileDiv.onclick = () => {
        if (subtilesDiv) {
          subtilesDiv.style.display = subtilesDiv.style.display === 'block' ? 'none' : 'block';
        } else if (tile.content) {
          // open main tile content in a new page if no subtiles
          window.open(tile.content, '_blank');
        }
      };

      grid.appendChild(tileDiv);
      if (subtilesDiv) grid.appendChild(subtilesDiv);
    });
  })
  .catch(err => console.error("JSON ERROR:", err));
