---
title: Jared Pendergraft
description: The personal website of Jared Pendergraft
pageClass: overview
layout: base.webc
---

<dialog id="calendar">
<div class="color__bg--contrast radius__m shadow">
<header class="flow__flex flow__align--block-center flow__align--inline-between">
  <p><strong @text="`${new Date().toLocaleDateString('en-US', { month: 'long' })}, ${new Date().getFullYear()}`"></strong></p>
  <button class="button__tertiary" onclick="toggleDialog()"><image-get-svg src="icons/ui/cancel.svg"
        webc:nokeep></image-get-svg></button>
</header>
<section>
  <p webc:for="weekday of ['S', 'M', 'T', 'W', 'T', 'F', 'S']"><strong @text="weekday"></strong></p>
  <span webc:for="(data,index) of moonData.monthCalendar" :class="new Date().getDate() === data.day && new Date().getMonth() === data.date.getMonth() ? 'color__bg--base--light':'' || data.isOverlap ? ' overlap':''">
    <p @text="data.day"></p>
    <image-get-svg :src="`icons/moons/${data.phase.day}.svg`" webc:nokeep></image-get-svg>
  </span>
</section>
</div>
</dialog>

<label :for="data.day" class="day border__all color__bg--contrast color__border--base--light radius__s" webc:for="(data,index) of moonData.monthBuilt">
<input :id="data.day" type="radio" name="days" :value="data.day" :checked="new Date().getDate() === index + 1" />
<section class="flow__grid flow__gap--l padding__l">
  <header class="flow__grid flow__align--block-center flow__gap--m">
    <div class="date border__all color__border--base--light flow__grid radius__s type__align--center">
      <section class="border__bottom color__bg--base--ghost color__border--base--light padding__inline--s">
        <p class="color__type--base--mid type__size--xs-s--fluid"><strong @text="data.date.toLocaleDateString('en-US', { weekday: 'short' })"></strong></p>
      </section>
      <section class="flow__grid flow__align--block-center flow__align--inline-center padding__s">
        <p class="type__size--l-m--fluid"><strong @text="data.day"></strong></p>
        <image-get-svg :src="`icons/moons/${data.phase.day}.svg`" webc:nokeep></image-get-svg>
      </section>
    </div>
    <div class="description">
      <p><strong @text="data.phase.name"></strong></p>
      <p class="color__type--base--mishid type__size--s-m--fluid" @text="data.phase.description"></p>
    </div>
  </header>
  <section class="flow__grid flow__gap--s">
    <div class="note flow__flex flow__align--block-start flow__gap--m">
      <image-get-svg src="icons/ui/plant.svg" webc:nokeep></image-get-svg>
      <p @text="data.phase.planting"></p>
    </div>
    <div class="note flow__flex flow__align--block-start flow__gap--m">
      <image-get-svg src="icons/ui/fish.svg" webc:nokeep></image-get-svg>
      <p @text="data.phase.fishing"></p>
    </div>
  </section>
  <day-footer :data="data" webc:nokeep></day-footer>
</section>
</label>
