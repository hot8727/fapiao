<template>
    <div id="app">
        <div class="resultWrapper">
            <div class="resultList" v-for="(item, index) in formatData.result" :key="index"
                :data-repeat="(item.repeatCard + 1) || (item.repeatDate + 1) || ''"
                :class="[{'hasRepeat': repeatData[index]}, {'repeatDate': item.repeatDate > -1}, {'repeatCard': item.repeatCard > -1}]">
                <div>{{ index + 1 }}、</div>
                <div class="resultCard">车牌： {{ item.card }}</div>
                <div class="resultDate">日期： {{ item.date }}</div>
                <div class="resultPrice">金额： {{ item.price }}</div>
            </div>
            <div class="wrapper">发票数量: {{ formatData.size }},  总金额：{{ formatData.total }},  去重后总金额：{{ formatData.sum }}</div>

            <section>
                <div class="invoiceList" v-for="(item, index) in statistic.result" :key="index">
                    金额：{{ item.price }}, 数量: {{ item.total }}, 合计: {{ item.sum }}
                </div>
                <div class="wrapper">总计 发票数量: {{ statistic.size }}, 总金额：{{ statistic.sum }}</div>
            </section>
        </div>
        <div class="inputWrapper">
            <p>此处输入发票， 每行一条发票信息</p>
            <p>输入格式： 车牌号, 发票金额, 发票日期。<br>可以使用逗号(,，)、空格、小数点(.)、星号(*)、斜杠(/)分隔</p>
            <textarea class="inputArea" v-model="value" placeholder="例：ta137, 195, 2020-01-08"></textarea>
        </div>
    </div>
</template>
<script>
export default {
    name: 'App',
    components: {
    },
    data () {
        return {
            'value': ''
        };
    },
    computed: {
        /** 数据格式化 */
        formatData () {
            const arr = this.value.split(/\s*\r?\n\s*/).filter(item => !!item);
            let sum = 0;
            let total = 0;
            const result = [];
            const cardTemp = {};
            const dateTemp = {};
            const priceTemp = {};

            arr.forEach((item, index) => {
                const temp = item.replace(/^\s*|\s*$/g, '').split(/\s*[\.|\,|\，|\s+|\*|\/]\s*/);
                const card = (temp[0] || '').toUpperCase();
                const price = temp[1] ? (parseInt(temp[1], 10) || 0) : 0;
                const date = temp[2] || '';

                total += price;

                let repeatCard = false;
                let repeatDate = false;

                /** 判断车牌是否重复 */
                if (cardTemp[card] > -1) {
                    repeatCard = true;
                } else {
                    cardTemp[card] = index;
                }

                /** 判断日期是否重复 */
                if (date && dateTemp[date] > -1) {
                    repeatDate = true;
                } else {
                    dateTemp[date] = index;
                }


                if (repeatCard || repeatDate) {
                    priceTemp[card] = Math.max(priceTemp[card], price);
                } else {
                    priceTemp[card] = price;
                }

                result.push({
                    card,
                    price,
                    date,
                    'repeatCard': repeatCard ? cardTemp[card] : -1,
                    'repeatDate': repeatDate ? dateTemp[date] : -1
                });
            });

            for (const p in priceTemp) {
                if (priceTemp[p]) {
                    sum += priceTemp[p];
                }
            }

            return {
                total,
                sum,
                result,
                'size': arr.length
            };
        },
        /** 获取最终发票数量 */
        statistic () {
            const list = this.formatData.result.filter(item => item.repeatCard < 0 && item.repeatDate < 0).sort((itemA, itemB) => itemA.price - itemB.price);
            let sum = 0;
            const res = new Map();

            list.forEach(item => {
                const temp = res.get(item.price);
                res.set(item.price, (temp || 0) + 1);
                sum += item.price;
            });

            return {
                sum,
                'size': list.length,
                'result': [...res.entries()].map(([k, v]) => {
                    return {'price': k, 'sum': k * v, 'total': v};
                })
            };
        },
        /** 被重复的发票 */
        repeatData () {
            const list = this.formatData.result.filter(item => item.repeatCard > -1 || item.repeatDate > -1);

            const result = {};

            list.forEach(item => {
                if (item.repeatCard > -1) {
                    if (!result[item.repeatCard]) {
                        result[item.repeatCard] = {
                            'repeatCard': true
                        };
                    } else {
                        result[item.repeatCard]['repeatCard'] = true;
                    }
                }

                if (item.repeatDate > -1) {
                    if (!result[item.repeatDate]) {
                        result[item.repeatDate] = {
                            'repeatDate': true
                        };
                    } else {
                        result[item.repeatDate]['repeatDate'] = true;
                    }
                }
            });

            return result;
        }
    },
    created () {

    },
    mounted () {

    },

    methods: {

    }
};
</script>
<style lang="less" scoped>
#app {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    font-size: 14px;
    line-height: 30px;

    .resultWrapper {
        flex: 0 0 auto;
        width: 600px;
        padding: 32px 16px;

        .resultList {
            position: relative;
            display: flex;

            &.hasRepeat {
                color: #67C23A;
            }
            &.repeatDate {
                color: #E6A23C;
            }
            &.repeatCard {
                color: #F56C6C;
            }

            &.repeatDate::after {
                content: "和第"attr(data-repeat)"个发票日期重复";
                display: block;
                width: 200px;
                // position: absolute;
                // left: 100%;
                // top: 0;
                color: inherit;
            }


            &.repeatCard::after {
                content: "和第"attr(data-repeat)"个车牌号重复";
                display: block;
                width: 200px;
                // position: absolute;
                // left: 100%;
                // top: 0;
                color: inherit;
            }

            .resultCard,
            .resultDate,
            .resultPrice {
                position: relative;
                flex: 0 0 auto;
                width: 120px;
                margin: 0;

                overflow: visible;
            }
            .resultDate {
                width: 160px;
            }
        }
        .wrapper {
            color: #409EFF;
        }

        .invoiceList {
            position: relative;
            margin: 10px 0 0;

            &:first-child {
                margin-top: 30px;
            }
        }
    }
    .inputWrapper {
        flex: 0 0 auto;
        min-width: 300px;
        padding: 32px;

        .inputArea {
            width: 100%;
            height: 500px;
        }
    }
}
</style>
