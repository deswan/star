<template>
	<div class="index-page">
		<header class="header">
			<h1 class="header-text">Star`s <span class="header-text-last">Blog</span></h1>
		</header>
		<section class="main">
			<div class="year-list" v-for="yearData in items" :key="yearData.year">
				<div class="year">- {{yearData.year}} -</div>
				<router-link class="article-item" v-for="article in yearData.items" :key="article.name" :to="{name: 'article', params:{id: article.name}}">
					<h1>{{article.title}}</h1>
					<p class="article-item-date">
							<img src="../assets/time.svg" class="article-item-date-logo" alt="">
							<span style="vertical-align: middle">{{article.modified_date}}</span>   
					</p>
				</router-link>
			</div>
		</section>
		<footer class="footer">
			<div class="pagination" v-if="totalPage">
				<a href="javascript:;" class="pagination-last" :class="{disabled: page <= 1}" @click="lastPage">
					<img src="~assets/arrow-left.svg" alt="">
				</a>
				<div class="pagination-body">
					<a href="javascript:;" class="pagination-number" :class="{active: n == page}" v-for="n in totalPage" :key="n" @click="toPage(n)">{{n}}</a>
				</div>
				<a href="javascript:;" class="pagination-next" :class="{disabled: page >= totalPage}" @click="nextPage">
					<img src="~assets/arrow-right.svg" alt="">
				</a>
			</div>
		</footer>
	</div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "StarIndex",
  async asyncData({ store, route }) {
    return store.dispatch("FETCH_ALL_ARTICLES", {
      page: route.query.page || 1
    });
  },
  data() {
    return {
      page: 1,
      totalPage: 1
    };
	},
	beforeRouteUpdate(to, from, next){
		this.page = parseInt(to.query.page || 1);
		next();
	},
  created() {
    this.page = parseInt(this.$route.query.page || 1);
    this.totalPage = this.$store.state.allArticles.totalPage;
  },
  computed: {
    items() {
      let rawItems = this.$store.state.allArticles.items;
      let items = [];
      rawItems.forEach(e => {
        let year = dayjs(e.modified_date).year();
        if (!items.length || items[items.length - 1].year !== year) {
          items.push({ year, items: [e] });
        } else {
					items[items.length - 1].items.push(e);
        }
      });
      return items;
    }
  },
  methods: {
    lastPage() {
			if (this.page <= 1) return;
      this.$router.push({
        query: { page: this.page - 1 }
      });
    },
    nextPage() {
      if (this.page >= this.totalPage) return;
      this.$router.push({
        query: { page: this.page + 1 }
      });
    },
    toPage(page) {
      if (page == this.page || page > this.totalPage || page < 1) return;
      this.$router.push({
        query: { page }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.index-page {
  display: flex;
  flex-flow: column nowrap;
  min-height: 100vh;
}
.header {
  flex: none;
  height: 80px;
  line-height: 80px;
  text-align: center;
  &-text {
    position: relative;
    font-size: 20px;
    display: inline-block;
    height: 100%;
    font-weight: normal;
    margin: 0;
  }
  &-text::after {
    position: absolute;
    content: "";
    width: 40px;
    background: url("../assets/star.png") center / 100% auto no-repeat;
    top: 0;
    left: 60px;
    height: 100%;
  }
  &-text-last {
    margin-left: 60px;
  }
}
.main {
  flex: auto;
  max-width: 100%;
  width: 700px;
  margin: 20px auto 0;
}
.year-list:not(:first-child){
	margin-top: 80px;
}
.year {
  user-select: none;
  margin: 10px auto;
  font-size: 20px;
  font-weight: bold;
  color: #ddd;
  line-height: 1;
}
.article-item {
	display: block;
	max-width: 100%;
	width: 400px;
	padding: 10px 0;
	margin: 40px auto 0;
	color: #666;

	&:first-of-type{
		margin-top: 0;
	}

	&:hover{
		h1{
			color: #999;
		}
	}
	
	h1{
	  transition: color ease .2s;
		font-size: 24px;
		font-weight: normal;
		margin: 0;
	}

	.article-item-date {
		text-align: center;
		margin: 0;
		margin-top: 5px;
	}
	.article-item-date-logo {
		height: 16px;
		margin-right: 5px;
		vertical-align: middle;
	}
}
.pagination {
	display: flex;
	align-items: center;
	justify-content: center;
  margin-top: 60px;
  font-size: 20px;
  color: #4a4a4a;
  a:link {
    color: #4a4a4a;
  }
  .pagination-last,
  .pagination-next {
		font-size: 0;
		transition: all ease .5s;
		transform: translateX(0);
		&.disabled {
			transition: none;
			cursor: default;
			opacity: .4;
		}
	}
	.pagination-last img,
  .pagination-next img{
		width: 40px;
		opacity: .8;
  }
  .pagination-last {
		margin-right: 20px;
		&:not(.disabled):hover{
			transform: translateX(-5px);
		}
  }
  .pagination-next {
		margin-left: 20px;
		&:not(.disabled):hover{
			transform: translateX(5px);
		}
  }
  .pagination-body {
    display: inline-block;
  }
  .pagination-number {
		margin-right: 20px;
		display: inline-block;
		width: 35px;
		height: 35px;
		transition: all ease .5s;	
		line-height: 35px;
		border-radius: 5px;
		user-select: none;

		&:not(.active):hover{
			background-color: #f2f2f2;
		}
		
		&.active{
			cursor: default;
			font-weight: bold;
		}

    &:last-child {
      margin-right: 0;
    }
  }
}
.footer {
  flex: none;
  overflow: hidden;
  padding-bottom: 50px;
}
.inform {
  position: relative;
  margin: 30px 0 30px;
  .views {
    font-size: 18px;
    color: #999;
  }
}
</style>
