/**
 * img一系列api
 * 包括，压缩，剪裁
 */
class FastImg {
    /**
     * 
     * @param {*} img 接受img element, img file, img src 
     */
    constructor(img) {
        this._init(img);
    }

    _init(img) {
        this._storage = {
            canvas: {
                element: null,
                context: null,
                imageEle: null,
                inputImg: img
            }
        };
    }

    _getImgSrc(img) {
        let imgSrc;
        if (typeof img === 'object') {
            if (img instanceof HTMLElement) {
                imgSrc = img.src;
            }
            else if (img.type && img.type.indexOf('image') !== -1) {
                imgSrc = (new FileReader()).readAsDataURL(img);
            }
            else {
                throw new Error();
            }
        }
        else if (typeof img === 'string') {
            imgSrc = img;
        }
        else {
            throw new Error();
        }

        return imgSrc;
    }

    _createCanvas(imageEle) {
        return new Promise((resolve, reject) => {
            const canvas = document.getElementById('testCanvas');//document.createElement('canvas');
            const context = canvas.getContext('2d');
            this._storage.canvas.element = canvas;
            this._storage.canvas.context = context;
    
            const oWidth = imageEle.width;
            const oHeight = imageEle.height;
    
            canvas.width = oWidth;
            canvas.height = oHeight;
            context.drawImage(imageEle, 0, 0, oWidth, oHeight);

            resolve();
        });
    }

    _loadImage(inputImg = this._storage.canvas.inputImg) {
        return new Promise((resolve, reject) => {
            const newImgElement = new Image();

            newImgElement.onload = () => { resolve(newImgElement); }
            newImgElement.src = this._getImgSrc(inputImg);
        });
    }

    _getSameRadioSize(width, height, originSizeRef = this._storage.canvas.element) {
        const oWidth = originSizeRef.width;
        const oHeight = originSizeRef.height;
        const hasWidthArg = typeof width !== 'undefined';
        const hasHeightArg = typeof height !== 'undefined';

        if (!hasWidthArg && hasHeightArg) {
            width = oWidth / oHeight * height;
        }
        else if (hasWidthArg && !hasHeightArg) {
            height = oHeight / oWidth * width;
        }
        else if (!hasWidthArg && !hasHeightArg) {
            width = oWidth;
            height = oHeight;
        }

        return {
            width,
            height
        };
    }

