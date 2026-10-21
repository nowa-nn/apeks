<script setup lang="ts">
import data from '~/data/content.json'

type Page = (typeof data.pages)[number]
type Product = (typeof data.products)[number]
const route = useRoute()
const config = useRuntimeConfig()
const segments = computed(() => (Array.isArray(route.params.slug) ? route.params.slug : route.params.slug ? [route.params.slug] : []) as string[])
const variant = computed(() => ['v1','v2','v3'].includes(segments.value[0] || '') ? (segments.value[0] || '') : '')
const inner = computed(() => {
  const path = '/' + segments.value.slice(1).join('/')
  return path === '/' ? '/' : path.replace(/\/+$/, '')
})
const current = computed<Page | undefined>(() => data.pages.find(p => p.route.replace(/^\/(en\/)?products\?category=/, '/$1category/') === inner.value))
const product = computed<Product | undefined>(() => data.products.find(p => p.route === inner.value))
const isHome = computed(() => inner.value === '/')
const isCatalog = computed(() => inner.value === '/products' || inner.value.startsWith('/category/') || inner.value === '/en/products' || inner.value.startsWith('/en/category/'))
const isProduct = computed(() => !!product.value)
const categorySlugMap: Record<string,string> = {taheometry:'taheometry',antenny:'sensors',nivelity:'levels',kontrollery:'controllers','gnss-priemniki':'gnss',radiosvyaz:'radio',otrazhateli:'prisms','shtativy-vehi':'tripods',po:'software',aksessuary:'accessories'}
const categorySlugById: Record<string,string> = Object.fromEntries(Object.entries(categorySlugMap).map(([k,v])=>[v,k]))
const currentCategory = computed(() => {
  const slug = inner.value.split('/').pop() || ''
  const id = categorySlugMap[slug]
  return data.categories.find(c => c.id === id)
})
const categoryMatchers: Record<string,RegExp> = {gnss:/gnss-priemnik/,controllers:/kontroller|planshet/,taheometry:/taheometr/,levels:/nivelir/,sensors:/gnss-datchik|antenna/,radio:/radiomodem/,software:/programmnoe/,tripods:/shtativ|veha/,prisms:/prizma|otrazhatel/,accessories:/adapter/}
const filteredProducts = computed(() => currentCategory.value ? data.products.filter(p => categoryMatchers[currentCategory.value!.id]?.test(p.route)) : data.products)
const media = (source: string | null | undefined) => source ? `${config.app.baseURL}${source.replace(/^\//,'')}` : ''
const brand = (name: string) => media(`/brand/${name}`)
const modelImages = ['ap80.jpg','ap20.png','ap20ar.jpg','ap40.png','max5.png','ap60.png','ap10.png','ap30.png','aps1.jpg','ap50.png']
const productImage = (p: Product) => { const index = data.products.findIndex(item => item.route === p.route); return modelImages[index] ? brand(modelImages[index]) : media(p.image) }
const href = (path: string) => `/${variant.value}${path === '/' ? '' : path}`
const categoryHref = (id:string) => href(`/category/${categorySlugById[id] || id}`)
const activeVariantName = computed(() => ({v1:'Бренд и категории',v2:'Каталог',v3:'Прибор и технологии'} as Record<string,string>)[variant.value] || '')
const showcaseProducts = [data.products[0],data.products[3],data.products[11]].filter((p): p is Product => Boolean(p))
const positionWord = (count: number) => count % 10 === 1 && count % 100 !== 11 ? 'позиция' : (count % 10 >= 2 && count % 10 <= 4 && !(count % 100 >= 12 && count % 100 <= 14) ? 'позиции' : 'позиций')
const informational = computed(() => !isHome.value && !isCatalog.value && !isProduct.value)
const servicePages = [
  ['/arenda','Аренда'],['/test-drajv','Тест-драйв'],['/trade-in','Трейд-ин'],['/poverka','Поверка'],['/servis-i-podderzhka','Сервис'],['/dostavka-i-oplata','Доставка']
] as const
const currentTitle = computed(() => isHome.value ? 'Геодезическое оборудование APEKS' : product.value?.heading || currentCategory.value?.label || current.value?.heading || 'Страница APEKS')
useHead(() => ({title: variant.value ? `${currentTitle.value} — APEKS / ${activeVariantName.value}` : 'APEKS — три направления интернет-магазина'}))
</script>

