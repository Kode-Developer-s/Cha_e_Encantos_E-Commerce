<template>
  <section class="view content-view split-view">
    <div class="section-heading">
      <p class="eyebrow">Nossa História</p>
      <h2>Uma marca criada para transformar o chá em momentos de aconchego e bem-estar.</h2>
    </div>

    <div class="about-layout">
      <div class="about-copy">
        <p>
          A Chá e Encantos nasceu do desejo de transformar cada xícara  em uma
          pausa,aconchego e bem-estar. Nossos blends são produzidos em pequenos lotes cuidando de cada detalhe,
          do aroma envolvente ao equilíbrio perfeito do sabor, valorizando a qualidade e origem dos ingredientes.
          Mais do que chá, criamos experiências que convidam você desacelerar e aproveitar cada instante.
        </p>
        <p>
          A curadoria combina tradição, experimentação e cuidado: flores para suavidade,
          raízes para profundidade, especiarias para intensidade e folhas selecionados para frescor e equilíbrio.
      </div>

      <div class="values-grid" aria-label="Valores da marca">
        <article>
          <span>01</span>
          <h3>Ingredientes rastreáveis</h3>
          <p>Selecionamos fornecedores confiáveis e trabalhamos com pequenos lotes pra garantir qualidade e frescor.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Blends autorais</h3>
          <p>Receitas desenvolvidas para proporcionar equilíbrio, aroma marcante e uma experiência sensorial única </p>
        </article>
        <article>
          <span>03</span>
          <h3>Cuidado em cada envio</h3>
          <p>Embalagens pensadas para preservar o frescor dos ingredientes e tornar cada entrega especial</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  const cards = document.querySelectorAll(".values-grid article");

  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("show");
    }, index * 200);
  });
});
</script>

<style scoped>
.about-copy p {
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: var(--text-color, #555555);
}

.values-grid {
  display: grid;
  gap: 1.5rem;
}

.values-grid article {
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.values-grid article:hover {
  transform: translateY(-4px);

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.values-grid span {
  display: inline-block;

  margin-bottom: 0.75rem;

  font-weight: 700;

  color: #8b5e3c;
}

.values-grid h3 {
  margin-bottom: 0.75rem;
}

.values-grid p {
  line-height: 1.6;
  opacity: 0.85;
}

@media (max-width: 768px) {
  .values-grid {
    grid-template-columns: 1fr;
  }
}
</style>
