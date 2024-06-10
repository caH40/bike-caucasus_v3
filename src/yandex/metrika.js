const counterYandex = 93421903;

export function sendMetrika(type, value) {
  window.ym(counterYandex, type, value);
}
