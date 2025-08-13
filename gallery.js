(function(){
  const grid = document.getElementById('gallery-grid');
  if(!grid) return;

  function guessRepo(){
    const host = location.hostname; // user.github.io o dominio propio
    const path = location.pathname.replace(/^\/+|\/+$/g,''); // puede incluir repo
    let owner = '', repo = '', branch = 'main';

    if(window.GALLERY_CONFIG){
      return { ...window.GALLERY_CONFIG };
    }

    if(host.endsWith('github.io')){
      owner = host.split('.')[0] || '';
      // Project Pages: /repo/...
      const p = path.split('/').filter(Boolean);
      if(p.length >= 1) repo = p[0];
    }

    return { owner, repo, branch };
  }

  function infoBox(message){
    const box = document.createElement('div');
    box.className = 'card glass';
    box.style.marginTop = '16px';
    box.innerHTML = `<p class="muted">${message}</p>`;
    grid.parentElement.insertBefore(box, grid);
  }

  function render(images){
    if(!images.length){
      grid.innerHTML = '<p class="muted">No hay imágenes aún en docs/Galery.</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    images.forEach((src)=>{
      const figure = document.createElement('figure');
      figure.className = 'g-item';
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = src;
      img.alt = '';
      figure.appendChild(img);
      frag.appendChild(figure);
    });
    grid.innerHTML = '';
    grid.appendChild(frag);
  }

  async function load(){
    const { owner, repo, branch } = guessRepo();
    if(!owner || !repo){
      infoBox('No pude detectar el repositorio automáticamente. Agrega window.GALLERY_CONFIG = { owner: "tuUsuario", repo: "tuRepo", branch: "main" } en gallery.html.');
      return;
    }
    const path = './Galery';
    const api = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    try{
      const cached = JSON.parse(localStorage.getItem('gallery_cache')||'null');
      const now = Date.now();
      if(cached && (now - cached.time < 10*60*1000) && cached.api === api){
        render(cached.images);
      }
      const res = await fetch(api);
      if(!res.ok){
        throw new Error('GitHub API error '+res.status);
      }
      const data = await res.json();
      const images = (Array.isArray(data)?data:[])
        .filter(x=>x.type==='file' && /\.(png|jpe?g|webp|gif|svg)$/i.test(x.name))
        .map(x=>x.download_url);
      render(images);
      localStorage.setItem('gallery_cache', JSON.stringify({ time: now, api, images }));
    }catch(e){
      console.error(e);
      grid.innerHTML = '<p class="muted">No se pudo cargar la galería. Verifica que el repositorio sea público y exista la carpeta docs/Galery.</p>';
    }
  }

  load();
})();
