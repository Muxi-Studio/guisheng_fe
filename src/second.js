import Vue from 'vue'
import Second from './components/second/second'
import vueFinger from 'vue-finger'

Vue.use(vueFinger)

Vue.directive('dbclick', {
   bind: function (el, binding, vnode) {
   	console.log("initial value", binding.value)
   	el.addEventListener("dblclick",binding.value)
  }

})

new Vue({
  el: '#app1',
  render: h => h(Second)
})
