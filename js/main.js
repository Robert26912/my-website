fetch('assets/data/library.json')
  .then(res => res.json())
  .then(data => {
    const grid = document.querySelector('.grid');

    data.tiles.forEach(tile => {
      const tileDiv = document.createElement('div');
      tileDiv.className = 'tile';
      tileDiv.textContent = tile.title;

      // Create a container for subtiles
      const subtilesDiv = document.createElement('div');
      subtilesDiv.className = 'subtiles';
      subtilesDiv.style.display = 'none'; // initially hidden

      if (tile.subtiles) {
        tile.subtiles.forEach(sub => {
          const subDiv = document.createElement('div');
          subDiv.className = 'subtile';
          subDiv.textContent = sub.title;

          subDiv.onclick = (e) => {
            e.stopPropagation(); // prevent tile click
            if (sub.content.startsWith('http')) {
              window.open(sub.content, '_blank');
            } else {
              window.location.href = sub.content;
            }
          };

          subtilesDiv.appendChild(subDiv);
        });
      }

      tileDiv.onclick = () => {
        // toggle subtiles if they exist
        if (tile.subtiles) {
          subtilesDiv.style.display = subtilesDiv.style.display === 'block' ? 'none' : 'block';
        } else {
          if (tile.content.startsWith('http')) {
            window.open(tile.content, '_blank');
          } else {
            window.location.href = tile.content;
          }
        }
      };

      grid.appendChild(tileDiv);
      grid.appendChild(subtilesDiv);
    });
  })
  .catch(err => console.error("JSON ERROR:", err));
