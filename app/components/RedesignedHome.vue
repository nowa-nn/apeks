<script setup lang="ts">
import data from '~/data/content.json'

const props = defineProps<{ variant: string }>()
const config = useRuntimeConfig()
const asset = (path: string | null | undefined) => path ? `${config.app.baseURL}${path.replace(/^\//, '')}` : ''
const brand = (name: string) => asset(`/brand/${name}`)
const href = (path: string) => `/${props.variant}${path === '/' ? '' : path}`
const categorySlugs: Record<string, string> = { gnss: 'gnss-priemniki', taheometry: 'taheometry', controllers: 'kontrollery', levels: 'nivelity', sensors: 'antenny', radio: 'radiosvyaz', software: 'po', tripods: 'shtativy-vehi', prisms: 'otrazhateli', accessories: 'aksessuary' }
const categoryHref = (id: string) => href(`/category/${categorySlugs[id] || id}`)
const modelImages = ['ap80.jpg', 'ap20.png', 'ap20ar.jpg', 'ap40.png', 'max5.png', 'ap60.png', 'ap10.png', 'ap30.png', 'aps1.jpg', 'ap50.png']
const modelImage = (index: number) => modelImages[index] ? brand(modelImages[index]) : asset(data.products[index]?.image)
const featured = [0, 3, 2, 5, 6, 7]
const prices: Record<number, string> = { 0: '249 000 ₽', 3: '199 000 ₽', 2: '129 000 ₽', 5: '189 000 ₽', 6: '99 000 ₽', 7: '169 000 ₽' }
</script>

