/* PaseCalendar — calendario mensual sin dependencias.
   PaseCalendar.mount(el, { eventos, selected, onDay(key, evs), onEvent(ev) })
   eventos: [{ id, nombre, fecha:'YYYY-MM-DD', hora:'20:00', pax, color? }]
   Todo el texto entra con textContent: los nombres de eventos nunca se interpretan como HTML. */
(function (g) {
  const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const DIAS = ['L','M','X','J','V','S','D'];
  const pad = n => String(n).padStart(2, '0');
  const keyOf = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
  function el(tag, cls, txt) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function mount(root, opts = {}) {
    let eventos = opts.eventos || [];
    const hoy = new Date();
    const hoyKey = keyOf(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    let y = hoy.getFullYear(), m = hoy.getMonth(), sel = opts.selected || null;
    if (sel) { const p = sel.split('-'); y = +p[0]; m = +p[1] - 1; }

    function porDia() {
      const map = {};
      eventos.forEach(e => { (map[e.fecha] = map[e.fecha] || []).push(e); });
      Object.values(map).forEach(a => a.sort((p, q) => String(p.hora || '').localeCompare(String(q.hora || ''))));
      return map;
    }
    function cambiarMes(delta) {
      m += delta;
      if (m < 0) { m = 11; y--; } else if (m > 11) { m = 0; y++; }
      sel = null; render();
    }
    function render() {
      const map = porDia();
      root.replaceChildren();

      const head = el('div', 'cal-head');
      const prev = el('button', 'btn btn-icon btn-sec', '‹'); prev.type = 'button';
      prev.setAttribute('aria-label', 'Mes anterior'); prev.onclick = () => cambiarMes(-1);
      const next = el('button', 'btn btn-icon btn-sec', '›'); next.type = 'button';
      next.setAttribute('aria-label', 'Mes siguiente'); next.onclick = () => cambiarMes(1);
      const title = el('h2', 'cal-title', `${MESES[m]} ${y}`);
      title.setAttribute('aria-live', 'polite');
      head.append(prev, title, next);

      const grid = el('div', 'cal-grid');
      DIAS.forEach(d => grid.append(el('div', 'cal-dow', d)));
      const offset = (new Date(y, m, 1).getDay() + 6) % 7; // semana empieza en lunes
      const dim = new Date(y, m + 1, 0).getDate();
      for (let i = 0; i < offset; i++) grid.append(el('div', 'cal-cell cal-empty'));
      for (let d = 1; d <= dim; d++) {
        const k = keyOf(y, m, d), evs = map[k] || [];
        const cell = el('button', 'cal-cell' + (k === hoyKey ? ' cal-today' : '') + (k === sel ? ' cal-sel' : ''));
        cell.type = 'button';
        cell.setAttribute('aria-label', `${d} de ${MESES[m]}` + (evs.length ? `, ${evs.length} evento${evs.length > 1 ? 's' : ''}` : ''));
        cell.append(el('span', 'cal-num', d));
        if (evs.length) {
          const dots = el('span', 'cal-dots');
          evs.slice(0, 3).forEach(e => { const dot = el('i', 'cal-dot'); if (e.color) dot.style.setProperty('--c', e.color); dots.append(dot); });
          cell.append(dots);
          evs.slice(0, 2).forEach(e => {
            const chip = el('span', 'cal-chip', `${e.hora || ''} ${e.nombre}`.trim());
            if (e.color) chip.style.setProperty('--c', e.color);
            cell.append(chip);
          });
          if (evs.length > 2) cell.append(el('span', 'cal-more', `+${evs.length - 2} más`));
        }
        cell.onclick = () => { sel = k; render(); if (opts.onDay) opts.onDay(k, evs); };
        grid.append(cell);
      }
      root.append(head, grid);

      if (sel) {
        const evs = map[sel] || [];
        const det = el('section', 'cal-detail');
        const [sy, sm, sd] = sel.split('-');
        det.append(el('h2', null, `${+sd} de ${MESES[+sm - 1]} ${sy}`));
        if (!evs.length) det.append(el('p', 'muted', 'Sin eventos este día.'));
        evs.forEach(e => {
          const b = el('button', 'list-item cal-ev'); b.type = 'button';
          if (e.color) b.style.setProperty('--c', e.color);
          const box = el('span');
          box.append(el('strong', null, e.nombre), el('span', 'muted', `${e.hora || ''}${e.pax ? ' · ' + e.pax + ' pax' : ''}`));
          b.append(box);
          b.onclick = () => { if (opts.onEvent) opts.onEvent(e); };
          det.append(b);
        });
        root.append(det);
      }
    }
    render();
    return { setEventos(e) { eventos = e || []; render(); }, render };
  }
  g.PaseCalendar = { mount };
})(window);
