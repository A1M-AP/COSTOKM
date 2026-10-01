import { correlati } from '../correlati.mjs';

export default {
  path: '/404.html',
  outFile: '404.html',
  noindex: true,
  title: 'Pagina non trovata | costokm.it',
  description: 'La pagina che cerchi non esiste o è stata spostata.',
  h1: 'Pagina non trovata',
  body: () => `<div class="wrap">
<article class="article legal">
  <h1>Pagina non trovata</h1>
  <p>La pagina che cerchi non esiste o è stata spostata. Prova uno dei nostri strumenti:</p>
  ${correlati('')}
</article>
</div>`,
};
