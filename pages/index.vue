<template>

  <div class="center-container grid grid-cols-5 gap-4">
    <h1 class="text-3xl font-semibold text-green-600  col-span-5">Calculadoras Financeiras</h1>
    <span class="text-gray-400 mb-8 col-span-5 "> Escolha uma calculadora do acesso rápido para começar </span>
    <FastAccess class="col-span-5"/>
  </div>
</template>


<script setup>
useHead({
  title: 'Brasil Hub - Calculadoras Financeiras Online Gratuitas',
  meta: [
    {
      name: 'description',
      content: 'Acesse gratuitamente calculadoras financeiras como IRPF, custo CLT, poupança, rescisão e correção IPCA. Ferramentas atualizadas e fáceis de usar.'
    },
    {
      property: 'og:title',
      content: 'Brasil Hub - Calculadoras Financeiras'
    },
    {
      property: 'og:description',
      content: 'Escolha uma das nossas calculadoras online para simular impostos, rendimentos e encargos trabalhistas.'
    },
    {
      property: 'og:image',
      content: 'https://seusite.com/static/home.png'
    },
    {
      property: 'og:url',
      content: 'https://brasilhub.net'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'Brasil Hub - Calculadoras Financeiras'
    },
    {
      name: 'twitter:description',
      content: 'Simule IRPF, custo CLT, poupança e muito mais de forma gratuita.'
    },
    {
      name: 'twitter:image',
      content: 'https://seusite.com/static/home.png'
    }
  ],
  htmlAttrs: {
    lang: 'pt-BR'
  }
})
</script>