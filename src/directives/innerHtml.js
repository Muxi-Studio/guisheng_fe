export default {
    bind: function(el, binding) {
    	console.log(el.innerHTML)
    	// document.addEventListener("onkeyup",console.log("huahuah"))
    	document.onkeydown = function(){
    		binding.value(el.innerHTML)
    	}
    }
}