<template>
  <div v-if="variant === 'v1'" class="home home-a">
    <section class="a-hero" :style="{ '--hero-image': `url(${brand('ru-hero.jpeg')})` }"><div class="wrap a-hero-content"><span class="hero-kicker">Геодезическое и спутниковое оборудование</span><h1>Точность начинается<br>с правильного прибора</h1><p>GNSS-приёмники, тахеометры и полевые контроллеры APEKS. Подберём комплект под вашу задачу и поддержим после покупки.</p><NuxtLink :to="href('/products')" class="btn btn-primary">Перейти в каталог <span>→</span></NuxtLink></div></section>
    <section class="wrap section a-categories"><div class="section-heading"><div><span class="label">Ассортимент APEKS</span><h2>Выберите оборудование</h2></div><NuxtLink :to="href('/products')" class="text-link">Весь каталог →</NuxtLink></div><div class="category-grid"><NuxtLink v-for="cat in data.categories.slice(0,8)" :key="cat.id" :to="categoryHref(cat.id)" class="category-card"><h3>{{ cat.label }}</h3><img :src="cat.id === 'gnss' ? brand('ap40.png') : asset(cat.image)" :alt="cat.label"><span>Смотреть →</span></NuxtLink></div></section>
    <section class="wrap section a-products"><div class="section-heading"><div><span class="label">Модели APEKS</span><h2>Популярное оборудование</h2></div><NuxtLink :to="href('/products')" class="text-link">Все модели →</NuxtLink></div><div class="product-grid"><NuxtLink v-for="i in featured.slice(0,4)" :key="i" :to="href(data.products[i]!.route)" class="product-card"><div class="product-image"><img :src="modelImage(i)" :alt="data.products[i]!.heading"></div><div class="product-copy"><small>GNSS-ПРИЁМНИК</small><h3>{{ data.products[i]!.heading }}</h3><p>{{ data.products[i]!.description }}</p><span>Подробнее →</span></div></NuxtLink></div></section>
    <section class="a-support"><div class="wrap support-inner"><div><span class="label">APEKS в России</span><h2>Оборудование и поддержка<br>из одного источника</h2></div><p>Поможем подобрать конфигурацию, организуем поставку и сервис. Работаем с геодезистами, изыскателями и строительными компаниями по всей России.</p><NuxtLink :to="href('/o-kompanii')" class="text-link">О компании →</NuxtLink></div></section>
  </div>

  <div v-else-if="variant === 'v2'" class="home home-b b-workspace wrap">
    <div class="b-heading">
      <div>
        <span class="label">Интернет-магазин APEKS</span>
        <h1>Оборудование для геодезии</h1>
        <p>Подберите прибор по типу работ. Цены и основные возможности моделей — сразу в списке.</p>
      </div>
      <NuxtLink :to="href('/contacts')" class="b-heading-contact">Поможем подобрать комплект <span>↗</span></NuxtLink>
    </div>

    <div class="b-layout">
      <aside class="b-rail">
        <div class="b-rail-title">Категории</div>
        <nav aria-label="Категории каталога">
          <NuxtLink v-for="cat in data.categories.slice(0,8)" :key="cat.id" :to="categoryHref(cat.id)">
            <span>{{ cat.label }}</span><span aria-hidden="true">↗</span>
          </NuxtLink>
        </nav>
        <div class="b-rail-help">
          <strong>Подбор под проект</strong>
          <p>Подскажем совместимое оборудование для ваших задач и условий работы.</p>
          <NuxtLink :to="href('/contacts')">Связаться с нами →</NuxtLink>
        </div>
      </aside>

      <main class="b-listing">
        <div class="b-listing-head">
          <div><span class="label">GNSS-ПРИЁМНИКИ</span><h2>Для полевых измерений</h2></div>
          <span class="b-listing-count">{{ featured.length }} моделей</span>
        </div>
        <NuxtLink v-for="i in featured" :key="i" :to="href(data.products[i]!.route)" class="b-list-row">
          <div class="b-list-image"><img :src="modelImage(i)" :alt="data.products[i]!.heading"></div>
          <div class="b-list-copy">
            <small>APEKS · GNSS-ПРИЁМНИК</small>
            <h3>{{ data.products[i]!.heading }}</h3>
            <p>{{ data.products[i]!.description }}</p>
          </div>
          <div class="b-list-action"><strong>{{ prices[i] }}</strong><span>О модели ↗</span></div>
        </NuxtLink>
        <NuxtLink :to="href('/products')" class="b-all-catalog">Перейти в полный каталог <span>→</span></NuxtLink>
      </main>
    </div>
  </div>

  <div v-else class="home home-c c-showcase">
    <section class="c-hero">
      <div class="c-hero-copy">
        <div class="c-hero-copy-inner">
          <span class="c-eyebrow">APEKS · ПРИБОРЫ ДЛЯ ГЕОДЕЗИИ</span>
          <h1>AP80 Pro</h1>
          <p class="c-hero-lead">Съёмка сложных и труднодоступных точек.</p>
          <p class="c-hero-desc">GNSS-приёмник с фотограмметрией, лазером и инерциальными измерениями для сложных полевых условий.</p>
          <NuxtLink :to="href(data.products[0]!.route)" class="c-hero-link">Открыть AP80 Pro <span>↗</span></NuxtLink>
        </div>
        <div class="c-hero-bottom"><span>GNSS / ФОТОГРАММЕТРИЯ / ЛАЗЕР</span><span>APEKS</span></div>
      </div>
      <div class="c-hero-product"><img :src="brand('ap80-large.jpg')" alt="GNSS-приёмник APEKS AP80 Pro"></div>
    </section>

    <section class="wrap c-usecases">
      <div class="c-section-title"><span class="label">В ПОЛЕ</span><h2>Один прибор. Несколько способов измерения.</h2></div>
      <div class="c-usecase-grid">
        <div><h3>Снимайте без доступа к точке</h3><p>Лазер помогает получить координаты там, где веху установить невозможно.</p></div>
        <div><h3>Работайте в сложной застройке</h3><p>Камеры и фотограмметрия расширяют возможности съёмки рядом со зданиями и препятствиями.</p></div>
        <div><h3>Не выравнивайте веху каждый раз</h3><p>IMU компенсирует наклон в полевой работе — до 120° для AP80 Pro.</p></div>
      </div>
    </section>

    <section class="c-second-product">
      <div class="wrap c-second-inner">
        <div class="c-second-visual"><img :src="brand('ap40.png')" alt="GNSS-приёмник APEKS AP40 Laser+"></div>
        <div class="c-second-copy"><span class="label">ДРУГАЯ ЗАДАЧА — ДРУГАЯ МОДЕЛЬ</span><h2>AP40 Laser+</h2><p>Приёмник с лазером для удалённых точек. Подходит для фасадов, кровель и участков, где работа с вехой затруднена.</p><NuxtLink :to="href(data.products[3]!.route)" class="c-text-link">Изучить модель <span>→</span></NuxtLink></div>
      </div>
    </section>

    <section class="wrap c-range">
      <div class="c-range-head"><div><span class="label">ЛИНЕЙКА APEKS</span><h2>Другие модели</h2></div><NuxtLink :to="href('/products')">Все модели →</NuxtLink></div>
      <div class="c-range-list">
        <NuxtLink :to="href(data.products[2]!.route)"><strong>AP20 AR</strong><span>Разбивка с дополненной реальностью</span><b>↗</b></NuxtLink>
        <NuxtLink :to="href(data.products[5]!.route)"><strong>AP60 Vision</strong><span>Визуальная съёмка в сложных полевых условиях</span><b>↗</b></NuxtLink>
        <NuxtLink :to="href(data.products[6]!.route)"><strong>AP10</strong><span>Базовые спутниковые измерения</span><b>↗</b></NuxtLink>
      </div>
    </section>
  </div>
</template>
