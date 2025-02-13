function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : {
        r: 0,
        g: 0,
        b: 0,
      };
}

export function modifyImageColor(base64Image: string, newColor: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = function () {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      if (context != null) {
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const { data } = imageData;

        const rgb = hexToRgb(newColor);

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) {
            data[i] = rgb.r;
            data[i + 1] = rgb.g;
            data[i + 2] = rgb.b;
          }
        }

        context.putImageData(imageData, 0, 0);

        const modifiedBase64Image = canvas.toDataURL('image/png');

        resolve(modifiedBase64Image);
      } else {
        reject(new Error('Browser not supper 2d canvas'));
      }
    };

    image.onerror = function () {
      reject(new Error('Failed to load the image.'));
    };

    image.src = base64Image;
  });
}
