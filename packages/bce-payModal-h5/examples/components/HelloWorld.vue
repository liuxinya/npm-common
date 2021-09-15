<template>
  <div class="hello">
    <h1 @click='() => test()'>{{ msg }}</h1>
  </div>
</template>

<script>
// import test from './bce-paymodal-h5.umd'
// import './bce-paymodal-h5.css'
import test from '../../src/index';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    test () {
      console.log(test);
      const payInstance = test.create({
        orderId: 'ca9bd1660f25427cb5eb09b607228d64',
        httpConfig: {
          baseURL: ''
        }
      });
      payInstance.$on('paySucess', () => {
          this.step = 2;
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
