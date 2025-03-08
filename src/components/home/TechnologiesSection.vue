<script setup>
import IconVueJS from "../icons/IconVueJS.vue";
import IconTailwindCSS from "../icons/IconTailwindCSS.vue";
import IconNetlify from "../icons/IconNetlify.vue";
import IconTMDB from "../icons/IconTMDB.vue";
import IconAxios from "../icons/IconAxios.vue";
</script>
<template>
  <div class="bg-gray-50 dark:bg-gray-700">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
        <div class="col-span-1 flex justify-center items-center md:col-span-2 lg:col-span-1">
          <IconVueJS class="h-12 grayscale hover:grayscale-0 transition ease-in-out duration-500" />
        </div>
        <div class="col-span-1 flex justify-center items-center md:col-span-2 lg:col-span-1">
          <IconTailwindCSS class="h-12 grayscale hover:grayscale-0 transition ease-in-out duration-5" />
        </div>
        <div class="col-span-1 flex justify-center items-center md:col-span-2 lg:col-span-1">
          <IconNetlify class="h-12 grayscale hover:grayscale-0 transition ease-in-out duration-5" />
        </div>
        <div class="col-span-1 flex justify-center items-center md:col-span-3 lg:col-span-1">
         <IconTMDB class="h-5 grayscale hover:grayscale-0 transition ease-in-out duration-5" />
        </div>
        <div class="col-span-2 flex justify-center items-center md:col-span-3 lg:col-span-1">
         <IconAxios class="h-5 grayscale hover:grayscale-0 transition ease-in-out duration-5" />
        </div>
      </div>
    </div>
  </div>
</template>
