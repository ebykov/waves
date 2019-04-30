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
      innerHTML: Svg.illustrations.cashback.repeat(5),
    });
    EL.eInner = makeElement('div', `${CSS.main}-enter__inner`);
    EL.eTitle = makeElement('div', `${CSS.main}-enter__title`, {
      innerHTML: '<span>Веб 3.0</span> —<br>это концепция<br>интернета<br>будущего',
    });
    EL.eText = makeElement('div', `${CSS.main}-enter__text`, {
      innerHTML: 'Попробуйте угадать, из&nbsp;чего она действительно состоит.',
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

    EL.optionL = makeElement('div', [`${CSS.main}__option`, `${CSS.main}__option--left`], {
      innerHTML: `${Svg.faceNo}<span>Глупость</span>`,
      data: {
        type: 'left',
      },
    });
    EL.optionR = makeElement('div', [`${CSS.main}__option`, `${CSS.main}__option--right`], {
      innerHTML: `${Svg.faceYes}<span>Правда</span>`,
      data: {
        type: 'right',
      },
    });

    EL.optionL.addEventListener('click', () => { this.answer('left'); });
    EL.optionR.addEventListener('click', () => { this.answer('right'); });

    EL.cards = makeElement('div', `${CSS.main}__cards`);
    EL.nextCards = makeElement('div', `${CSS.main}__next-cards`);

    EL.cardWrapper = makeElement('div', `${CSS.main}__card-wrapper`);
    EL.cardInner = makeElement('div', `${CSS.main}__card-inner`);

    EL.card = makeElement('div', `${CSS.main}-card`);
    EL.cTitle = makeElement('div', `${CSS.main}-card__title`, {
      innerHTML: '<div>Web 3.0 это...</div><div>Web 3.0 is...</div>',
    });
    EL.cImg = makeElement('div', [`${CSS.main}-card__img`]);
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

    EL.q.appendChild(EL.cards);
    EL.q.appendChild(EL.optionL);
    EL.q.appendChild(EL.optionR);

    makeSwipeable(this.container, EL.cardWrapper, (t) => {
      this.answer(t, 'Swipe');
    });

    EL.help = makeElement('div', `${CSS.main}-help`);
    EL.hInner = makeElement('div', `${CSS.main}-help__inner`);
    EL.hIcon = makeElement('div', `${CSS.main}-help__icon`, {
      innerHTML: Svg.swipe,
    });
    EL.hText = makeElement('div', `${CSS.main}-help__text`, {
      innerHTML: 'Смахните карточку вправо, если считаете утверждение правдой, и влево — если глупостью.',
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

    EL.final = makeElement('div', `${CSS.main}-final`);
    EL.fMain = makeElement('div', `${CSS.main}-final__main`);
    EL.fExtra = makeElement('div', `${CSS.main}-final__extra`);

    EL.fImg = makeElement('div', `${CSS.main}-final__img`);
    EL.fResult = makeElement('div', `${CSS.main}-final__result`);
    EL.fTitle = makeElement('div', `${CSS.main}-final__title`);
    EL.fShare = makeElement('div', `${CSS.main}-final__share`);
    EL.fRestart = makeElement('div', `${CSS.main}-final__restart`, {
      innerHTML: `<div class="${CSS.main}-final__restart-btn" data-click="restart"><span>Пройти еще раз</span>${Svg.refresh}</div>`,
    });

    EL.fLogo = makeElement('div', `${CSS.main}-final__logo`, {
      innerHTML: Svg.logo,
    });
    EL.fText = makeElement('div', `${CSS.main}-final__text`, {
      innerHTML: Data.result.text,
    });
    EL.fBtn = makeElement('a', `${CSS.main}-final__btn`, {
      textContent: 'Подробнее',
      href: Data.result.link,
      target: '_blank',
    });

    EL.fMain.appendChild(EL.fImg);
    EL.fMain.appendChild(EL.fResult);
    EL.fMain.appendChild(EL.fTitle);
    EL.fMain.appendChild(EL.fShare);
    EL.fMain.appendChild(EL.fRestart);

    EL.fExtra.appendChild(EL.fLogo);
    EL.fExtra.appendChild(EL.fText);
    EL.fExtra.appendChild(EL.fBtn);

    EL.final.appendChild(EL.fMain);
    EL.final.appendChild(EL.fExtra);
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

  // static changeCardImages(index) {
  //   const q = Data.questions[index];
  //
  //   // EL.cImg.src = q.images.main['1x'];
  //   // EL.cImg.srcset = `${q.images.main['2x']} 2x`;
  //   // EL.cImg.dataset.id = q.id + 1;
  // }

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

  static getResult(score) {
    let result = {};
    let index = 0;

    Data.results.some((item, i) => {
      if (item.range[0] <= score && item.range[1] >= score) {
        result = item;
        index = i;
        return true;
      }
      return false;
    });

    return { result, index };
  }

  onOptionHover(e) {
    if (this.isAnswered || this.activeIndex > 0) return;

    const el = e.currentTarget;
    const t = el.dataset.type;
    const hint = makeElement('div', [`${CSS.main}__option-hint`, `${CSS.main}__option-hint--${t}`], {
      innerHTML: t === 'left' ? `<div>Или свайпните карточку влево</div>${Svg.swipeL}` : `${Svg.swipeR}<div>Или свайпните карточку вправо</div>`,
    });

    el.appendChild(hint);

    const onOptionLeave = () => {
      el.removeEventListener('mouseout', onOptionLeave);
      el.removeEventListener('click', onOptionLeave);
      el.removeChild(hint);
    };
    el.addEventListener('mouseout', onOptionLeave);
    el.addEventListener('click', onOptionLeave);
  }

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
      EL.optionL.addEventListener('mouseover', this.onOptionHover.bind(this));
      EL.optionR.addEventListener('mouseover', this.onOptionHover.bind(this));
    }

    this.initCardEvents();

    Analytics.sendEvent(`${this.typeShowing} — Start`);
  }

  restart() {
    shuffle(Data.questions);

    this.container.classList.remove('is-result');
    this.container.removeChild(EL.final);
    this.container.appendChild(EL.q);

    EL.bcAnswerBtn.dataset.click = 'continue';

    this.setInitialParams();
    this.initCardEvents();

    this.makeNextQuestion();

    Analytics.sendEvent(`${this.typeShowing} — Restart`);
  }

  continue(el, e, trigger = 'Click') {
    if (this.animationInProgress) {
      return;
    }

    EL.cards.style.perspective = '';

    this.activeIndex += 1;

    const animationClassName = this.lastAnsweredType === 'left' ? 'fadeOutLeft' : 'fadeOutRight';

    animate(EL.cardWrapper, animationClassName).then(() => {
      this.container.dataset.dir = '';
      this.container.classList.remove('is-answered');
      this.container.classList.remove('is-correct');
      this.container.classList.remove('is-incorrect');

      EL.cards.removeChild(EL.cardWrapper);
      EL.cardInner.style.transform = '';

      this.makeNextQuestion();
    });

    Analytics.sendEvent(`${this.typeShowing} — Next`, trigger);
  }

  makeNextQuestion() {
    const question = Data.questions[this.activeIndex];

    this.isAnswered = false;
    EL.cPages.innerHTML = `<span>${this.activeIndex + 1}</span> /${Data.questions.length}`;

    EL.cImg.innerHTML = `<div data-index="${question.id + 1}">${question.img.repeat(5)}</div>`;
    EL.cText.innerHTML = question.text;

    this.showCount();

    EL.cards.appendChild(EL.cardWrapper);
    animate(EL.cardWrapper, 'cardZoomIn', '300ms');
  }

  answer(t, trigger = 'Click') {
    if (this.isAnswered) { return; }
    this.isAnswered = true;

    this.container.dataset.dir = t;

    const question = Data.questions[this.activeIndex];

    this.lastAnsweredType = t;

    this.makeAnswer(question, t);

    Analytics.sendEvent(`${this.typeShowing} — (Question index: ${this.activeIndex},  id: ${question.id}) — Option: ${t}`, trigger);
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
      EL.bcAnswerTitle.textContent = 'Верно';
    } else {
      this.container.classList.add('is-incorrect');
      // EL.backCard.classList.add('is-incorrect');
      // EL.bcAnswerImg.src = question.images.incorrect['1x'];
      // EL.bcAnswerImg.srcset = `${question.images.incorrect['2x']} 2x`;
      EL.bcAnswerTitle.textContent = 'Неверно';
    }

    // EL.bcAnswerImg.dataset.id = question.id + 1;

    EL.bcAnswerText.innerHTML = question.answer;

    if (this.activeIndex < Data.questions.length - 1) {
      this.timer = setTimeout(() => {
        // Special.changeCardImages(this.activeIndex + 1);
        EL.cards.style.perspective = 'none';
        this.animationInProgress = false;
      }, 600);
    }

    if (this.activeIndex === Data.questions.length - 1) {
      EL.bcAnswerBtn.dataset.click = 'result';
    }
  }

  result(el, e, trigger = 'Click') {
    const { result, index } = Special.getResult(this.correctAnswers);

    EL.cards.style.perspective = '';
    EL.cardInner.style.transform = '';

    this.container.dataset.dir = '';
    this.container.classList.remove('is-correct');
    this.container.classList.remove('is-incorrect');
    this.container.classList.remove('is-answered');
    this.container.classList.add('is-result');
    this.container.removeChild(EL.q);
    this.container.appendChild(EL.final);

    EL.fImg.innerHTML = result.img;
    EL.fResult.innerHTML = `<b>${this.correctAnswers} из ${Data.questions.length}</b> правильных ответов`;
    EL.fTitle.innerHTML = result.text;

    removeChildren(EL.fShare);
    Share.make(EL.fShare, {
      url: `${this.params.share.url}/${index + 1}`,
      title: this.params.share.title,
      twitter: this.params.share.title,
    });

    this.destroyCardEvents();

    Analytics.sendEvent(`${this.typeShowing} — Result`, trigger);
  }

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

  destroyCardEvents() {
    document.removeEventListener('keyup', this.keyUpHandler);
  }

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
    Analytics.sendEvent(`${this.typeShowing} — Show`, 'Init');
  }
}

export default Special;
