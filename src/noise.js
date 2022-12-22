import 'https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js';
//import perlin from 'https://cdn.jsdelivr.net/gh/mikechambers/es6-perlin-module/perlin.js';
import perlin from './perlin-noise.js';

import {math} from './math.js';

export const noise = (function() {

  class _NoiseGenerator {
    constructor(params) {
      this._params = params;
      this._Init();
    }

    _Init() {
      this._noise = new SimplexNoise(this._params.seed);
    }

    Get(x, y, z) {
      const G = 2.0 ** (-this._params.persistence);
      const xs = x / this._params.scale;
      const ys = y / this._params.scale;
      const zs = z / this._params.scale;
      const noiseFunc = this._noise;

      let amplitude = 1.0;
      let frequency = 1.0;
      let normalization = 0;
      let total = 0;
      //fractional brownian motion
      for (let o = 0; o < this._params.octaves; o++) {
        const noiseValue = noiseFunc.noise3D(
          xs * frequency, ys * frequency, zs * frequency) * 0.5 + 0.5; //setiap di loop, ditambahkan layer noise, setiap loop kontribusi atau layer yang ditambahkan mengecil

        total += noiseValue * amplitude;
        normalization += amplitude;
        amplitude *= G; //mengurangi amplitudo
        frequency *= this._params.lacunarity; //membesarkan frekuensi, noise berubah lebih cepat, tetapi efek makin kecil
      }
      total /= normalization;
      return Math.pow(
          total, this._params.exponentiation) * this._params.height; //fungsi untuk meng-amplify hasil
    }
  }

  return {
    Noise: _NoiseGenerator
  }
})();
