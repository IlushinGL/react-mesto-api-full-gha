const { NODE_ENV = 'develoupment' } = process.env;
// TODO: Подумать как вынести список в .env
const allowedCors = [
  'https://mesto.iknow.studio',
  'http://mesto.iknow.studio',
  '127.0.0.1:3000',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем режим
  if (NODE_ENV !== 'production') {
    // устанавливаем заголовок, который разрешает браузеру запросы с любого источника
    res.header('Access-Control-Allow-Origin', '*');
  } else if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
};
