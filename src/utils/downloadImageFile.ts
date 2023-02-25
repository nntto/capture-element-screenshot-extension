// 画像をダウンロードする
function downloadImageFile(imageData: string, fileName: string) {
  // aタグを作成
  const link = document.createElement("a");
  link.href = imageData;
  link.download = fileName;
  document.body.appendChild(link);

  // aタグをクリック
  link.click();

  // aタグを削除
  document.body.removeChild(link);
}

export { downloadImageFile };
