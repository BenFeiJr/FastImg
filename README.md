# FastImg
---
FastImg can help you process image, such as compression, clipping, mix, etc

## Installation
---
### NPM
`npm install fastimg`    


Then load
```js
// ES6
import FastImg from 'fastimg';
```

## Example
---
```js
// load
import FastImg from 'fastimg';

// create instance
// `img` can be img file, img html element or img link href
const fastImgIns = new FastImg(img);

// then, can call `fastImgIns` methods
// for example

// `ready` method must be called first, which means that image has been loaded. 
// Then the methods to handle image can be called.
fastImgIns.ready().then(() => {
    return fastImgIns.zip(0.2);
}).then(() => {
    return fastImgIns.rotate(90);
}).then(() => {
    return fastImgIns.mix(otherImg, 10, 10);
}).then(() => {
    return fastImgIns.clip(20, 20, 150, 150, 15);
}).then(() => {
    return fastImgIns.scale(2);
}).then(() => {
    return fastImgIns.toDataURL();
}).then((base64Url) => {
    console.log(base64Url);
});

```

## API
---
1. new FastImg(img)
```js
/**
 * img
 *
 * @param {Object|string} img can be img html element, img file or img href link 
 */
const fastImgIns = new FastImg(img)
```


2. ready()
```js
/**
 * means image has been loaded, it must be called first
 * 
 * @return {Promise}
 */
fastImgIns.ready();
```


3. clip(x, y, width, height, radius)
```js
/**
 * clip image
 * 
 * @param {number} x clipping start x axis position
 * @param {number} y clipping start y axis position 
 * @param {number} width clipping width 
 * @param {number} height clipping height 
 * @param {number=} radius clipping radius, default 0
 * @return {Promise}
 * 
 * When width and height are equal, and radius is half width, then you get a circle  
 */
fastImgIns.clip(x, y, width, height, radius)
```


4. zip(quality, width, height, type)
```js    
/**
 * compress image
 * 
 * @param {number} quality compress quality, 0 - 1, default 0.5
 * @param {number=} width change compressed image width, default image origin width
 * @param {number=} height change compressed image height, default image origin height
 * @param {string} type change compressed image type, default `image/jpeg`
 * @return {Promise}
 * 
 * When type is `image/jpeg`, the image is lossy compression. 
 * If you need lossless compression, you can set quality to 1, then reduce width and height.
 */
fastImgIns.zip(quality, width, height, type)
```


5. rotate(deg)
```js 
/**
 * rotate image
 * 
 * @param {number} deg rotation angle
 * @return {Promise}
 */
fastImgIns.rotate(deg)
```


6. scale(x, y)
```js 
/**
 * scale image
 * 
 * @param {number} x x axis zoom factor
 * @param {number=} y y axis zoom factor, if no y parameter, then y is equal to x by default
 * @return {Promise}
 */
fastImgIns.scale(x, y)
```
    
    
7. mix(img, x, y, width, height)
```js 
/**
 * mix another image to current Image
 * 
 * @param {Object|string} img another image 
 * @param {number=} x x axis position of another image, default 0
 * @param {number=} y y axis position of another image, default 0
 * @param {number=} width another image width, default image width 
 * @param {number=} height another image height, default image height 
 * @return {Promise}
 */
fastImgIns.mix(img, x, y, width, height)
```


8. toDataURL()
```js
fastImgIns.toDataURL()
```


9. toBlob()
```js  
fastImgIns.toBlob()
```

## Authors
---
BenFeiJr

## License
---
MIT
