<template>
    <div class="article">
        <header class="header">
            <router-link to="/">
                <img src="../assets/star.png" alt="" class="header-img">
            </router-link>
        </header>
        <section class="title">
            <h1 class="title-h1">{{article.title}}</h1>
            <p class="title-date">
                <img src="../assets/time.svg" class="title-date-logo" alt="">
                <span style="vertical-align:middle">{{article.modified_date}}</span>   
            </p>
        </section>
        <section class="body md" v-html="article.document">
        </section>
    </div>
</template>

<script>
import dayjs from "dayjs";
export default {
    name: 'StarArticle',
    async asyncData({ store, route }){
        return store.dispatch('FETCH_ARTICLE', {id: route.params.id})
    },
    data(){
        return {
            article:{}
        }
    },
    created(){
        this.article = this.$store.state.article;   
    }
}
</script>

<style lang="scss" scoped>
.article{
    max-width: 90%;
    margin: auto;
}
.header{
    text-align: center;
    .header-img{
        margin-top: 22px;
        width: 40px;
    }
}
.title{
    font-size: 18px;
    max-width: 100%;
    width: 600px;
    margin: 60px auto;
    .title-h1{
        font-weight: normal;
        margin: 0;
    }
    .title-date{
        text-align: right;
        margin: 0;
        text-align: center;
        margin-top: 10px;
    }
}
.body{
    max-width: 100%;
    width: 650px;
    margin: 120px auto;
    text-align: left;
    font-size: 18px;
}
.title-date{
    font-size: 16px;
}
.title-date-logo{
    height: 16px;
    margin-right: 5px;
    vertical-align: middle;
}
</style>