<template>
  <div v-if="!variant" class="selector">
    <header class="selector-header"><div class="wrap selector-header-inner"><img :src="brand('logo.png')" alt="APEKS" /><span>Прототип интернет-магазина геодезического оборудования</span></div></header>
    <main class="wrap selector-main"><div class="selector-lead"><div><span class="label">Выбор направления</span><h1>Три варианта сайта APEKS</h1></div><p>У каждого варианта свой путь к товару и характер подачи. Ассортимент и состав страниц одинаковые.</p></div>
      <div class="variant-picker">
        <NuxtLink to="/v1" class="variant-option"><div class="option-visual option-photo"><img :src="brand('ru-hero.jpeg')" alt="Оборудование APEKS в полевых условиях" /><span>APEKS</span></div><div class="option-text"><small>Имиджевый магазин</small><h2>Бренд и категории</h2><p>Крупный полевой кадр, затем категории и ключевые модели. Спокойный вход для нового покупателя.</p><b>Открыть вариант <span>↗</span></b></div></NuxtLink>
        <NuxtLink to="/v2" class="variant-option"><div class="option-visual option-ledger"><div class="option-ledger-rail"><b>Категории</b><span>GNSS-приёмники</span><span>Тахеометры</span><span>Контроллеры</span></div><div class="option-ledger-list"><strong>Оборудование для геодезии</strong><div><img :src="brand('ap80.jpg')" alt=""><span>APEKS AP80 Pro</span><b>249 000 ₽</b></div><div><img :src="brand('ap40.png')" alt=""><span>APEKS AP40 Laser+</span><b>199 000 ₽</b></div><div><img :src="brand('ap20ar.jpg')" alt=""><span>APEKS AP20 AR</span><b>129 000 ₽</b></div></div></div><div class="option-text"><small>Товарный магазин</small><h2>Каталог с первого экрана</h2><p>Навигация по типу оборудования и компактный список моделей с ценами. Путь для тех, кто пришёл выбирать прибор.</p><b>Открыть вариант <span>↗</span></b></div></NuxtLink>
        <NuxtLink to="/v3" class="variant-option"><div class="option-visual option-instrument"><div class="option-instrument-copy"><small>APEKS · GNSS</small><strong>AP80 Pro</strong><span>Измерения за пределами привычного доступа</span></div><img :src="brand('ap80-large.jpg')" alt="GNSS-приёмник APEKS AP80 Pro" /></div><div class="option-text"><small>Подача производителя</small><h2>Прибор и технологии</h2><p>Крупная предметная съёмка AP80 Pro, сценарии полевой работы и обзор моделей по задачам.</p><b>Открыть вариант <span>↗</span></b></div></NuxtLink>
      </div><p class="selector-note">Демо для обсуждения направления дизайна. Заявки и оплата здесь не подключены.</p>
    </main>
  </div>

  <div v-else :class="['site',variant]">
    <div v-if="variant==='v1'" class="utility"><div class="wrap utility-inner"><span>Официальный представитель APEKS в России</span><div><span>Доставка по всей России</span><a href="tel:+79269730003">+7 (926) 973-00-03</a></div></div></div>
    <header class="site-header">
      <div class="wrap head-main">
        <NuxtLink :to="href('/')" class="brand-mark"><img :src="brand(variant==='v2' ? 'logo-dark.png' : 'logo.png')" alt="APEKS" /></NuxtLink>
        <div v-if="variant==='v2'" class="head-search">Поиск оборудования, модели или артикула <b>⌕</b></div>
        <nav class="main-nav" aria-label="Основная навигация">
          <NuxtLink :to="href('/products')">Каталог</NuxtLink>
          <NuxtLink :to="href('/uslugi')">Услуги</NuxtLink>
          <NuxtLink :to="href('/o-kompanii')">О компании</NuxtLink>
          <NuxtLink :to="href('/contacts')">Контакты</NuxtLink>
        </nav>
        <div class="head-contact"><span v-if="variant==='v3'">ПОДБОР ОБОРУДОВАНИЯ</span><a href="tel:+79269730003">+7 (926) 973-00-03</a></div>
        <NuxtLink to="/" class="variant-back" aria-label="Выбор варианта">Все варианты <span>↗</span></NuxtLink>
      </div>
      <div v-if="variant==='v2'" class="v2-subnav"><div class="wrap"><span>Оборудование для геодезии и строительства</span><div><NuxtLink :to="href('/dostavka-i-oplata')">Доставка и оплата</NuxtLink><NuxtLink :to="href('/servis-i-podderzhka')">Сервис</NuxtLink><NuxtLink :to="href('/contacts')">Связаться</NuxtLink></div></div></div>

    </header>

    <main>
      <RedesignedHome v-if="isHome" :variant="variant" />

      <template v-else-if="isCatalog">
        <div class="wrap inner-page"><div class="breadcrumbs"><NuxtLink :to="href('/')">Главная</NuxtLink><span>/</span><NuxtLink :to="href('/products')">Каталог</NuxtLink><template v-if="currentCategory"><span>/</span><span>{{ currentCategory.label }}</span></template></div><div class="inner-head"><div><span class="eyebrow">ОБОРУДОВАНИЕ / APEKS</span><h1>{{ currentCategory?.label || 'Каталог оборудования' }}</h1><p>Приборы и принадлежности для точной работы в поле и на объекте.</p></div><span class="item-count">{{ filteredProducts.length }} ПОЗИЦИЙ</span></div><div class="catalog-layout"><aside class="catalog-side"><h3>Категории</h3><NuxtLink :to="href('/products')" :class="{'selected':!currentCategory}">Все товары <span>{{ data.products.length }}</span></NuxtLink><NuxtLink v-for="cat in data.categories" :key="cat.id" :to="categoryHref(cat.id)" :class="{'selected':currentCategory?.id===cat.id}">{{ cat.label }} <span>{{ cat.count }}</span></NuxtLink><div class="catalog-side-note">Нужна консультация по совместимости? <NuxtLink :to="href('/contacts')">Свяжитесь с нами ↗</NuxtLink></div></aside><div class="catalog-main"><div class="catalog-toolbar"><span>Оборудование APEKS и проверенные решения для геодезии</span><NuxtLink :to="href('/contacts')">Помочь с выбором →</NuxtLink></div><div class="catalog-products"><NuxtLink v-for="p in filteredProducts" :key="p.route" :to="href(p.route)" class="catalog-card"><div class="catalog-card-img"><img :src="productImage(p)" :alt="p.heading" /></div><div class="catalog-card-info"><h3>{{ p.heading }}</h3><p>{{ p.description }}</p><div><span>Подробнее о модели</span><b>↗</b></div></div></NuxtLink></div></div></div></div>
      </template>

      <template v-else-if="isProduct && product">
        <div class="wrap inner-page"><div class="breadcrumbs"><NuxtLink :to="href('/')">Главная</NuxtLink><span>/</span><NuxtLink :to="href('/products')">Каталог</NuxtLink><span>/</span><span>{{ product.heading }}</span></div><div class="detail"><div class="detail-gallery"><div class="detail-image"><img :src="productImage(product)" :alt="product.heading" /></div><div class="detail-thumbs"><img v-for="src in product.gallery.slice(0,4)" :key="src" :src="media(src)" :alt="product.heading" /></div></div><div class="detail-info"><span class="eyebrow">APEKS / ГЕОДЕЗИЧЕСКОЕ ОБОРУДОВАНИЕ</span><h1>{{ product.heading }}</h1><p class="detail-desc">{{ product.description }}</p><div class="detail-features"><div><span>Поставка</span><b>Под заказ и из наличия</b></div><div><span>Консультация</span><b>Подбор под вашу задачу</b></div><div><span>Поддержка</span><b>Сервис в России</b></div></div><div class="detail-action"><span>Стоимость по запросу</span><NuxtLink :to="href('/contacts')" class="btn btn-dark">Запросить предложение ↗</NuxtLink></div><p class="demo-caption">Демонстрационный экран. Форма заявки и оплата появятся в рабочей версии.</p></div></div><div class="detail-more"><div><span class="eyebrow">О МОДЕЛИ</span><h2>Для точной работы каждый день</h2></div><div><p v-for="(paragraph,index) in product.paragraphs.slice(0,3)" :key="index">{{ paragraph }}</p></div></div></div>
      </template>

      <template v-else-if="informational">
        <div class="wrap inner-page info-page"><div class="breadcrumbs"><NuxtLink :to="href('/')">Главная</NuxtLink><span>/</span><span>{{ currentTitle }}</span></div><div class="info-top"><div><span class="eyebrow">APEKS / ИНФОРМАЦИЯ</span><h1>{{ currentTitle }}</h1><p>{{ current?.description || 'Информация для клиентов и партнёров APEKS.' }}</p></div><div class="info-number">APEKS<br><span>GNSS</span></div></div><div class="info-body"><aside><span>НА ЭТОЙ СТРАНИЦЕ</span><div v-for="(heading,index) in current?.headings.slice(0,6)" :key="index">{{ heading }}</div></aside><article><template v-if="current?.paragraphs.length"><p v-for="(paragraph,index) in current.paragraphs" :key="index">{{ paragraph }}</p></template><p v-else>Подробная информация об этом направлении будет размещена при наполнении рабочего сайта. </p><div v-if="inner==='/contacts'" class="contact-info"><b>Связаться с APEKS</b><a href="tel:+79269730003">+7 (926) 973-00-03</a><span>Консультация по оборудованию, поставкам и сервису</span></div><div v-if="inner==='/uslugi'" class="info-services"><NuxtLink v-for="[path,label] in servicePages" :key="path" :to="href(path)">{{ label }} <span>↗</span></NuxtLink></div><NuxtLink v-if="inner!=='/contacts'" :to="href('/contacts')" class="btn btn-dark">Связаться с нами ↗</NuxtLink></article></div></div>
      </template>
    </main>

    <footer class="site-footer"><div class="wrap"><div class="footer-top"><div><NuxtLink :to="href('/')" class="brand-mark"><img :src="brand('logo.png')" alt="APEKS" /></NuxtLink><p>Геодезическое оборудование для точной работы.</p></div><div class="footer-links"><div><b>Оборудование</b><NuxtLink :to="href('/products')">Каталог</NuxtLink><NuxtLink :to="categoryHref('gnss')">GNSS-приёмники</NuxtLink><NuxtLink :to="categoryHref('taheometry')">Тахеометры</NuxtLink><NuxtLink :to="categoryHref('levels')">Нивелиры</NuxtLink></div><div><b>Компания</b><NuxtLink :to="href('/o-kompanii')">О компании</NuxtLink><NuxtLink :to="href('/uslugi')">Услуги</NuxtLink><NuxtLink :to="href('/servis-i-podderzhka')">Сервис</NuxtLink><NuxtLink :to="href('/contacts')">Контакты</NuxtLink></div><div><b>Информация</b><NuxtLink :to="href('/dostavka-i-oplata')">Доставка и оплата</NuxtLink><NuxtLink :to="href('/instrukcii')">Инструкции</NuxtLink><NuxtLink :to="href('/privacy')">Конфиденциальность</NuxtLink><NuxtLink :to="href('/karta-sajta')">Карта сайта</NuxtLink></div></div><div class="footer-contact"><span>КОНСУЛЬТАЦИЯ</span><a href="tel:+79269730003">+7 (926) 973-00-03</a><NuxtLink :to="href('/contacts')">Все контакты ↗</NuxtLink></div></div><div class="footer-bottom"><span>© APEKS. Демо-концепция интернет-магазина.</span><NuxtLink to="/">Выбрать другой вариант ↗</NuxtLink><span>{{ activeVariantName }} / 2026</span></div></div></footer>
  </div>
</template>



