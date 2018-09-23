<template>
    <div>
        <header class="header">
            <img src="../assets/star.png" alt="" class="header-img">
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
.header{
    text-align: center;
    .header-img{
        margin-top: 30px;
        width: 40px;
    }
}
.title{
    max-width: 100%;
    width: 600px;
    margin: 60px auto;
    .title-h1{
        margin: 0;
    }
    .title-date{
        // font-family: "PT Sans";
        text-align: right;
        margin: 0;
    }
}
.body{
    max-width: 100%;
    width: 600px;
    margin: 80px auto 0;
    text-align: left;
    font-size: 16px;
}
.title-date-logo{
    height: 16px;
    margin-right: 5px;
    vertical-align: middle;
}
</style>
