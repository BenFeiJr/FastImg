import FastImg from '../src/FastImg.js';

const inputImg = document.getElementById('input');
const inputImgFile = document.getElementById('file');
const outputImg = document.getElementById('output');

const fastImgIns = new FastImg(inputImg.src);

fastImgIns.ready().then((res) => {
    return fastImgIns.zip(0.2, 300);
}).then((res) => {
    return fastImgIns.rotate(0);
}).then((res) => {
    return fastImgIns.mix('./2.png', 10, 10, 100);
}).then((res) => {
    return fastImgIns.clip(20, 20, 150, 150, 15);
}).then((res) => {
    return fastImgIns.scale(5);
}).then((res) => {
    return fastImgIns.toJpeg();
}).then((res) => {
    outputImg.src = res;
}).catch((err) => {
    console.log(err)
});

document.getElementById('download').onclick = () => {
    const link = document.createElement('a');
    link.download = 'aaa.jpeg';
    link.href = outputImg.src;
    link.click();
};
