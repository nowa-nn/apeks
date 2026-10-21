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
const href = (path: string) => `/${variant.value}${path === '/' ? '' : path}`
const categoryHref = (id:string) => href(`/category/${categorySlugById[id] || id}`)
const activeVariantName = computed(() => ({v1:'Система',v2:'Каталог',v3:'Практика'} as Record<string,string>)[variant.value] || '')
const showcaseProducts = [data.products[0],data.products[3],data.products[11]].filter((p): p is Product => Boolean(p))
const positionWord = (count: number) => count % 10 === 1 && count % 100 !== 11 ? 'позиция' : (count % 10 >= 2 && count % 10 <= 4 && !(count % 100 >= 12 && count % 100 <= 14) ? 'позиции' : 'позиций')
const informational = computed(() => !isHome.value && !isCatalog.value && !isProduct.value)
const servicePages = [
  ['/arenda','Аренда'],['/test-drajv','Тест-драйв'],['/trade-in','Трейд-ин'],['/poverka','Поверка'],['/servis-i-podderzhka','Сервис'],['/dostavka-i-oplata','Доставка']
] as const
const currentTitle = computed(() => product.value?.heading || currentCategory.value?.label || current.value?.heading || 'Страница APEKS')
useHead(() => ({title: variant.value ? `${currentTitle.value} — APEKS / ${activeVariantName.value}` : 'APEKS — три направления интернет-магазина'}))
</script>

