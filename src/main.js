import './style.css';

(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const power = n => 2 ** n;
  const fmt = n => n.toLocaleString('es-CL');
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const examples = [5, 9, 13, 19, 25, 42, 73, 100, 127, 180, 255, 512, 1023, 2026, 4095, 65535];
  // Builder
  let bitWidth = 8, bitValue = 13;
  function drawBuilder() {
    const root = $('bitsBuilder'); root.innerHTML = '';
    root.classList.toggle('cols-4', bitWidth === 4);
    for (let position = bitWidth - 1; position >= 0; position--) {
      const val = power(position), on = Boolean(bitValue & val), button = document.createElement('button');
      button.type = 'button'; button.className = 'bit-switch' + (on ? ' on' : ''); button.setAttribute('aria-pressed', String(on)); button.setAttribute('aria-label', 'Bit de valor ' + val + ': ' + (on ? 'encendido' : 'apagado')); button.innerHTML = '<span class="bit-num">' + (on ? '1' : '0') + '</span><span class="bit-power">' + fmt(val) + '</span>';
      button.addEventListener('click', () => { bitValue = bitValue ^ val; drawBuilder(); }); root.append(button);
    }
    $('builderBinary').textContent = bitValue.toString(2).padStart(bitWidth, '0');
    $('builderDecimal').textContent = fmt(bitValue);
    const selected = []; for (let p = bitWidth - 1; p >= 0; p--)if (bitValue & power(p)) selected.push(fmt(power(p)));
    $('builderSum').textContent = selected.length ? selected.join(' + ') + ' = ' + fmt(bitValue) : 'Ningún bit encendido: 0 = 0';
    document.querySelectorAll('[data-width]').forEach(btn => { let active = Number(btn.dataset.width) === bitWidth; btn.classList.toggle('active', active); btn.setAttribute('aria-pressed', String(active)); });
  }
  document.querySelectorAll('[data-width]').forEach(btn => btn.addEventListener('click', () => { bitWidth = Number(btn.dataset.width); bitValue = bitValue % (2 ** bitWidth); drawBuilder(); }));
  $('resetBuilder').addEventListener('click', () => { bitValue = 0; drawBuilder(); }); drawBuilder();
  // Decimal to binary
  function displayDecimal() {
    const raw = $('decimalInput').value.trim(), n = Number(raw);
    if (!/^\d+$/.test(raw) || !Number.isSafeInteger(n) || n < 0 || n > 65535) {
      $('decimalError').textContent = 'Ingresa un número entero entre 0 y 65.535.'; $('decimalInput').classList.add('invalid'); $('decimalResult').textContent = '—'; $('divisionSteps').innerHTML = ''; $('remaindersExplanation').textContent = ''; $('decimalPowers').textContent = ''; return;
    }
    $('decimalError').textContent = ''; $('decimalInput').classList.remove('invalid');
    const bin = n.toString(2); $('decimalResult').textContent = bin;
    let x = n, steps = [];
    if (n === 0) steps = [{ a: 0, q: 0, r: 0 }];
    else while (x > 0) { let q = Math.floor(x / 2), r = x % 2; steps.push({ a: x, q, r }); x = q; }
    $('divisionSteps').innerHTML = steps.map((s, i) => '<div class="trace"><span class="index">' + (i + 1) + '</span><span>' + s.a + ' ÷ 2 = ' + s.q + '</span><span class="remainder">resto ' + s.r + '</span></div>').join('');
    const rests = steps.map(s => s.r).join(' → ');
    $('remaindersExplanation').innerHTML = '<strong>Restos obtenidos:</strong> ' + rests + '<br><strong>Léelos en orden inverso:</strong> ' + bin + '<br><span class="remainder-note">' + (n === 0 ? 'Caso especial: cero se representa con un solo 0.' : 'Empieza por el último resto obtenido.') + '</span>';
    const powers = []; for (let p = bin.length - 1; p >= 0; p--)if ((n & power(p)) !== 0) powers.push(power(p));
    $('decimalPowers').innerHTML = (powers.length ? powers.map(v => '<span class="pow-pill">' + fmt(v) + '</span>').join('') : '<span class="pow-pill zero">Sin posiciones encendidas</span>') + '<div class="guide">' + (powers.length ? powers.map(fmt).join(' + ') : '0') + ' = ' + fmt(n) + '</div>';
  }
  $('decimalInput').addEventListener('input', displayDecimal);
  $('exampleDecimal').addEventListener('click', () => { $('decimalInput').value = examples[randomInt(0, examples.length - 1)]; displayDecimal(); }); displayDecimal();
  // Binary to decimal
  function displayBinary() {
    const raw = $('binaryInput').value.trim();
    if (!/^[01]{1,16}$/.test(raw)) {
      $('binaryError').textContent = 'Usa únicamente 0 y 1 (entre 1 y 16 dígitos).'; $('binaryInput').classList.add('invalid'); $('binaryResult').textContent = '—'; $('binaryBreakdown').innerHTML = ''; $('binarySum').textContent = ''; return;
    }
    $('binaryError').textContent = ''; $('binaryInput').classList.remove('invalid');
    const n = parseInt(raw, 2); $('binaryResult').textContent = fmt(n);
    let rows = [], parts = [];
    for (let i = 0; i < raw.length; i++) {
      let bit = Number(raw[i]), position = raw.length - i - 1, val = power(position), add = val * bit;
      if (bit === 1) parts.push(fmt(val));
      rows.push('<tr><td>Desde la derecha: ' + position + '</td><td><code>' + bit + '</code></td><td>2<sup>' + position + '</sup> = ' + fmt(val) + '</td><td><strong class="' + (bit ? 'bit-on' : 'bit-off') + '">' + fmt(add) + '</strong></td></tr>');
    }
    $('binaryBreakdown').innerHTML = rows.join(''); $('binarySum').innerHTML = '<strong>Suma final:</strong> ' + (parts.join(' + ') || '0') + ' = ' + fmt(n);
  }
  $('binaryInput').addEventListener('input', displayBinary);
  $('binaryExample').addEventListener('click', () => { $('binaryInput').value = examples[randomInt(0, examples.length - 1)].toString(2); displayBinary(); }); displayBinary();
  // Practice
  let level = 'easy', attempts = 0, correct = 0, task = null, answered = false;
  function newQuestion() {
    const max = level === 'easy' ? 15 : level === 'medium' ? 255 : 4095;
    const n = randomInt(level === 'easy' ? 1 : 0, max), dir = Math.random() < .5 ? 'toBinary' : 'toDecimal';
    task = { n, dir }; answered = false; $('practiceAnswer').value = ''; $('practiceAnswer').classList.remove('invalid'); $('practiceFeedback').textContent = ''; $('practiceFeedback').className = 'feedback';
    $('practiceQuestion').innerHTML = dir === 'toBinary' ? 'Convierte <code>' + n + '</code> de decimal a binario.' : 'Convierte <code>' + n.toString(2) + '</code> de binario a decimal.';
    $('practiceAnswer').placeholder = dir === 'toBinary' ? 'Ejemplo: 1011' : 'Ejemplo: 11';
    $('practiceAnswer').setAttribute('aria-label', dir === 'toBinary' ? 'Respuesta en binario' : 'Respuesta en decimal');
  }
  function getExplanation() {
    const binary = task.n.toString(2);
    const items = []; for (let p = binary.length - 1; p >= 0; p--)if (task.n & power(p)) items.push(power(p));
    return 'El número ' + task.n + ' equivale a ' + binary + ' en binario. ' + (items.length ? 'Las posiciones encendidas suman ' + items.join(' + ') + ' = ' + task.n + '.' : 'No hay bits encendidos.');
  }
  function checkAnswer() {
    if (!task || answered) return;
    const raw = $('practiceAnswer').value.trim();
    const valid = task.dir === 'toBinary' ? /^[01]+$/.test(raw) : /^\d+$/.test(raw);
    if (!valid) { $('practiceFeedback').className = 'feedback bad'; $('practiceFeedback').textContent = task.dir === 'toBinary' ? 'Escribe únicamente 0 y 1.' : 'Escribe un número decimal entero no negativo.'; return; }
    const response = task.dir === 'toBinary' ? parseInt(raw, 2) : Number(raw);
    // Validar sin desbordamiento y aceptar ceros iniciales en las representaciones binarias.
    const yes = Number.isSafeInteger(response) && response === task.n;
    attempts++; if (yes) correct++; answered = true;
    $('practiceScore').textContent = correct + ' correctos de ' + attempts + ' intentos';
    $('practiceFeedback').className = 'feedback ' + (yes ? 'good' : 'bad');
    $('practiceFeedback').textContent = (yes ? 'Correcto. ' : 'No coincide. ') + getExplanation();
  }
  document.querySelectorAll('[data-level]').forEach(btn => btn.addEventListener('click', () => { level = btn.dataset.level; document.querySelectorAll('[data-level]').forEach(el => { let active = el === btn; el.classList.toggle('active', active); el.setAttribute('aria-pressed', String(active)); }); newQuestion(); }));
  $('checkAnswer').addEventListener('click', checkAnswer);
  $('practiceAnswer').addEventListener('keydown', event => { if (event.key === 'Enter') checkAnswer(); });
  $('nextQuestion').addEventListener('click', newQuestion);
  $('practiceHint').addEventListener('click', () => { if (!task) return; $('practiceFeedback').className = 'feedback'; $('practiceFeedback').textContent = task.dir === 'toBinary' ? 'Divide sucesivamente entre 2, guarda los restos y léelos en orden inverso.' : 'Asigna 1 al último bit de la derecha y duplica el valor de cada posición hacia la izquierda. Suma las posiciones con 1.'; });
  $('practiceSolution').addEventListener('click', () => { if (!task) return; answered = true; $('practiceFeedback').className = 'feedback'; $('practiceFeedback').textContent = getExplanation() + ' (La solución mostrada no cuenta como intento.)'; });
  newQuestion();
  // Chapter navigation follows scrolling
  const links = [...document.querySelectorAll('.chapters a')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id)); } }); }, { rootMargin: '-24% 0px -64% 0px' });
    document.querySelectorAll('.lesson').forEach(el => observer.observe(el));
  }
})();
