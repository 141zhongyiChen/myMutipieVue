<template>
  <div class="text part1">
    <span class="letter" v-for="(letter, index) in letters" :key="index">
      <div class="character">{{ letter.char }}</div>
      <span></span>
    </span>
  </div>
</template>
<script type='text/ecmascript-6'>
export default {
  props: {
    letters: {
      type: Array,
      default () {
        return [
          {char: 'L'},
          {char: 'o'},
          {char: 'd'},
          {char: 'i'},
          {char: 'n'},
          {char: 'g'}
        ]
      }
    }
  }
}
</script>
<style scoped>
  /* - - - - - - - */
  .text {
    font-size: 30px;
    text-transform: uppercase;
    /* letter-spacing: -14px; */
  }
  .text .letter {
    position: relative;
    display: inline-block;
    -webkit-transition: all .4s;
    transition: all .4s;
  }
  .text .letter .character {
    opacity: 0.65;
    -webkit-transition: color .4s;
    transition: color .4s;
    cursor: pointer;
    /* myself */
  }
  .text .letter span {
    position: absolute;
   /* bottom: .8rem; */
   /* left: .4rem; */
    bottom: 4px;
    left: 8px;
    display: block;
    width: 100%;
    height: 15px;
  }
  .text .letter span::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.25);
  }
  .text .letter:hover .character {
    color: #fff !important;
  }
  .text.part1 .letter:nth-child(1).poofed {
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-animation: poofing1 1.4s ease-in-out infinite alternate;
    animation: poofing1 1.4s ease-in-out infinite alternate;
  }
  @-webkit-keyframes poofing1 {
    0% {
      -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
    }
    50% {
      -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
    }
    56% {
      -webkit-transform: rotateZ(459deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(459deg) rotateY(360deg) translateY(0px) scale(1);
    }
    100% {
      -webkit-transform: rotateZ(459deg) rotateY(360deg) translateY(-700px) scale(0.01);
      transform: rotateZ(459deg) rotateY(360deg) translateY(-700px) scale(0.01);
    }
  }
  @keyframes poofing1 {
    0% {
      -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
    }
    50% {
      -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
    }
    56% {
      -webkit-transform: rotateZ(459deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(459deg) rotateY(360deg) translateY(0px) scale(1);
    }
    100% {
      -webkit-transform: rotateZ(459deg) rotateY(360deg) translateY(-700px) scale(0.01);
      transform: rotateZ(459deg) rotateY(360deg) translateY(-700px) scale(0.01);
    }
  }
  .text.part1 .letter:nth-child(1) .character {
    color: #4e2a84;
    -webkit-animation: wave 1.2s linear infinite;
    animation: wave 1.2s linear infinite;
    -webkit-animation-delay: 0.33333s;
    animation-delay: 0.33333s;
  }
  .text.part1 .letter:nth-child(1) span::before {
    -webkit-animation: shadow 1.2s linear infinite;
    animation: shadow 1.2s linear infinite;
    -webkit-animation-delay: 0.33333s;
    animation-delay: 0.33333s;
  }

  .text.part1 .letter:nth-child(2).poofed {
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-animation: poofing2 1.4s ease-in-out infinite alternate;
    animation: poofing2 1.4s ease-in-out infinite alternate;
  }
  @-webkit-keyframes poofing2 {
    0% {
      -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
    }
    50% {
      -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
    }
    56% {
      -webkit-transform: rotateZ(540deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(540deg) rotateY(360deg) translateY(0px) scale(1);
    }
    100% {
      -webkit-transform: rotateZ(540deg) rotateY(360deg) translateY(-700px) scale(0.01);
      transform: rotateZ(540deg) rotateY(360deg) translateY(-700px) scale(0.01);
    }
  }
  @keyframes poofing2 {
    0% {
      -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
    }
    50% {
      -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
    }
    56% {
      -webkit-transform: rotateZ(540deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(540deg) rotateY(360deg) translateY(0px) scale(1);
    }
    100% {
      -webkit-transform: rotateZ(540deg) rotateY(360deg) translateY(-700px) scale(0.01);
      transform: rotateZ(540deg) rotateY(360deg) translateY(-700px) scale(0.01);
    }
  }
  .text.part1 .letter:nth-child(2) .character {
    color: #ff5a5f;
    -webkit-animation: wave 1.2s linear infinite;
    animation: wave 1.2s linear infinite;
    -webkit-animation-delay: 0.66667s;
    animation-delay: 0.66667s;
  }
  .text.part1 .letter:nth-child(2) span::before {
    -webkit-animation: shadow 1.2s linear infinite;
    animation: shadow 1.2s linear infinite;
    -webkit-animation-delay: 0.66667s;
    animation-delay: 0.66667s;
  }

  .text.part1 .letter:nth-child(3).poofed {
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-animation: poofing3 1.4s ease-in-out infinite alternate;
    animation: poofing3 1.4s ease-in-out infinite alternate;
  }
  @-webkit-keyframes poofing3 {
    0% {
      -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
    }
    50% {
      -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
    }
    56% {
      -webkit-transform: rotateZ(264deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(264deg) rotateY(360deg) translateY(0px) scale(1);
    }
    100% {
      -webkit-transform: rotateZ(264deg) rotateY(360deg) translateY(-700px) scale(0.01);
      transform: rotateZ(264deg) rotateY(360deg) translateY(-700px) scale(0.01);
    }
  }
  @keyframes poofing3 {
    0% {
      -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
    }
    50% {
      -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
    }
    56% {
      -webkit-transform: rotateZ(264deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(264deg) rotateY(360deg) translateY(0px) scale(1);
    }
    100% {
      -webkit-transform: rotateZ(264deg) rotateY(360deg) translateY(-700px) scale(0.01);
      transform: rotateZ(264deg) rotateY(360deg) translateY(-700px) scale(0.01);
    }
  }
  .text.part1 .letter:nth-child(3) .character {
    color: #f99b0c;
    -webkit-animation: wave 1.2s linear infinite;
    animation: wave 1.2s linear infinite;
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
  }
  .text.part1 .letter:nth-child(3) span::before {
    -webkit-animation: shadow 1.2s linear infinite;
    animation: shadow 1.2s linear infinite;
    -webkit-animation-delay: 1s;
    animation-delay: 1s;
  }

  .text.part1 .letter:nth-child(4).poofed {
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-animation: poofing4 1.4s ease-in-out infinite alternate;
    animation: poofing4 1.4s ease-in-out infinite alternate;
  }
  @-webkit-keyframes poofing4 {
    0% {
      -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
    }
    50% {
      -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
    }
    56% {
      -webkit-transform: rotateZ(42deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(42deg) rotateY(360deg) translateY(0px) scale(1);
    }
    100% {
      -webkit-transform: rotateZ(42deg) rotateY(360deg) translateY(-700px) scale(0.01);
      transform: rotateZ(42deg) rotateY(360deg) translateY(-700px) scale(0.01);
    }
  }
  @keyframes poofing4 {
    0% {
      -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
    }
    50% {
      -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
    }
    56% {
      -webkit-transform: rotateZ(42deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(42deg) rotateY(360deg) translateY(0px) scale(1);
    }
    100% {
      -webkit-transform: rotateZ(42deg) rotateY(360deg) translateY(-700px) scale(0.01);
      transform: rotateZ(42deg) rotateY(360deg) translateY(-700px) scale(0.01);
    }
  }
  .text.part1 .letter:nth-child(4) .character {
    color: #cee007;
    -webkit-animation: wave 1.2s linear infinite;
    animation: wave 1.2s linear infinite;
    -webkit-animation-delay: 1.33333s;
    animation-delay: 1.33333s;
  }
  .text.part1 .letter:nth-child(4) span::before {
    -webkit-animation: shadow 1.2s linear infinite;
    animation: shadow 1.2s linear infinite;
    -webkit-animation-delay: 1.33333s;
    animation-delay: 1.33333s;
  }

  .text.part1 .letter:nth-child(5).poofed {
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-animation: poofing5 1.4s ease-in-out infinite alternate;
    animation: poofing5 1.4s ease-in-out infinite alternate;
  }
  @-webkit-keyframes poofing5 {
    0% {
      -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
    }
    50% {
      -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
    }
    56% {
      -webkit-transform: rotateZ(384deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(384deg) rotateY(360deg) translateY(0px) scale(1);
    }
    100% {
      -webkit-transform: rotateZ(384deg) rotateY(360deg) translateY(-700px) scale(0.01);
      transform: rotateZ(384deg) rotateY(360deg) translateY(-700px) scale(0.01);
    }
  }
  @keyframes poofing5 {
    0% {
      -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
    }
    50% {
      -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
    }
    56% {
      -webkit-transform: rotateZ(384deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(384deg) rotateY(360deg) translateY(0px) scale(1);
    }
    100% {
      -webkit-transform: rotateZ(384deg) rotateY(360deg) translateY(-700px) scale(0.01);
      transform: rotateZ(384deg) rotateY(360deg) translateY(-700px) scale(0.01);
    }
  }
  .text.part1 .letter:nth-child(5) .character {
    color: #00c6b2;
    -webkit-animation: wave 1.2s linear infinite;
    animation: wave 1.2s linear infinite;
    -webkit-animation-delay: 1.66667s;
    animation-delay: 1.66667s;
  }
  .text.part1 .letter:nth-child(5) span::before {
    -webkit-animation: shadow 1.2s linear infinite;
    animation: shadow 1.2s linear infinite;
    -webkit-animation-delay: 1.66667s;
    animation-delay: 1.66667s;
  }

  .text.part1 .letter:nth-child(6).poofed {
    -webkit-transform-origin: 50% 50%;
    transform-origin: 50% 50%;
    -webkit-animation: poofing6 1.4s ease-in-out infinite alternate;
    animation: poofing6 1.4s ease-in-out infinite alternate;
  }
  @-webkit-keyframes poofing6 {
    0% {
      -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
    }
    50% {
      -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
    }
    56% {
      -webkit-transform: rotateZ(156deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(156deg) rotateY(360deg) translateY(0px) scale(1);
    }
    100% {
      -webkit-transform: rotateZ(156deg) rotateY(360deg) translateY(-700px) scale(0.01);
      transform: rotateZ(156deg) rotateY(360deg) translateY(-700px) scale(0.01);
    }
  }
  @keyframes poofing6 {
    0% {
      -webkit-transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(0) translateY(0px) scale(1);
    }
    50% {
      -webkit-transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(0deg) rotateY(360deg) translateY(0px) scale(1);
    }
    56% {
      -webkit-transform: rotateZ(156deg) rotateY(360deg) translateY(0px) scale(1);
      transform: rotateZ(156deg) rotateY(360deg) translateY(0px) scale(1);
    }
    100% {
      -webkit-transform: rotateZ(156deg) rotateY(360deg) translateY(-700px) scale(0.01);
      transform: rotateZ(156deg) rotateY(360deg) translateY(-700px) scale(0.01);
    }
  }
  .text.part1 .letter:nth-child(6) .character {
    color: #4e2a84;
    -webkit-animation: wave 1.2s linear infinite;
    animation: wave 1.2s linear infinite;
    -webkit-animation-delay: 2s;
    animation-delay: 2s;
  }
  .text.part1 .letter:nth-child(6) span::before {
    -webkit-animation: shadow 1.2s linear infinite;
    animation: shadow 1.2s linear infinite;
    -webkit-animation-delay: 2s;
    animation-delay: 2s;
  }

  @-webkit-keyframes wave {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
    50% {
      -webkit-transform: translateY(-10px);
      transform: translateY(-10px);
    }
    100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
  }

  @keyframes wave {
    0% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
    50% {
      -webkit-transform: translateY(-10px);
      transform: translateY(-10px);
    }
    100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
  }
  @-webkit-keyframes shadow {
    0% {
      width: 0;
      height: 0;
    }
    50% {
      width: 100%;
      height: 100%;
    }
    100% {
      width: 0;
      height: 0;
    }
  }
  @keyframes shadow {
    0% {
      width: 0;
      height: 0;
    }
    50% {
      width: 100%;
      height: 100%;
    }
    100% {
      width: 0;
      height: 0;
    }
  }

  @-webkit-keyframes rotate {
    0% {
      -webkit-transform: rotateZ(0) scale(0.7);
      transform: rotateZ(0) scale(0.7);
    }
    100% {
      -webkit-transform: rotateZ(360deg) scale(0.7);
      transform: rotateZ(360deg) scale(0.7);
    }
  }

  @keyframes rotate {
    0% {
      -webkit-transform: rotateZ(0) scale(0.7);
      transform: rotateZ(0) scale(0.7);
    }
    100% {
      -webkit-transform: rotateZ(360deg) scale(0.7);
      transform: rotateZ(360deg) scale(0.7);
    }
  }
  /* - - - - - - - */
</style>
