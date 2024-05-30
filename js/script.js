const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');
var mainImg = document.getElementById("mainImg");
var smallImg = document.getElementsByClassName("small-img-col");

const imageIn1 = document.getElementById('image1');
const imageIn2 = document.getElementById('image2');
const imageIn3 = document.getElementById('image3');
const imageIn4 = document.getElementById('image4');
const imagePreview1 = document.getElementById('imagePreview1');
const imagePreview2 = document.getElementById('imagePreview2');
const imagePreview3 = document.getElementById('imagePreview3');
const imagePreview4 = document.getElementById('imagePreview4');



if(bar){
    bar.addEventListener('click',()=>{
        nav.classList.add('active');
    })
}

if(close){
    close.addEventListener('click',()=>{
        nav.classList.remove('active');
    })
}


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

/*image */
imageIn1.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview1.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width: 200px; height: 200px;">`;
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview1.innerHTML = ''; // Clear the preview if no file selected
        }
    });

imageIn2.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview2.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width: 100px; height: 100px;">`;
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview2.innerHTML = ''; // Clear the preview if no file selected
        }
    });

imageIn3.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview3.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width: 100px; height: 100px;">`;
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview3.innerHTML = ''; // Clear the preview if no file selected
        }
    });

imageIn4.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview4.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width: 100px; height: 100px;">`;
            }
            reader.readAsDataURL(file);
        } else {
            imagePreview4.innerHTML = ''; // Clear the preview if no file selected
        }
    });
