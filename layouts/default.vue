
<template>
<div>
  <div class="card">
    <MegaMenu
      :model="items"
      class="bg-surface-0 megamenu-container"
      style="
        border-radius: 3rem;
        --p-megamenu-horizontal-orientation-padding: 0.75rem 1rem;
        --p-megamenu-gap: 2rem;
      "
    >
      <template #start>
        <h1
          class="flex flex-row items-center gap-3 justify-center font-extrabold leading-none text-green-600 sm:text-sm md:text-2xl xl:text-3xl lg:text-3xl tracking-normal"
        >
          Brasil
          <mark
            class="px-2 py-2 text-white bg-yellow-300 rounded-sm dark:bg-yellow-500"
            >hub</mark
          >
        </h1>
      </template>
      <template #item="{ item }">
        <a
          v-if="item.root"
          class="flex items-center justify-center cursor-pointer px-4 py-2 overflow-hidden relative font-semibold text-lg"
          style="border-radius: 2rem"
        >
          <span>{{ item.label }}</span>
          <svg
            v-if="item.items"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="p-icon p-menubar-submenu-icon"
            aria-hidden="true"
            data-pc-section="submenuicon"
          >
            <path
              d="M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
        <a
          v-else-if="!item.image"
          class="flex items-center p-4 cursor-pointer mb-2 gap-3"
        >
          <span
            class="inline-flex items-center justify-center rounded-full bg-primary text-primary-contrast w-12 h-12"
            style="--p-primary-color: #009739)"
          >
           <Icon :name="item.icon" :class="['text-lg', 'dark:text-white opacity-100']"/>
          </span>
          <span class="inline-flex flex-col gap-1">
            <span class="font-bold text-lg">{{ item.label }}</span>
            <span class="whitespace-nowrap">{{ item.subtext }}</span>
          </span>
        </a>
        <div v-else class="flex flex-col items-start gap-4 p-2">
          <img alt="megamenu-demo" :src="item.image" class="w-full" />
          <span>{{ item.subtext }}</span>
          <Button :label="item.label" outlined />
        </div>
      </template>
      <template #end>
        <Button :icon="!isDark ? 'pi pi-sun' : 'pi pi-moon'" aria-="Save" :outlined=isDark severity="secondary" rounded size="small" @click="toggleDarkMode()" />
      </template>
    </MegaMenu>
   
  </div>
   <div class="content">
      <slot />
    </div>
    </div>
</template>
<script setup>
import Button from 'primevue/button';
import MegaMenu from 'primevue/megamenu';

import { ref } from "vue";
const isDark = ref(true);
const items = ref([
  {
    label: "Company",
    root: true,
    icon: "pi pi-user",
    items: [
      [
        {
          items: [
            {
              label: "Features",
              icon: "Calculator",
              subtext: "Subtext of item",
            },
            {
              label: "Customers",
              icon: "Users",
              subtext: "Subtext of item",
            },
            {
              label: "Case Studies",
              icon: "File",
              subtext: "Subtext of item",
            },
          ],
        },
      ],
      [
        {
          items: [
            {
              label: "Solutions",
              icon: "Shield",
              subtext: "Subtext of item",
            },
            {
              label: "Faq",
              icon: "TableOfContents",
              subtext: "Subtext of item",
            },
            {
              label: "Library",
              icon: "Search",
              subtext: "Subtext of item",
            },
          ],
        },
      ],
      [
        {
          items: [
            {
              label: "Community",
              icon: "MessageCircle",
              subtext: "Subtext of item",
            },
            {
              label: "Rewards",
              icon: "Star",
              subtext: "Subtext of item",
            },
            {
              label: "Investors",
              icon: "Globe",
              subtext: "Subtext of item",
            },
          ],
        },
      ],
    ],
  },
  {
    label: "Resources",
    root: true,
  },
  {
    label: "Contact",
    root: true,
  },
]);

const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle("my-app-dark");
};
</script>

<style scoped>
.megamenu-container {
  width: 70%;
  margin: 1.25rem auto;
}
</style>