<template>
  <div v-if="!variant" class="selector">
    <header class="selector-header wrap">
      <div class="brand-mark">APEKS<span>GNSS</span></div>
      <div class="selector-header-note">ПРОТОТИП ИНТЕРНЕТ-МАГАЗИНА <span>21.10.2026</span></div>
    </header>
    <main class="selector-main wrap">
      <div class="selector-lead">
        <div class="eyebrow">ОБЗОР НАПРАВЛЕНИЙ / 01—03</div>
        <h1>Три подхода к магазину геодезического оборудования</h1>
        <p>Один ассортимент и состав страниц. Разные принципы навигации, подачи товара и визуального языка. Выберите направление, чтобы открыть прототип.</p>
      </div>
      <div class="variant-picker">
        <NuxtLink to="/v1" class="variant-option option-a">
          <div class="option-top"><span>01 / СИСТЕМА</span><span class="option-arrow">↗</span></div>
          <div class="mini-screen mini-a"><div class="mini-head">APEKS <i></i><i></i><i></i></div><div class="mini-hero"><div><span>Оборудование<br>для точной работы</span><b>Каталог ↗</b></div><img :src="media(data.categories[0]?.image)" alt="" /></div><div class="mini-tiles"><i></i><i></i><i></i><i></i></div></div>
          <h2>Корпоративная система</h2><p>Просторная витрина, выразительные категории и аккуратная продуктовая иерархия.</p>
          <span class="option-link">Смотреть вариант <b>↗</b></span>
        </NuxtLink>
        <NuxtLink to="/v2" class="variant-option option-b">
          <div class="option-top"><span>02 / КАТАЛОГ</span><span class="option-arrow">↗</span></div>
          <div class="mini-screen mini-b"><div class="mini-head">APEKS <i></i><i></i><i></i></div><div class="mini-body"><div class="mini-side"><i></i><i></i><i></i><i></i></div><div class="mini-content"><div class="mini-band"></div><div class="mini-products"><span><img :src="media(data.categories[0]?.image)" alt="" /></span><span><img :src="media(data.categories[2]?.image)" alt="" /></span><span><img :src="media(data.categories[3]?.image)" alt="" /></span></div></div></div></div>
          <h2>Рабочий каталог</h2><p>Плотная навигация для тех, кто знает задачу и хочет быстро сравнить приборы.</p>
          <span class="option-link">Смотреть вариант <b>↗</b></span>
        </NuxtLink>
        <NuxtLink to="/v3" class="variant-option option-c">
          <div class="option-top"><span>03 / ПРАКТИКА</span><span class="option-arrow">↗</span></div>
          <div class="mini-screen mini-c"><div class="mini-head">APEKS <i></i><i></i><i></i></div><div class="mini-hero"><div><small>ТЕХНОЛОГИИ В ПОЛЕ</small><span>Точность<br>в каждой точке.</span><b>Исследовать ↗</b></div><img :src="media(data.categories[1]?.image)" alt="" /></div><div class="mini-bottom"><i></i><i></i><i></i></div></div>
          <h2>Приборы в работе</h2><p>Инженерная эстетика и сценарии применения перед привычной сеткой каталога.</p>
          <span class="option-link">Смотреть вариант <b>↗</b></span>
        </NuxtLink>
      </div>
      <div class="selector-foot"><span>APEKS · КОНЦЕПЦИЯ ЦИФРОВОЙ ВИТРИНЫ</span><span>Все варианты адаптированы под мобильные экраны</span></div>
    </main>
  </div>

  <div v-else :class="['site',variant]">
    <div v-if="variant==='v1'" class="utility"><div class="wrap utility-inner"><span>Официальный представитель APEKS в России</span><div><span>Доставка по всей России</span><a href="tel:+79269730003">+7 (926) 973-00-03</a></div></div></div>
    <header class="site-header">
      <div class="wrap head-main">
        <NuxtLink :to="href('/')" class="brand-mark">APEKS<span>GNSS</span></NuxtLink>
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
      <div v-if="variant==='v3'" class="v3-rule wrap"><span>ИЗМЕРЯЙТЕ УВЕРЕННО</span><span>01 / 03</span></div>
    </header>

    <main>
      <template v-if="isHome">
        <template v-if="variant==='v1'">
          <section class="a-hero wrap"><div class="a-hero-copy"><div class="eyebrow">GNSS / ГЕОДЕЗИЯ / ИЗМЕРЕНИЯ</div><h1>Точность, на которую можно опереться</h1><p>Оборудование APEKS для полевых задач — от первого измерения до готового результата.</p><div class="hero-actions"><NuxtLink :to="href('/products')" class="btn btn-dark">Смотреть каталог <span>↗</span></NuxtLink><NuxtLink :to="href('/o-kompanii')" class="text-link">О компании <span>↗</span></NuxtLink></div><div class="hero-meta"><span><b>40</b> моделей в каталоге</span><span><b>10</b> групп оборудования</span></div></div><div class="a-hero-visual"><div class="hero-grid"></div><img :src="media(data.categories[0]?.image)" alt="GNSS-приёмник APEKS" /><span class="visual-caption">01 / GNSS-ПРИЁМНИКИ</span></div></section>
          <section class="wrap section a-categories"><div class="section-heading"><div><span class="eyebrow">01 / АССОРТИМЕНТ</span><h2>Оборудование по категориям</h2></div><NuxtLink :to="href('/products')" class="text-link">Весь каталог <span>↗</span></NuxtLink></div><div class="category-grid"><NuxtLink v-for="(cat,index) in data.categories" :key="cat.id" :to="categoryHref(cat.id)" :class="['category-card',index===0?'category-feature':'']"><div><span class="category-index">{{ String(index+1).padStart(2,'0') }}</span><h3>{{ cat.label }}</h3><small>{{ cat.count }} {{ positionWord(cat.count) }}</small></div><img :src="media(cat.image)" :alt="cat.label" /><span class="card-arrow">↗</span></NuxtLink></div></section>
          <section class="wrap section featured"><div class="section-heading"><div><span class="eyebrow">02 / ВЫБОР СПЕЦИАЛИСТОВ</span><h2>В центре внимания</h2></div><NuxtLink :to="href('/products')" class="text-link">Все модели <span>↗</span></NuxtLink></div><div class="product-grid"><NuxtLink v-for="p in data.products.slice(0,4)" :key="p.route" :to="href(p.route)" class="product-card"><div class="product-image"><img :src="media(p.image)" :alt="p.heading" /></div><div class="product-title"><h3>{{ p.heading }}</h3><span>↗</span></div><p>{{ p.description }}</p><div class="product-bottom">Подробнее <span>По запросу</span></div></NuxtLink></div></section>
          <section class="a-about"><div class="wrap a-about-inner"><div><span class="eyebrow">03 / APEKS В РОССИИ</span><h2>Технологии и поддержка<br>на каждом этапе</h2></div><div><p>Помогаем подобрать конфигурацию под реальные задачи, организуем поставку, обучение и сервис оборудования.</p><div class="about-links"><NuxtLink :to="href('/servis-i-podderzhka')">Сервис и поддержка ↗</NuxtLink><NuxtLink :to="href('/dostavka-i-oplata')">Доставка и оплата ↗</NuxtLink></div></div></div></section>
        </template>

        <template v-else-if="variant==='v2'">
          <div class="wrap b-shell"><aside class="b-sidebar"><div class="side-heading">КАТЕГОРИИ <span>10</span></div><NuxtLink v-for="cat in data.categories" :key="cat.id" :to="categoryHref(cat.id)">{{ cat.label }} <span>↗</span></NuxtLink><div class="side-service"><b>Нужна помощь с выбором?</b><p>Подскажем оборудование под вашу задачу.</p><NuxtLink :to="href('/contacts')">Контакты ↗</NuxtLink></div></aside><div class="b-main"><div class="b-breadcrumb">ГЛАВНАЯ / ОБОРУДОВАНИЕ</div><section class="b-hero"><div><span class="eyebrow">ОФИЦИАЛЬНЫЙ ПРЕДСТАВИТЕЛЬ APEKS</span><h1>Оборудование, готовое к работе</h1><p>GNSS-приёмники, тахеометры, контроллеры и аксессуары с поставкой и поддержкой по России.</p><NuxtLink :to="href('/products')" class="btn btn-orange">Перейти в каталог ↗</NuxtLink></div><img :src="media(data.categories[2]?.image)" alt="Тахеометр APEKS" /></section><div class="b-quick"><NuxtLink :to="categoryHref('gnss')">GNSS-приёмники <span>↗</span></NuxtLink><NuxtLink :to="categoryHref('taheometry')">Тахеометры <span>↗</span></NuxtLink><NuxtLink :to="categoryHref('controllers')">Контроллеры <span>↗</span></NuxtLink></div><section class="b-products section"><div class="section-heading"><div><span class="eyebrow">ПОДБОРКА ОБОРУДОВАНИЯ</span><h2>Популярные позиции</h2></div><NuxtLink :to="href('/products')" class="text-link">Смотреть всё ↗</NuxtLink></div><div class="b-list"><NuxtLink v-for="(p,index) in data.products.slice(0,7)" :key="p.route" :to="href(p.route)" class="b-row"><span class="b-row-number">{{ String(index+1).padStart(2,'0') }}</span><img :src="media(p.image)" :alt="p.heading" /><div><h3>{{ p.heading }}</h3><p>{{ p.description }}</p></div><span class="b-row-status">Под заказ</span><span class="b-row-arrow">↗</span></NuxtLink></div></section></div></div>
        </template>

        <template v-else>
          <section class="c-hero"><div class="wrap c-hero-inner"><div class="c-hero-copy"><div class="eyebrow">APEKS / ОБОРУДОВАНИЕ ДЛЯ ТОЧНОЙ РАБОТЫ</div><h1>Каждая точка<br>имеет значение<span>.</span></h1><p>Приборы для съёмки, разбивки и контроля. Продуманная техника для тех, кто работает на местности каждый день.</p><NuxtLink :to="href('/products')" class="btn btn-light">Изучить оборудование <span>↗</span></NuxtLink></div><div class="c-hero-visual"><div class="c-coordinate">55°45′ N<br>37°37′ E</div><img :src="media(data.categories[1]?.image)" alt="Полевой контроллер APEKS" /><span class="c-visual-label">APEKS TS8i / УПРАВЛЕНИЕ ИЗМЕРЕНИЯМИ</span></div></div></section>
          <section class="wrap c-tasks section"><div class="section-heading"><div><span class="eyebrow">01 / РЕШЕНИЯ ПО ЗАДАЧАМ</span><h2>От задачи — к прибору</h2></div><p>Выберите направление работы. Мы собрали оборудование в понятные группы.</p></div><div class="task-grid"><NuxtLink :to="categoryHref('gnss')" class="task-item"><span>01</span><h3>Спутниковые<br>измерения</h3><p>GNSS-приёмники, датчики и антенны</p><b>↗</b></NuxtLink><NuxtLink :to="categoryHref('taheometry')" class="task-item"><span>02</span><h3>Съёмка<br>и разбивка</h3><p>Тахеометры и отражатели</p><b>↗</b></NuxtLink><NuxtLink :to="categoryHref('levels')" class="task-item"><span>03</span><h3>Контроль<br>высот</h3><p>Нивелиры, штативы и вехи</p><b>↗</b></NuxtLink></div></section>
          <section class="c-focus"><div class="wrap c-focus-inner"><div class="c-focus-image"><img :src="media(data.categories[0]?.image)" alt="GNSS-приёмник APEKS" /><span>GNSS / ПОЛЕВОЕ ОБОРУДОВАНИЕ</span></div><div class="c-focus-copy"><span class="eyebrow">02 / ВЫБОР ОБОРУДОВАНИЯ</span><h2>Инструмент, который работает с вами</h2><p>От компактного приёмника до полноценной геодезической системы. В каталоге — оборудование и подробности, необходимые для осознанного выбора.</p><NuxtLink :to="href('/products')" class="text-link">Перейти в каталог <span>↗</span></NuxtLink></div></div></section>
          <section class="wrap c-showcase section"><div class="section-heading"><div><span class="eyebrow">03 / ОБОРУДОВАНИЕ</span><h2>Ключевые модели</h2></div><NuxtLink :to="href('/products')" class="text-link">Каталог полностью ↗</NuxtLink></div><div class="c-product-list"><NuxtLink v-for="(p,index) in showcaseProducts" :key="p.route" :to="href(p.route)" class="c-product"><span>0{{ index+1 }}</span><div><small>{{ index===2?'ТАХЕОМЕТРЫ':'GNSS-ПРИЁМНИКИ' }}</small><h3>{{ p.heading }}</h3></div><img :src="media(p.image)" :alt="p.heading" /><b>↗</b></NuxtLink></div></section>
        </template>
      </template>

      <template v-else-if="isCatalog">
        <div class="wrap inner-page"><div class="breadcrumbs"><NuxtLink :to="href('/')">Главная</NuxtLink><span>/</span><NuxtLink :to="href('/products')">Каталог</NuxtLink><template v-if="currentCategory"><span>/</span><span>{{ currentCategory.label }}</span></template></div><div class="inner-head"><div><span class="eyebrow">ОБОРУДОВАНИЕ / APEKS</span><h1>{{ currentCategory?.label || 'Каталог оборудования' }}</h1><p>Приборы и принадлежности для точной работы в поле и на объекте.</p></div><span class="item-count">{{ filteredProducts.length }} ПОЗИЦИЙ</span></div><div class="catalog-layout"><aside class="catalog-side"><h3>Категории</h3><NuxtLink :to="href('/products')" :class="{'selected':!currentCategory}">Все товары <span>{{ data.products.length }}</span></NuxtLink><NuxtLink v-for="cat in data.categories" :key="cat.id" :to="categoryHref(cat.id)" :class="{'selected':currentCategory?.id===cat.id}">{{ cat.label }} <span>{{ cat.count }}</span></NuxtLink><div class="catalog-side-note">Нужна консультация по совместимости? <NuxtLink :to="href('/contacts')">Свяжитесь с нами ↗</NuxtLink></div></aside><div class="catalog-main"><div class="catalog-toolbar"><span>Оборудование APEKS и проверенные решения для геодезии</span><span>ПОПУЛЯРНОЕ ↓</span></div><div class="catalog-products"><NuxtLink v-for="p in filteredProducts" :key="p.route" :to="href(p.route)" class="catalog-card"><div class="catalog-card-img"><img :src="media(p.image)" :alt="p.heading" /></div><div class="catalog-card-info"><small>ГЕОДЕЗИЧЕСКОЕ ОБОРУДОВАНИЕ</small><h3>{{ p.heading }}</h3><p>{{ p.description }}</p><div><span>Подробнее о модели</span><b>↗</b></div></div></NuxtLink></div></div></div></div>
      </template>

      <template v-else-if="isProduct && product">
        <div class="wrap inner-page"><div class="breadcrumbs"><NuxtLink :to="href('/')">Главная</NuxtLink><span>/</span><NuxtLink :to="href('/products')">Каталог</NuxtLink><span>/</span><span>{{ product.heading }}</span></div><div class="detail"><div class="detail-gallery"><div class="detail-image"><img :src="media(product.image)" :alt="product.heading" /></div><div class="detail-thumbs"><img v-for="src in product.gallery.slice(0,4)" :key="src" :src="media(src)" :alt="product.heading" /></div></div><div class="detail-info"><span class="eyebrow">APEKS / ГЕОДЕЗИЧЕСКОЕ ОБОРУДОВАНИЕ</span><h1>{{ product.heading }}</h1><p class="detail-desc">{{ product.description }}</p><div class="detail-features"><div><span>Поставка</span><b>Под заказ и из наличия</b></div><div><span>Консультация</span><b>Подбор под вашу задачу</b></div><div><span>Поддержка</span><b>Сервис в России</b></div></div><div class="detail-action"><span>Стоимость по запросу</span><NuxtLink :to="href('/contacts')" class="btn btn-dark">Запросить предложение ↗</NuxtLink></div><p class="demo-caption">Демонстрационный экран. Форма заявки и оплата появятся в рабочей версии.</p></div></div><div class="detail-more"><div><span class="eyebrow">О МОДЕЛИ</span><h2>Для точной работы каждый день</h2></div><div><p v-for="(paragraph,index) in product.paragraphs.slice(0,3)" :key="index">{{ paragraph }}</p></div></div></div>
      </template>

      <template v-else-if="informational">
        <div class="wrap inner-page info-page"><div class="breadcrumbs"><NuxtLink :to="href('/')">Главная</NuxtLink><span>/</span><span>{{ currentTitle }}</span></div><div class="info-top"><div><span class="eyebrow">APEKS / ИНФОРМАЦИЯ</span><h1>{{ currentTitle }}</h1><p>{{ current?.description || 'Информация для клиентов и партнёров APEKS.' }}</p></div><div class="info-number">APEKS<br><span>GNSS</span></div></div><div class="info-body"><aside><span>НА ЭТОЙ СТРАНИЦЕ</span><div v-for="(heading,index) in current?.headings.slice(0,6)" :key="index">{{ heading }}</div></aside><article><template v-if="current?.paragraphs.length"><p v-for="(paragraph,index) in current.paragraphs" :key="index">{{ paragraph }}</p></template><p v-else>Подробная информация об этом направлении будет размещена при наполнении рабочего сайта. Страница включена в структуру прототипа и готова к редактированию через систему управления контентом.</p><div v-if="inner==='/contacts'" class="contact-info"><b>Связаться с APEKS</b><a href="tel:+79269730003">+7 (926) 973-00-03</a><span>Консультация по оборудованию, поставкам и сервису</span></div><div v-if="inner==='/uslugi'" class="info-services"><NuxtLink v-for="[path,label] in servicePages" :key="path" :to="href(path)">{{ label }} <span>↗</span></NuxtLink></div><NuxtLink v-if="inner!=='/contacts'" :to="href('/contacts')" class="btn btn-dark">Связаться с нами ↗</NuxtLink></article></div></div>
      </template>
    </main>

    <footer class="site-footer"><div class="wrap"><div class="footer-top"><div><NuxtLink :to="href('/')" class="brand-mark">APEKS<span>GNSS</span></NuxtLink><p>Геодезическое оборудование для точной работы.</p></div><div class="footer-links"><div><b>Оборудование</b><NuxtLink :to="href('/products')">Каталог</NuxtLink><NuxtLink :to="categoryHref('gnss')">GNSS-приёмники</NuxtLink><NuxtLink :to="categoryHref('taheometry')">Тахеометры</NuxtLink><NuxtLink :to="categoryHref('levels')">Нивелиры</NuxtLink></div><div><b>Компания</b><NuxtLink :to="href('/o-kompanii')">О компании</NuxtLink><NuxtLink :to="href('/uslugi')">Услуги</NuxtLink><NuxtLink :to="href('/servis-i-podderzhka')">Сервис</NuxtLink><NuxtLink :to="href('/contacts')">Контакты</NuxtLink></div><div><b>Информация</b><NuxtLink :to="href('/dostavka-i-oplata')">Доставка и оплата</NuxtLink><NuxtLink :to="href('/instrukcii')">Инструкции</NuxtLink><NuxtLink :to="href('/privacy')">Конфиденциальность</NuxtLink><NuxtLink :to="href('/karta-sajta')">Карта сайта</NuxtLink></div></div><div class="footer-contact"><span>КОНСУЛЬТАЦИЯ</span><a href="tel:+79269730003">+7 (926) 973-00-03</a><NuxtLink :to="href('/contacts')">Все контакты ↗</NuxtLink></div></div><div class="footer-bottom"><span>© APEKS. Демо-концепция интернет-магазина.</span><NuxtLink to="/">Выбрать другой вариант ↗</NuxtLink><span>{{ activeVariantName }} / 2026</span></div></div></footer>
  </div>
</template>



