import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";

import Compressor from "compressorjs"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const flyAndScale = (
  node,
  params = { y: -8, x: 0, start: 0.95, duration: 150 }
) => {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;

  const scaleConversion = (valueA, scaleA, scaleB) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;

    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;

    return valueB;
  };

  const styleToString = (style) => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str;
      return str + `${key}:${style[key]};`;
    }, "");
  };

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t
      });
    },
    easing: cubicOut
  };
};

export function removeDuplicates(key, array) {
  return array.filter((obj1, i, arr) =>
    arr.findIndex(obj2 =>
      [key].every(key => obj2[key] === obj1[key])
    ) === i
  )
}

export async function compressImage(e) {
  const filesFromElement = [...e.target.files];

  if (!filesFromElement) return;
  let dt = [];

  await Promise.all(
    filesFromElement.map((file) => {
      new Compressor(file, {
        quality: 0.6,
        height: 1024,
        strict: true,
        success(result) {
          let file;
          let name = result.name;
          let type = result.type;
          if (result instanceof Blob) {
            file = new File([result], "compressed_" + name, { type });
          } else {
            file = result;
          }
          dt.push(file);
        },
        error(err) {
          console.log(err.message);
        },
      })
    })
  )
  return dt

}
