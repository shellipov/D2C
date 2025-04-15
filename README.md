# Тестовое задание для D2C


## Предварительные требования

Node.js (v14 или выше)
npm (v6 или выше)
React Native CLI
Xcode (для iOS)
Android Studio (для Android)

## Установка

- Клонировать репозиторий
> git clone https://github.com/shellipov/D2C.git

- npm ci
- react-native start - запустить metro

### iOS

- cd ios && pod install
- npm run ios-open - открыть проект в XCode
- выбрать симулятор, Run

### Android

- открыть эмулятор в Android Studio
- запустить react-native run-android

## Настройки разработчика

В проекте реализованы функции для удобства разработки:

Имитация ошибок (файл Settings.vars.ts):
errorProbability - вероятность возникновения ошибок
Можно полностью отключить ошибки
Отладка (файл debug.vars.ts):
DebugVars.showScreenNames - отображение названий экранов

### Приложение написано в соответствии с задачей https://docs.google.com/document/d/1DRror8Rbj9xc8NJMXVosGVwdqY9k4uQ-gBrFrz71qss/edit?usp=sharing

ошибки и статистику можно посмотреть в профиле

Не все что хотел успел реализовать, например:
- нет инферсии зависимостей
- нет моделей данный и их методы находятся в датасторах
- не успел все отрефакторить
- не поддерживатся темная тема

  Скриншоты приложения
<div style="display: flex; flex-wrap: wrap; gap: 10px;"> <img src="readme-assets/1.png" width="200" alt="Главный экран"> <img src="readme-assets/2.png" width="200" alt="Каталог товаров"> <img src="readme-assets/3.png" width="200" alt="Корзина"> <img src="readme-assets/4.png" width="200" alt="Профиль"> </div>

