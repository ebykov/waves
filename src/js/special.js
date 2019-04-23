import '../css/special.styl';

import BaseSpecial from './base';
import Data from './data';
import Svg from './svg';
import { makeElement, removeChildren } from './lib/dom';
import { shuffle } from './lib/array';
import { animate } from './lib/animate';
import makeSwipeable from './lib/swipe';
import * as Analytics from './lib/analytics';
import * as Share from './lib/share';

const CSS = {
  main: 'waves',
};

const EL = {};

class Special extends BaseSpecial {
  constructor(params = {}) {
    super();

    Object.assign(this.params, params);
    this.saveParams();

    if (Data && params.data) {
      Object.assign(Data, params.data);
    }

    this.keyUpHandler = this.keyUpHandler.bind(this);

    if (this.params.css) {
      this.loadStyles(this.params.css).then(() => this.init());
    } else {
      this.init();
    }
  }

  createElements() {
    EL.enter = makeElement('div', `${CSS.main}-enter`);
    EL.eLogo = makeElement('div', `${CSS.main}-enter__logo`, {
      innerHTML: Svg.logo,
    });
    EL.eImg = makeElement('div', `${CSS.main}-enter__img`, {
      innerHTML: Svg.illustrations.cashback,
    });
    EL.eInner = makeElement('div', `${CSS.main}-enter__inner`);
    EL.eTitle = makeElement('div', `${CSS.main}-enter__title`, {
      innerHTML: '<span>Веб 3.0</span> —<br>это концепция<br>интернета<br>будущего',
    });
    EL.eText = makeElement('div', `${CSS.main}-enter__text`, {
      innerHTML: 'Попробуйте угадать, из чего она действительно состоит.',
    });
    EL.eBtn = makeElement('div', `${CSS.main}-enter__btn`, {
      innerHTML: '<button>Начать!</button>',
      data: {
        click: 'start',
      },
    });

    EL.eInner.appendChild(EL.eTitle);
    EL.eInner.appendChild(EL.eText);
    EL.eInner.appendChild(EL.eBtn);

    EL.enter.appendChild(EL.eLogo);
    EL.enter.appendChild(EL.eImg);
    EL.enter.appendChild(EL.eInner);

    EL.q = makeElement('div', `${CSS.main}__question`);
    // EL.pages = makeElement('div', `${CSS.main}__pages`);

    // EL.controls = makeElement('div', `${CSS.main}__controls`);
    // EL.optionL = makeElement('div', `${CSS.main}__option`, {
    //   data: {
    //     type: 'left',
    //   },
    // });
    // EL.optionR = makeElement('div', `${CSS.main}__option`, {
    //   data: {
    //     type: 'right',
    //   },
    // });
    // EL.optionLBtn = makeElement('button', `${CSS.main}__btn`, {
    //   textContent: 'Вымысел 🔮',
    // });
    // EL.optionRBtn = makeElement('button', `${CSS.main}__btn`, {
    //   textContent: 'Правда 🚀',
    // });
    //
    // EL.optionL.appendChild(EL.optionLBtn);
    // EL.optionR.appendChild(EL.optionRBtn);

    // EL.nextBtn = makeElement('button', `${CSS.main}__btn`, {
    //   textContent: 'Далее',
    //   data: {
    //     click: 'continue',
    //   },
    // });

    // EL.optionL.addEventListener('click', () => { this.answer('left'); });
    // EL.optionR.addEventListener('click', () => { this.answer('right'); });

    EL.cards = makeElement('div', `${CSS.main}__cards`);
    EL.nextCards = makeElement('div', `${CSS.main}__next-cards`);

    EL.cardWrapper = makeElement('div', `${CSS.main}__card-wrapper`);
    EL.cardInner = makeElement('div', `${CSS.main}__card-inner`);

    EL.card = makeElement('div', `${CSS.main}-card`);
    EL.cTitle = makeElement('div', `${CSS.main}-card__title`, {
      innerHTML: '<div>Web 3.0 это...</div><div>Web 3.0 is...</div>',
    });
    EL.cImg = makeElement('div', `${CSS.main}-card__img`);
    EL.cText = makeElement('div', `${CSS.main}-card__text`);
    EL.cBottom = makeElement('div', `${CSS.main}-card__bottom`);
    EL.cCopy = makeElement('div', `${CSS.main}-card__copy`, {
      innerHTML: '<span>®</span>2019 Waves&Vc.ru special project',
    });
    EL.cPages = makeElement('div', `${CSS.main}-card__pages`);

    EL.cBottom.appendChild(EL.cCopy);
    EL.cBottom.appendChild(EL.cPages);

    EL.card.appendChild(EL.cTitle);
    EL.card.appendChild(EL.cImg);
    EL.card.appendChild(EL.cText);
    EL.card.appendChild(EL.cBottom);

    EL.backCard = makeElement('div', [`${CSS.main}-card`, `${CSS.main}-card--back`]);
    EL.bcAnswer = makeElement('div', `${CSS.main}-card__answer`);
    EL.bcAnswerTitle = makeElement('div', `${CSS.main}-card__answer-title`);
    EL.bcAnswerText = makeElement('div', `${CSS.main}-card__answer-text`);
    EL.bcAnswerBtn = makeElement('button', `${CSS.main}-card__answer-next-btn`, {
      innerHTML: `<span>Далее${Svg.arrow}</span>`,
      data: {
        click: 'continue',
      },
    });

    EL.bcAnswer.appendChild(EL.bcAnswerTitle);
    EL.bcAnswer.appendChild(EL.bcAnswerText);
    EL.bcAnswer.appendChild(EL.bcAnswerBtn);

    EL.backCard.appendChild(EL.bcAnswer);

    EL.cardInner.appendChild(EL.card);
    EL.cardInner.appendChild(EL.backCard);

    EL.cardWrapper.appendChild(EL.cardInner);

    EL.cards.appendChild(EL.nextCards);
    EL.cards.appendChild(EL.cardWrapper);

    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) || /firefox/i.test(navigator.userAgent)) {
      EL.card.style.webkitBackfaceVisibility = 'hidden';
      EL.backCard.style.webkitBackfaceVisibility = 'hidden';
    }

    // EL.q.appendChild(EL.pages);
    EL.q.appendChild(EL.cards);
    // EL.q.appendChild(EL.controls);

    makeSwipeable(EL.cardWrapper, (t) => {
      this.answer(t, 'Swipe');
    });

    EL.help = makeElement('div', `${CSS.main}-help`);
    EL.hInner = makeElement('div', `${CSS.main}-help__inner`);
    EL.hIcon = makeElement('div', `${CSS.main}-help__icon`, {
      innerHTML: Svg.swipe,
    });
    EL.hText = makeElement('div', `${CSS.main}-help__text`, {
      innerHTML: '<p>Свайпайте карточку вправо, если считаете, что правильный ответ «правда».</p><p>Влево — если «вымысел».</p>',
    });
    EL.hBtn = makeElement('button', `${CSS.main}-help__btn`, {
      textContent: 'Понятно',
      data: {
        click: 'hideHelp',
      },
    });

    EL.hInner.appendChild(EL.hIcon);
    EL.hInner.appendChild(EL.hText);
    EL.hInner.appendChild(EL.hBtn);

    EL.help.appendChild(EL.hInner);

    // EL.nextCard = makeElement('div', [`${CSS.main}-card`, `${CSS.main}-card--next`]);
    // EL.ncHead = makeElement('div', `${CSS.main}-card__head`);
    // EL.ncBottom = makeElement('div', `${CSS.main}-card__bottom`);
    // EL.ncText = makeElement('div', `${CSS.main}-card__text`);
    // EL.ncImg = makeElement('img', `${CSS.main}-card__img`);
    //
    // EL.ncHead.appendChild(EL.ncImg);
    // EL.ncBottom.appendChild(EL.ncText);
    // EL.nextCard.appendChild(EL.ncHead);
    // EL.nextCard.appendChild(EL.ncBottom);
    //
    // EL.result = makeElement('div', `${CSS.main}-result`);
    // EL.rMain = makeElement('div', `${CSS.main}-result__main`);
    // EL.rMainTop = makeElement('div', `${CSS.main}-result__main-top`);
    // EL.rMainBottom = makeElement('div', `${CSS.main}-result__main-bottom`);
    // EL.rResult = makeElement('div', `${CSS.main}-result__result`);
    // EL.rMTCaption = makeElement('div', `${CSS.main}-result__caption`, {
    //   data: {
    //     text: 'Сейчас',
    //   },
    // });
    // EL.rImg = makeElement('img', `${CSS.main}-result__img`);
    // EL.rMBCaption = makeElement('div', [`${CSS.main}-result__caption`, `${CSS.main}-result__caption--2`], {
    //   data: {
    //     text: 'В будущем',
    //   },
    // });
    // EL.rFuture = makeElement('div', `${CSS.main}-result__future`, {
    //   textContent: 'Будущее можно узнать только после шера. Поделитесь, если интересно.',
    // });
    // EL.rShare = makeElement('div', `${CSS.main}-result__share`);
    // EL.rRestart = makeElement('div', `${CSS.main}-result__restart`, {
    //   innerHTML: `<span>Пройти ещё раз</span>${Svg.refresh}`,
    //   data: {
    //     click: 'restart',
    //   },
    // });
    //
    // EL.rMainTop.appendChild(EL.rResult);
    // EL.rMainTop.appendChild(EL.rMTCaption);
    // EL.rMainTop.appendChild(EL.rImg);
    //
    // EL.rMainBottom.appendChild(EL.rMBCaption);
    // EL.rMainBottom.appendChild(EL.rFuture);
    // EL.rMainBottom.appendChild(EL.rShare);
    // EL.rMainBottom.appendChild(EL.rRestart);
    //
    // EL.rMain.appendChild(EL.rMainTop);
    // EL.rMain.appendChild(EL.rMainBottom);
    //
    // EL.rContent = makeElement('div', `${CSS.main}-result__content`);
    // EL.rLogo = makeElement('div', `${CSS.main}-result__logo`, {
    //   innerHTML: Svg.logo,
    // });
    // EL.rText = makeElement('div', `${CSS.main}-result__text`, {
    //   innerHTML: Data.result.text,
    // });
    // EL.rLink = makeElement('a', `${CSS.main}-result__btn`, {
    //   href: Data.result.link,
    //   target: '_blank',
    //   textContent: 'Узнать о вакансиях',
    // });
    //
    // EL.rContent.appendChild(EL.rLogo);
    // EL.rContent.appendChild(EL.rText);
    // EL.rContent.appendChild(EL.rLink);
    //
    // EL.result.appendChild(EL.rMain);
    // EL.result.appendChild(EL.rContent);
  }

  hideHelp() {
    animate(EL.help, 'fadeOut', '200ms').then(() => {
      this.container.removeChild(EL.help);
    });
  }

  // static makeNextCard(index) {
  //   const q = Data.questions[index];
  //
  //   EL.ncText.innerHTML = q.text;
  //   EL.ncImg.src = q.images.main['1x'];
  //   EL.ncImg.srcset = `${q.images.main['2x']} 2x`;
  //   EL.ncImg.dataset.id = q.id + 1;
  //
  //   return EL.nextCard;
  // }

  static changeCardImages(index) {
    const q = Data.questions[index];

    // EL.cImg.src = q.images.main['1x'];
    // EL.cImg.srcset = `${q.images.main['2x']} 2x`;
    // EL.cImg.dataset.id = q.id + 1;
  }

  showCount() {
    const index = this.activeIndex + 1;
    removeChildren(EL.nextCards);

    if (index === Data.questions.length) {
      return;
    }

    // const nextCard = Special.makeNextCard(index);

    if (index === Data.questions.length - 1) {
      EL.nextCards.innerHTML = '<div></div>';
      // EL.nextCards.firstChild.appendChild(nextCard);
    } else if (index > Data.questions.length / 2) {
      EL.nextCards.innerHTML = '<div></div><div></div>';
      // EL.nextCards.firstChild.appendChild(nextCard);
    } else {
      EL.nextCards.innerHTML = '<div></div><div></div><div></div>';
      // EL.nextCards.firstChild.appendChild(nextCard);
    }
  }

  // static getResult(score) {
  //   let result = {};
  //   let index = 0;
  //
  //   Data.results.some((item, i) => {
  //     if (item.range[0] <= score && item.range[1] >= score) {
  //       result = item;
  //       index = i;
  //       return true;
  //     }
  //     return false;
  //   });
  //
  //   return { result, index };
  // }

  // onOptionHover(e) {
  //   let textL = `<div>Или свайпни карточку влево</div>${Svg.swipeL}`;
  //   let textR = `${Svg.swipeR}<div>Или свайпни карточку вправо</div>`;
  //
  //   if (this.isAnswered || this.activeIndex > 0) {
  //     textL = 'Вымысел';
  //     textR = 'Правда';
  //   }
  //
  //   const el = e.currentTarget;
  //   const t = el.dataset.type;
  //   const hint = makeElement('div', [`${CSS.main}__option-hint`, `${CSS.main}__option-hint--${t}`], {
  //     innerHTML: t === 'left' ? textL : textR,
  //   });
  //
  //   el.appendChild(hint);
  //
  //   const onOptionLeave = () => {
  //     el.removeEventListener('mouseout', onOptionLeave);
  //     el.removeEventListener('click', onOptionLeave);
  //     el.removeChild(hint);
  //   };
  //   el.addEventListener('mouseout', onOptionLeave);
  //   el.addEventListener('click', onOptionLeave);
  // }

  start() {
    this.container.removeChild(EL.enter);
    this.container.appendChild(EL.q);

    Data.questions.forEach((q, i) => {
      Data.questions[i].id = i;
    });
    shuffle(Data.questions);

    this.makeNextQuestion();

    if (/Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768) {
      this.container.appendChild(EL.help);
      animate(EL.help, 'fadeIn', '200ms', '400ms');
    } else {
      // EL.optionL.addEventListener('mouseover', this.onOptionHover.bind(this));
      // EL.optionR.addEventListener('mouseover', this.onOptionHover.bind(this));
    }

    Special.changeCardImages(this.activeIndex);

    this.initCardEvents();

    Analytics.sendEvent(`${this.typeShowing} - Start`, 'Show');
  }

  // restart() {
  //   shuffle(Data.questions, 'partner');
  //
  //   this.container.classList.remove('is-result');
  //   this.container.removeChild(EL.result);
  //   this.container.appendChild(EL.q);
  //
  //   EL.nextBtn.textContent = 'Далее';
  //   EL.nextBtn.dataset.click = 'continue';
  //
  //   this.setInitialParams();
  //   this.initCardEvents();
  //
  //   Special.changeCardImages(this.activeIndex);
  //
  //   this.makeNextQuestion();
  //
  //   Analytics.sendEvent(`${this.typeShowing} - Restart`);
  // }

  continue(el, e, trigger = 'Click') {
    if (this.animationInProgress) {
      return;
    }

    EL.cards.style.perspective = '';

    this.activeIndex += 1;

    // if (this.activeIndex === 1) {
    //   EL.optionLBtn.classList.add('is-big');
    //   EL.optionLBtn.textContent = '🔮';
    //
    //   EL.optionRBtn.classList.add('is-big');
    //   EL.optionRBtn.textContent = '🚀';
    // }

    const animationClassName = this.lastAnsweredType === 'left' ? 'fadeOutLeft' : 'fadeOutRight';

    animate(EL.cardWrapper, animationClassName).then(() => {
      this.container.classList.remove('is-answered');

      this.container.classList.remove('is-correct');
      this.container.classList.remove('is-incorrect');

      EL.cards.removeChild(EL.cardWrapper);
      EL.cardInner.style.transform = '';

      // EL.backCard.classList.remove('is-correct');
      // EL.backCard.classList.remove('is-incorrect');
      // EL.bcAnswerImg.src = '';
      // EL.bcAnswerImg.srcset = '';

      this.makeNextQuestion();
    });

    Analytics.sendEvent(`${this.typeShowing} - Next`, trigger);
  }

  makeNextQuestion() {
    const question = Data.questions[this.activeIndex];

    this.isAnswered = false;

    // removeChildren(EL.controls);
    // EL.controls.appendChild(EL.optionL);
    // EL.controls.appendChild(EL.optionR);

    // EL.pages.innerHTML = `${this.activeIndex + 1}/${Data.questions.length}`;
    EL.cPages.innerHTML = `<span>${this.activeIndex + 1}</span> /${Data.questions.length}`;

    EL.cImg.innerHTML = question.img;
    EL.cText.innerHTML = question.text;

    this.showCount();

    EL.cards.appendChild(EL.cardWrapper);
    animate(EL.cardWrapper, 'cardZoomIn', '300ms');
  }

  answer(t, trigger = 'Click') {
    if (this.isAnswered) { return; }
    this.isAnswered = true;

    const question = Data.questions[this.activeIndex];

    this.lastAnsweredType = t;

    this.makeAnswer(question, t);

    Analytics.sendEvent(`${this.typeShowing} - (Question index: ${this.activeIndex},  id: ${question.id}) - Option - ${t}`, trigger);
  }

  makeAnswer(question, type) {
    this.container.classList.add('is-answered');

    this.animationInProgress = true;
    EL.cardInner.style.transform = 'translate3d(0,0,0) rotateY(-180deg)';

    // removeChildren(EL.controls);
    // EL.controls.appendChild(EL.nextBtn);

    if (question.correct === type) {
      this.correctAnswers += 1;
      this.container.classList.add('is-correct');
      // EL.backCard.classList.add('is-correct');
      // EL.bcAnswerImg.src = question.images.correct['1x'];
      // EL.bcAnswerImg.srcset = `${question.images.correct['2x']} 2x`;
      EL.bcAnswerTitle.textContent = 'Да';
    } else {
      this.container.classList.add('is-incorrect');
      // EL.backCard.classList.add('is-incorrect');
      // EL.bcAnswerImg.src = question.images.incorrect['1x'];
      // EL.bcAnswerImg.srcset = `${question.images.incorrect['2x']} 2x`;
      EL.bcAnswerTitle.textContent = 'Нет';
    }

    // EL.bcAnswerImg.dataset.id = question.id + 1;

    EL.bcAnswerText.innerHTML = question.answer;

    if (this.activeIndex < Data.questions.length - 1) {
      this.timer = setTimeout(() => {
        Special.changeCardImages(this.activeIndex + 1);
        EL.cards.style.perspective = 'none';
        this.animationInProgress = false;
      }, 600);
    }

    if (this.activeIndex === Data.questions.length - 1) {
      EL.bcAnswerBtn.dataset.click = 'result';
    }
  }

  // result(el, e, trigger = 'Click') {
  //   const { result, index } = Special.getResult(this.correctAnswers);
  //
  //   EL.cards.removeChild(EL.cardWrapper);
  //   EL.cardInner.style.transform = '';
  //
  //   EL.backCard.classList.remove('is-correct');
  //   EL.backCard.classList.remove('is-incorrect');
  //   EL.bcAnswerImg.src = '';
  //   EL.bcAnswerImg.srcset = '';
  //
  //   this.container.classList.remove('is-answered');
  //   this.container.classList.add('is-result');
  //   this.container.removeChild(EL.q);
  //   this.container.appendChild(EL.result);
  //
  //   EL.rResult.innerHTML = `${this.correctAnswers} из ${Data.questions.length} правильных ответов`;
  //   EL.rImg.dataset.id = index + 1;
  //   EL.rImg.src = result.img;
  //   EL.rImg.srcset = `${result.img2x} 2x`;
  //
  //   removeChildren(EL.rShare);
  //   Share.make(EL.rShare, {
  //     url: `${this.params.share.url}/${index + 1}`,
  //     title: `${this.correctAnswers} из ${Data.questions.length} правильных ответов`,
  //     twitter: `${this.correctAnswers} из ${Data.questions.length} правильных ответов`,
  //   });
  //
  //   this.destroyCardEvents();
  //
  //   Analytics.sendEvent(`${this.typeShowing} - Result`, trigger);
  // }

  setInitialParams() {
    this.activeIndex = 0;
    this.correctAnswers = 0;
  }

  keyUpHandler(e) {
    if (e.keyCode === 37 || e.keyCode === 39) {
      this.answer(e.keyCode === 37 ? 'left' : 'right', 'KeyUp');
    } else if (e.keyCode === 13) {
      if (this.isAnswered) {
        if (this.activeIndex === Data.questions.length - 1) {
          this.result(null, e, 'KeyUp');
        } else {
          this.continue(null, e, 'KeyUp');
        }
      }
    }
  }

  initCardEvents() {
    document.addEventListener('keyup', this.keyUpHandler);
  }

  // destroyCardEvents() {
  //   document.removeEventListener('keyup', this.keyUpHandler);
  // }

  // static loadImages() {
  //   Data.questions.forEach((q, i) => {
  //     IMAGES[i] = makeElement('img', null, {
  //       src: q.answer.img,
  //       srcset: `${q.answer.img} 2x`,
  //     });
  //   });
  // }

  init() {
    this.setInitialParams();
    this.createElements();
    removeChildren(this.container);
    this.container.appendChild(EL.enter);

    this.container.classList.add(this.params.isFeed ? 'is-feed' : 'is-not-feed');

    this.typeShowing = this.params.isFeed ? 'in Feed' : 'in Page';

    // Special.loadImages();

    // this.start();
  }
}

export default Special;
