import { setLanguage } from '../utils/languages.js';
import { moveNoise } from '../visual/effects.js';
//@ts-ignore
import { ids, BIG_TEXT, DEFAULT_TEXT } from '../index.js';

export function settings(): void {
  // Graphics settings elements
  const ultraRadio = document.getElementById("graphics-ultra-radio") as HTMLInputElement;
  const mediumRadio = document.getElementById("graphics-medium-radio") as HTMLInputElement;
  const noneRadio = document.getElementById("graphics-none-radio") as HTMLInputElement;
  const noiseCheckbox = document.getElementById("graphics-noise-checkbox") as HTMLInputElement;

  const gradientsContainer = document.querySelector('.gradients-container') as HTMLElement;
  const videoBackground = document.getElementById('video-background') as HTMLElement;
  const bgNoise = document.querySelector('.background-noise') as HTMLElement;

  // ---- Graphic quality radios ----
  ultraRadio.addEventListener("change", () => {
    if (ultraRadio.checked) {
      localStorage.setItem('graphics', 'ultra');
      gradientsContainer.style.display = 'block';
      videoBackground.style.display = 'none';
    }
  });

  mediumRadio.addEventListener("change", () => {
    if (mediumRadio.checked) {
      localStorage.setItem('graphics', 'medium');
      gradientsContainer.style.display = 'none';
      videoBackground.style.display = 'block';
    }
  });

  noneRadio.addEventListener("change", () => {
    if (noneRadio.checked) {
      localStorage.setItem('graphics', 'none');
      gradientsContainer.style.display = 'none';
      videoBackground.style.display = 'none';
    }
  });

  // ---- Noise toggle ----
  noiseCheckbox.addEventListener("change", () => {
    if (noiseCheckbox.checked) {
      localStorage.setItem('noise', 'on');
      bgNoise.style.display = 'block';
      ids.moveNoiseInterval = window.setInterval(moveNoise, 100);
    } else {
      localStorage.setItem('noise', 'off');
      bgNoise.style.display = 'none';
      clearInterval(ids.moveNoiseInterval);
    }
  });

  // Apply stored graphics settings
  const graphicsSetting = localStorage.getItem('graphics');
  switch (graphicsSetting) {
    case 'ultra':
      ultraRadio.checked = true;
      break;
    case 'medium':
      mediumRadio.checked = true;
      break;
    default:
      noneRadio.checked = true;
  }

  // Apply stored noise setting
  if (localStorage.getItem('noise') === 'on') {
    noiseCheckbox.checked = true;
  }

  // ---- Language switcher ----
  const languageSwitcher = document.getElementById('languageSwitcher') as HTMLSelectElement;
  languageSwitcher.addEventListener('change', (event) => {
    const value = (event.target as HTMLSelectElement).value;
    setLanguage(value);
    localStorage.setItem('language', value);
  });
  languageSwitcher.value = localStorage.getItem('language') ?? 'en';

  // ---- Big text toggle ----
  const bigTextCheckbox = document.getElementById('big-text-checkbox') as HTMLInputElement;
  bigTextCheckbox.addEventListener('change', () => {
    if (bigTextCheckbox.checked) {
      document.documentElement.style.fontSize = BIG_TEXT;
      localStorage.setItem('bigText', 'on');
    } else {
      document.documentElement.style.fontSize = DEFAULT_TEXT;
      localStorage.setItem('bigText', 'off');
    }
  });
  if (localStorage.getItem('bigText') === 'on') {
    bigTextCheckbox.checked = true;
    document.documentElement.style.fontSize = BIG_TEXT;
  }
}
