export default {
  name: 'Waves', // уникальное имя спецпроекта. Оно же — название главного класса. Используется на странице, куда интегрируется спецпроект
  analyticsCategory: 'Waves Web 3.0',
  sendPageView: false, // отключаем, если спецпроект не на отдельной странице
  listenedEvents: ['click'], // слушаем события (click, input, change, etc.). Обычно нужен только click
};
