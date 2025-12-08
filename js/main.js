fetch('assets\data\library.json ')
  .then(res => res.json())
  .then(data => {
    const grid = document.querySelector('.grid');
    data.tiles.forEach(tile => {
      const div = document.createElement('div');
      div.className = 'tile';
      div.textContent = tile.title;
      div.onclick = () => {
        if(tile.content.startsWith('http')) {
          window.open(tile.content, '_blank');
        } else {
          window.open(tile.content, '_self'); // placeholder
        }
      }
      grid.appendChild(div);
    });
  });
