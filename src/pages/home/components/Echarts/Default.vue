<template>
    <div class="default">
        <canvas id="circle-canvas" @mousemove="onCanvasHover"/>
    </div>
</template>
<script>
import { debounce } from 'lodash'
function rads(x) {
    return Math.PI * x / 180;
}
export default {
    name: "Default",
    props: ['colorBlue'],
    data() {
        return {
            pixel: null,
            canvas: null,
            ctx: null,
            circle: {
                radius: 100,
                lineWidth: 38,
                hoverLineWidth: 48
            }
        };
    },
    mounted() {
        window.addEventListener('resize', this.onInitCanvas)
        this.$once('hook:beforeDestroy', () => {
            window.removeEventListener('resize', this.onInitCanvas)
        })
        this.onInitCanvas()
    },
    watch:{
        colorBlue(newVal, oldVal){
            if(newVal != oldVal){
                if(newVal){
                    this.fillColor(true)
                    switch(newVal) {
                        case 1:
                            this.drawSafe('rgba(169, 238, 230, 1)')
                            break
                        case 2:
                            this.drawEnv('rgba(169, 238, 230, 1)')
                            break
                        case 3:
                            this.drawElectric('rgba(169, 238, 230, 1)')
                            break
                        case 4:
                            this.drawSyn('rgba(169, 238, 230, 1)')
                    }
                }else{
                    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
                    this.draw()
                }  
            }
        }
    },
    methods: {
        onInitCanvas() {
            this.ctx && this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            const { offsetWidth, offsetHeight } = document.querySelector('.default')
            !this.cavans && (this.canvas = document.querySelector('#circle-canvas'))
            this.canvas.setAttribute('width', offsetWidth)
            this.canvas.setAttribute('height', offsetHeight)
            this.circle.radius = this.canvas.width / 2 - 56
            this.ctx = this.canvas.getContext('2d')
            this.draw()
            this.pixel = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height).data;
        },
        drawCircularText(string, startAngle, endAngle, color = 'rgba(18, 201, 180, 1)') {
            var radius = this.circle.radius + 10,
                angleDecrement = (startAngle - endAngle) / (string.length - 1),
                angle = parseFloat(startAngle),
                index = 0,
                character;
            this.ctx.save();
            this.ctx.fillStyle = color;
            this.ctx.font = 'italic 16px 微软雅黑';
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'middle';
            while(index < string.length) {
                character = string.charAt(index);
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.translate(this.canvas.width / 2 + 16 + Math.cos(angle) * radius,
                    this.canvas.height / 2 + 7 + Math.sin(angle) * radius);
                // this.ctx.rotate(Math.PI / 2 + angle);
                this.ctx.fillText(character, 0, 0);
                angle -= angleDecrement;
                index++;
                this.ctx.restore();
            }
            this.ctx.restore();
        },
        _onHover: debounce(function(layerX, layerY) {
            const currentPosition = layerY * this.canvas.width + layerX,
                  r = this.pixel[4*currentPosition + 0],
                  g = this.pixel[4*currentPosition + 1],
                  b = this.pixel[4*currentPosition + 2],
                  a = this.pixel[4*currentPosition + 3];
            if(r !== 0) {
                this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
                this.draw()
                this.fillColor(true)
                switch(true) {
                    // 安全生产
                    case layerX <= this.canvas.width / 2 && layerY <= this.canvas.height / 2:
                        this.$emit('show', 1)
                        this.drawSafe('rgba(169, 238, 230, 1)')
                        break
                    case layerX >= this.canvas.width / 2 + 15 && layerY <= this.canvas.height / 2:
                        this.$emit('show', 2)
                        this.drawEnv('rgba(169, 238, 230, 1)')
                        break
                    case layerX <= this.canvas.width / 2 + 15 && layerY >= this.canvas.height / 2:
                        this.$emit('show', 3)
                        this.drawElectric('rgba(169, 238, 230, 1)')
                        break
                    case layerX >= this.canvas.width / 2 + 15 && layerY >= this.canvas.height / 2 + 15:
                        this.$emit('show', 4)
                        this.drawSyn('rgba(169, 238, 230, 1)')
                }
            } else {
                this.$emit('clear')
                this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
                this.draw()
            }  
        }, 18),
        fillColor(flag) {
            if(flag) {
                this.ctx.lineWidth = this.circle.hoverLineWidth;   
                this.ctx.fillStyle = "rgba(169, 238, 230, 1)"
                this.ctx.strokeStyle = 'rgba(18, 201, 180, 1)';
            } else {
                this.ctx.lineWidth = this.circle.lineWidth;   
                this.ctx.fillStyle = "rgba(18, 201, 180, 1)"
                this.ctx.strokeStyle = 'rgba(169, 238, 230, 1)';
            }
        },
        draw(flag) {
            this.fillColor(flag)
            this.drawSafe()
            this.drawElectric()
            this.drawEnv()
            this.drawSyn()
        },
        onCanvasHover(e) {
            const { layerX, layerY } = e 
            this._onHover(layerX, layerY)
        },
        drawSafe(color = 'rgba(18, 201, 180, 1)') {
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.circle.radius, Math.PI, Math.PI*1.5, false);
            this.ctx.stroke();
            this.drawCircularText('安全生产', rads(-170), rads(-100), color)
        },
        drawElectric(color = 'rgba(18, 201, 180, 1)') {
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2 + 15, this.circle.radius, Math.PI/2, Math.PI, false);
            this.ctx.stroke();
            // 绘制字体
            this.drawCircularText('电计表分', rads(100), rads(170), color)
        },
        drawEnv(color = 'rgba(18, 201, 180, 1)') {
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2 + 15, this.canvas.height / 2, this.circle.radius, Math.PI * 1.5, 0, false);
            this.ctx.stroke();
            this.drawCircularText('环卫监管', rads(-80), rads(-10), color)
        },
        drawSyn(color = 'rgba(18, 201, 180, 1)') {
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2 + 15, this.canvas.height / 2 + 15, this.circle.radius, 0, Math.PI/2, false);
            this.ctx.stroke();  
            this.drawCircularText('理治合综', rads(10), rads(80), color)
        }
    }
};
</script>
<style lang="less" scoped>
@import (reference) "~@/assets/css/common.less";
.default {
    height: 100%;
    .flex(row, center);
    .pr;
}
</style>