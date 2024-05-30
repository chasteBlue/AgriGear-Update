
var mainImg = document.getElementById("mainImg");
var smallImg = document.getElementsByClassName("small-img-col");

smallImg[0].onclick = function(){
    mainImg.src = this.getElementsByTagName('img')[0].src;
}
smallImg[1].onclick = function(){
    mainImg.src = this.getElementsByTagName('img')[0].src;
}
smallImg[2].onclick = function(){
    mainImg.src = this.getElementsByTagName('img')[0].src;
}
smallImg[3].onclick = function(){
    mainImg.src = this.getElementsByTagName('img')[0].src;
}



function incrementQuantity() {
    var quantityInput = document.getElementById('quantity');
    var currentQuantity = parseInt(quantityInput.value);

    if (!isNaN(currentQuantity)) {
        quantityInput.value = currentQuantity + 1;
    }
}

function decrementQuantity() {
    var quantityInput = document.getElementById('quantity');
    var currentQuantity = parseInt(quantityInput.value);

    if (!isNaN(currentQuantity) && currentQuantity > 1) {
        quantityInput.value = currentQuantity - 1;
    }
}

