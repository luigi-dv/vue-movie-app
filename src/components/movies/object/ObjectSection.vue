<template>
  <!--Cast-->
  <CastSection :cast="this.cast"></CastSection>
  <ProductionCompaniesSection :productionCompanies="this.movie.production_companies"></ProductionCompaniesSection>

</template>

<script>
import CastSection from "./CastSection.vue";
import ProductionCompaniesSection from "./ProductionCompaniesSection.vue";
export default {
  components: {ProductionCompaniesSection, CastSection},
  props: {
    movie: {
          type: Object,
          required: true,
    },
    cast: {
      type: Object,
      required: true,
    },
    crew: {
      type: Object,
      required: true,
    }
  },
  name: "ObjectMovieSection",
}
</script>