    ready() {
        return this._loadImage().then((imageEle) => {
            this._storage.canvas.imageEle = imageEle;
            return this._createCanvas(imageEle);
        });
    }
    clip(x = 0, y = 0, width, height, radius) {
        return new Promise((resolve, reject) => {            

            this.toDataURL().then((url) => {
                return this._loadImage(url);
            }).then((imageEle) => {
                const canvas_context = this._storage.canvas.context;
                const canvas_element = this._storage.canvas.element;

                // 清除画布
                canvas_context.clearRect(0, 0, canvas_element.width, canvas_element.height);
                canvas_element.width = width;
                canvas_element.height = height;
                canvas_context.fillStyle = '#fff';
                canvas_context.fillRect(0, 0, canvas_element.width, canvas_element.height);
                
                // 绘制圆角矩形
                canvas_context.beginPath();
                canvas_context.arc(0 + radius, 0 + radius, radius, Math.PI, Math.PI * 3 / 2);
                canvas_context.lineTo(width - radius + 0, 0);
                canvas_context.arc(width - radius + 0, radius + 0, radius, Math.PI * 3 / 2, Math.PI * 2);
                canvas_context.lineTo(width + 0, height + 0 - radius);
                canvas_context.arc(width - radius + 0, height - radius + 0, radius, 0, Math.PI * 1 / 2);
                canvas_context.lineTo(radius + 0, height + 0);
                canvas_context.arc(radius + 0, height - radius + 0, radius, Math.PI * 1 / 2, Math.PI);
                canvas_context.clip();
                canvas_context.closePath();

                // 偏移
                canvas_context.save();
                canvas_context.translate(-x, -y);
                canvas_context.drawImage(imageEle, 0, 0, imageEle.width, imageEle.height);
                canvas_context.restore();

                this._storage.canvas.imageEle = imageEle;
                this._storage.canvas.imageEle.width = width;
                this._storage.canvas.imageEle.height = height;
                resolve();
            });
            
        })
    }
    zip(quality = 0.5, width, height, type = 'image/jpeg') {
        const canvas_element = this._storage.canvas.element;
        const canvas_context = this._storage.canvas.context;
        const sameRadioSize = this._getSameRadioSize(width, height);

        return this.toDataURL(type, quality).then((url) => {
            return this._loadImage(url);
        }).then((imageEle) => {
            canvas_element.width = sameRadioSize.width;
            canvas_element.height = sameRadioSize.height;

            canvas_context.clearRect(0, 0, sameRadioSize.width, sameRadioSize.height);
            canvas_context.drawImage(imageEle, 0, 0, sameRadioSize.width, sameRadioSize.height);

            this._storage.canvas.imageEle = imageEle;
            this._storage.canvas.imageEle.width = sameRadioSize.width;
            this._storage.canvas.imageEle.height = sameRadioSize.height;
        });
    }
    rotate(deg = 0) {
        return new Promise((resolve, reject) => {
            const canvas_context = this._storage.canvas.context;
            const canvas_element = this._storage.canvas.element;
            const imageEle = this._storage.canvas.imageEle;

            if (deg % 90 === 0) {
                const isEven = deg / 90 % 2 === 0;
                if (isEven) {
                    canvas_element.width = imageEle.width;
                    canvas_element.height = imageEle.height;
                }
                else {
                    canvas_element.width = imageEle.height;
                    canvas_element.height = imageEle.width;
                }
            }
            else {
                canvas_element.width = Math.sqrt((imageEle.width * imageEle.width) + (imageEle.height * imageEle.height));
                canvas_element.height = canvas_element.width;
            }

            canvas_context.save();
            canvas_context.clearRect(0, 0, canvas_element.width, canvas_element.height);
            canvas_context.fillStyle = '#fff';
            canvas_context.fillRect(0, 0, canvas_element.width, canvas_element.height);
            canvas_context.translate(canvas_element.width / 2, canvas_element.height / 2);
            canvas_context.rotate(deg * Math.PI / 180);
            canvas_context.drawImage(imageEle, (-imageEle.width / 2), (-imageEle.height / 2), imageEle.width, imageEle.height);
            canvas_context.restore();

            resolve();
        });
    }
    scale(x = 1, y = x) {
        return new Promise((resolve, reject) => {

            this.toDataURL().then((url) => {
                return this._loadImage(url);
            }).then((imageEle) => {
                const canvas_context = this._storage.canvas.context;
                const canvas_element = this._storage.canvas.element;

                // 清除画布
                canvas_context.clearRect(0, 0, canvas_element.width, canvas_element.height);
                canvas_element.width = canvas_element.width * x;
                canvas_element.height = canvas_element.height * y;
                canvas_context.fillStyle = '#fff';
                canvas_context.fillRect(0, 0, canvas_element.width, canvas_element.height);

                // 缩放
                canvas_context.save();
                canvas_context.scale(x, y);
                canvas_context.drawImage(imageEle, 0, 0, imageEle.width, imageEle.height);
                canvas_context.restore();

                // this._storage.canvas.imageEle = imageEle;
                // this._storage.canvas.imageEle.width = width;
                // this._storage.canvas.imageEle.height = height;
                resolve();
            });
        });
    }
    mix(img, x = 0, y = 0, width, height) {
        return this._loadImage(img).then((imageEle) => {
            const sameRadioSize = this._getSameRadioSize(width, height, imageEle);
            this._storage.canvas.context.drawImage(imageEle, x, y, sameRadioSize.width, sameRadioSize.height);
        });
    }
    // TODO: 怎么处理type
    toDataURL(type = 'image/jpeg', quality = 1) {
        return new Promise((resolve, reject) => {
            resolve(this._storage.canvas.element.toDataURL(type, quality));
        });
    }
    toBlob() {}
}

export default FastImg;