<template>
  <section aria-label="A note from the developer" class="bg-surface px-6 py-32 lg:py-44">
    <div class="mx-auto max-w-[540px]">
      <img
        v-reveal
        src="https://github.com/Luigi-DV.png?size=96"
        alt="Luigelo Davila"
        width="48"
        height="48"
        loading="lazy"
        class="size-12 rounded-full bg-surface-2"
      />
      <div class="mt-8 space-y-6 leading-relaxed">
        <p v-reveal="1">I started Movie App in 2024 to learn Vue 3 and Pinia against a real API. It worked, but it showed its age: placeholder copy, an API key inside the bundle and filters that forgot themselves on every reload.</p>
        <p v-reveal="2">At the end of 2025 I rebuilt it the way I would build a product today. The key now lives behind a serverless function, answers are cached at the edge, and <mark class="bg-field-soft px-1 text-field">every filter is a link you can share</mark>.</p>
        <p v-reveal="3">The interface is a small design system: one typeface, one accent and nothing decorative that a film still can do better. Search is keyboard first, trailers open in place, and the watchlist needs no account.</p>
        <p v-reveal="4">Unit tests and browser tests run on every push. The case study walks through the decisions, and all of the code is on GitHub.</p>
      </div>
      <p v-reveal="5" class="mt-10 text-lead italic">Luigelo Davila</p>
      <p class="text-small text-soft">Software engineer, Ldvloper</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <RouterLink to="/about" class="btn btn-primary">Read the case study</RouterLink>
        <a href="https://github.com/Luigi-DV/vue-movies-api" class="btn btn-quiet" target="_blank" rel="noopener">View the code</a>
      </div>
    </div>
  </section>
</template>
