# Binario Cero

[![Deploy a GitHub Pages](https://github.com/marceloriv/Binario-Cero/actions/workflows/deploy.yml/badge.svg)](https://github.com/marceloriv/Binario-Cero/actions/workflows/deploy.yml)

Laboratorio interactivo, en español, para entender los números binarios desde cero: bits, potencias de 2, conversión entre decimal y binario, y práctica guiada. No requiere saber programación.

**Demo:** <https://marceloriv.github.io/Binario-Cero/>

## Qué incluye

Cinco capítulos en una sola página:

1. **El origen:** por qué existen los ceros y unos, y cómo crecen los valores al duplicarse.
2. **Enciende bits:** un panel de interruptores (4, 8 o 16 bits) que muestra el número binario, el decimal y la suma de potencias.
3. **Convierte:** decimal a binario por divisiones sucesivas entre 2, con cada resto a la vista (0 a 65.535).
4. **Lee binarios:** binario a decimal con el desglose de cada posición (hasta 16 bits).
5. **Practica:** ejercicios en tres niveles, con pista, solución paso a paso y marcador.

Funciona sin conexión una vez cargado: las fuentes están alojadas en el propio sitio, sin CDN, sin cuentas ni analítica.

## Tecnología

- JavaScript, HTML y CSS planos (DOM nativo, sin framework).
- [Vite](https://vite.dev/) como bundler y servidor de desarrollo.
- [pnpm](https://pnpm.io/) como gestor de paquetes.
- GitHub Actions y GitHub Pages para el despliegue; Dependabot para las dependencias.

## Desarrollo local

Requiere Node 22 o superior y pnpm.

```bash
pnpm install --frozen-lockfile   # instalar dependencias
pnpm dev                         # servidor local con recarga en caliente
pnpm build                       # build de producción en dist/
pnpm preview                     # previsualizar el build
```

## Estructura

```text
index.html        # página única con todo el contenido
src/main.js       # lógica interactiva
src/style.css     # todo el CSS (sin estilos inline)
public/fonts/     # fuentes autoalojadas
vite.config.js    # base relativa para funcionar en cualquier subruta de Pages
.github/          # workflow de despliegue y configuración de Dependabot
```

## Despliegue

Cada push a `main` ejecuta [`deploy.yml`](.github/workflows/deploy.yml): instala con el lockfile, compila y publica `dist/` en GitHub Pages. Se puede lanzar a mano con `gh workflow run deploy.yml --ref main`.

## Contribuir

Las reglas del proyecto (ramas, commits, estilo, seguridad y límites para agentes de código) están en [`AGENTS.md`](AGENTS.md). Resumen: el trabajo parte de `develop` y entra por pull request; `main` es producción.
