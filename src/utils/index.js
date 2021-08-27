export const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

export const turnOnCameraAndAudio = () =>
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

export const stopStreame = stream => {
  if (!stream) return;
  stream.getTracks().forEach(track => track.stop());
};

export const mergeObjects = ([obj1, obj2]) => ({ ...obj1, ...obj2 });
