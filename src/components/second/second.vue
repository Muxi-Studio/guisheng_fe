<template>
    <div id="xxx" :style = "stopScroll">
        <skeleton v-show = "showSkeleton"></skeleton>
        <articleInfo ref="articleInfo"></articleInfo>
        <light ref = "light"></light>
        <ad></ad>
        <div :class="$style.recommend" v-show="list.length">
            <div :class="$style.title" v-on:click="closeComment">相关推荐</div>
            <item :item="item" v-for="item in list"></item>
        </div>
        <articleComments ref="articleComments"></articleComments>
        <div :class="$style.occupy"></div>
    </div>
</template>
<script>
import 'whatwg-fetch'
import Skeleton from './skeleton_s'
import info from './info'
import comments from './comment'
import Item from '../main/item'
import Map from '../../common/keymap.js'
import FETCH from '../../common/fetch.js'
import Light from './light'
import Ad from './ad'
import Cookie from '../../common/cookie.js'

export default {
    computed: {
        // a computed getter
        styleObject: function () {
            // `this` points to the vm instance
            return {
                transform: 'translateX(' + this.x + 'px)'
            }
        },
        stopScroll: function () {
            return{
                overflow: this.showComment ? 'hidden':'auto',
                height:this.showComment?'90%':''
            }
        }
    },
    data() {
        return {
            closeCom: false,
            x: 0,
            foo: 0,
            list: [],
            showComment:false,
            showSkeleton:true
        }
    },
    mounted() {
        var api = window.location.pathname
        var ids = api.split('/')
        var kind, i
        for (i = 1; i <= 4; i++) {
            if (Map.FETCH_URL_MAP[i] == ids[1])
                kind = i
        }
        let promise1 = FETCH.FetchData("/api/v1.0" + api + "/", "POST",{
            my_id: Cookie.getCookie("uid") ? Cookie.getCookie("uid"): -1
        })
        let promise2 = FETCH.FetchData("/api/v1.0/comments/?article_id=" + ids[2] + "&kind=" + kind, "GET")
        Promise.all([promise1, promise2]).then(values => {
            this.$refs.articleInfo.article = values[0]
            this.$refs.light.article = values[0]
            this.$refs.light.article.id = ids[2]
            this.showSkeleton = false
            FETCH.FetchData("/api/v1.0/" + ids[1] + "/recommend/", "POST", {
                article_id: ids[2]
            }).then(res => {
                this.list = res
            })
            this.$refs.articleComments.articleInfo = {
                id: ids[2],
                kind: values[0].kind,
                commentCount: values[0].commentCount,
                user_role: values[0].user_role,
                collected: values[0].collected
            }
            this.$refs.articleComments.obj = values[1]
            this.$refs.articleComments.url = "/api/v1.0/comments/?article_id=" + ids[2] + "&kind=" + kind
        })
    },
    components: {
        "articleInfo": info,
        "articleComments": comments,
        "item": Item,
        "light":Light,
        "ad":Ad,
        "skeleton":Skeleton
    },
    methods: {
        closeComment: function () {
            if (!this.closeCom) this.closeCom = true
        }
    }
}
</script>
<style lang='sass' module>
@import '../../scss/color.scss';
.title {
    font-size: 18px;
    color: $orange;
    margin: 15px;
}

.recommend {
    background-color: $grey;
}

.occupy {
    height: 50px;
    width: 100%;
}

</style>
