/* script.js para InmoDigitalStudio */
/* ---------------------------------------------------
 - loadAndRenderProperties() -> carga JSON y renderiza tarjetas
 - applyFilters() -> lee formularios y filtra
 - openPropertyModal(id) -> abre modal con Swiper para una propiedad
---------------------------------------------------- */

window.properties = []; // global
window.currentModalSwiper = null;

async function loadAndRenderProperties(){
  try{
    const res = await fetch('propiedades.json');
    const data = await res.json();
    window.properties = data;
    renderPropertyCards(data);
  }catch(e){
    console.error('Error cargando propiedades:', e);
    document.getElementById('resultados').innerHTML = '<p>Error cargando propiedades.</p>';
  }
}

function renderPropertyCards(list){
  const container = document.getElementById('resultados');
  if(!container) return;
  container.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'prop-card';
    card.innerHTML = `
      <img src="${p.imagenes[0]}" alt="${p.titulo}">
      <div class="info">
        <h3>${p.titulo}</h3>
        <p><strong>${p.precio} ${p.moneda}</strong></p>
        <p>${p.ubicacion} • ${p.habitaciones} hab • ${p.superficie} m²</p>
        <p class="desc">${p.descripcion.substring(0,110)}...</p>
        <div style="margin-top:8px;">
          <button class="btn" data-id="${p.id}">Ver ficha</button>
          <a class="btn btn-outline" href="https://wa.me/5492236859865?text=${encodeURIComponent('Hola Lucas, quiero info sobre ' + p.titulo)}" target="_blank" rel="noopener noreferrer">Contactar</a>
        </div>
      </div>`;
    container.appendChild(card);

    // Listener para abrir modal
    card.querySelector('button').addEventListener('click', ()=>openPropertyModal(p.id));
  });
}

function applyFilters(){
  const ref = document.getElementById('f-ref')?.value.trim().toLowerCase() || '';
  const ubic = document.getElementById('f-ubicacion')?.value || '';
  const pmin = Number(document.getElementById('f-precio-min')?.value || 0);
  const pmax = Number(document.getElementById('f-precio-max')?.value || 999999999);
  const habs = Number(document.getElementById('f-habs')?.value || 0);
  const sup = Number(document.getElementById('f-super')?.value || 0);

  const resultados = window.properties.filter(p=>{
    if(ref && !p.id.toLowerCase().includes(ref) && !p.titulo.toLowerCase().includes(ref)) return false;
    if(ubic && p.ubicacion !== ubic) return false;
    if(p.precio < pmin || p.precio > pmax) return false;
    if(habs && p.habitaciones !== habs) return false;
    if(sup && p.superficie < sup) return false;
    return true;
  });

  renderPropertyCards(resultados);
}

/* Modal + Swiper */
function openPropertyModal(id){
  const prop = window.properties.find(x=>x.id==id);
  if(!prop) return alert('Propiedad no encontrada');
  const modal = document.getElementById('modal');
  const slidesContainer = document.getElementById('modal-slides');
  const info = document.getElementById('modal-info');

  slidesContainer.innerHTML = '';
  prop.imagenes.forEach(src=>{
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover">`;
    slidesContainer.appendChild(slide);
  });

  info.innerHTML = `
    <h2>${prop.titulo}</h2>
    <p><strong>${prop.precio} ${prop.moneda}</strong></p>
    <p>${prop.ubicacion} • ${prop.habitaciones} hab • ${prop.superficie} m²</p>
    <p style="margin-top:10px">${prop.descripcion}</p>
    <div style="margin-top:20px">
      <a class="btn" href="https://wa.me/5492236859865?text=${encodeURIComponent('Hola Lucas, quiero info sobre ' + prop.titulo)}" target="_blank" rel="noopener noreferrer">Contactar</a>
      <button class="btn btn-outline" style="margin-left:8px" onclick="location.href='mailto:quirogalucas_realstate@gmail.com?subject=${encodeURIComponent('Consulta '+prop.titulo)}'">Enviar email</button>
    </div>
  `;

  // show modal
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');

  // Init Swiper (destroy old if exists)
  if(window.currentModalSwiper){ window.currentModalSwiper.destroy(true,true); window.currentModalSwiper = null; }
  window.currentModalSwiper = new Swiper('#modal-swiper', {
    loop:true, navigation:{ nextEl:'.swiper-button-next', prevEl:'.swiper-button-prev' },
    spaceBetween:10
  });
}

/* Close modal */
document.addEventListener('click', (e)=>{
  const modal = document.getElementById('modal');
  if(!modal) return;
  if(e.target.matches('#modal-close') || (e.target === modal)) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    if(window.currentModalSwiper){ window.currentModalSwiper.destroy(true,true); window.currentModalSwiper = null; }
  }
});

/* Expose helper to global for index slide clicks */
window.openPropertyModal = openPropertyModal;

/* On propiedades page load -> fetch and render */
document.addEventListener('DOMContentLoaded', ()=>{
  // if resultados container exists, load properties
  if(document.getElementById('resultados')) loadAndRenderProperties();
});
