import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_STR } from "./constants";

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject("No file to upload");
    if (file.size > MAX_FILE_SIZE_BYTES) return reject(`File is too large (max: ${MAX_FILE_SIZE_STR})`);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      const base64str = result.replace(/^data:.+,/, "");
      const fileTypeArr = result.match(/(?<=^data:.+\/).+(?=;base64,)/);
      const fileType = fileTypeArr && fileTypeArr[0] !== "octet-stream" ? fileTypeArr[0] : "bin";
      return resolve({base64str: base64str, url: URL.createObjectURL(file), fileName: file.name, fileType: fileType});
    };
    reader.onerror = () => reject("File failed to upload");
    reader.readAsDataURL(file);
  });
}

export {uploadFile}