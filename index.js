const canvas = document.getElementById('responsive-canvas');
const ctx = canvas.getContext('2d');

const downloadButton = document.getElementById('download-image');

const fileselected = document.getElementById('file-selected');
const inputPhoto = document.getElementById('photo');

const rangeScale = document.getElementById('range-scale');
const xAxis = document.getElementById('x-axis');
const yAxis = document.getElementById('y-axis');

const fr = new FileReader();

const billete = new Image();
billete.src = "/billete.png"

let photo = new Image();

let fileLoaded = false;

function canvasToPNG(){
  const png = canvas.toDataURL('image/png');
  return png;
}

function downloadImage(){
  const anchor = document.createElement('a');
  const png = canvasToPNG();
  anchor.setAttribute('href', png);
  anchor.setAttribute('download', "billete-creativo.png");
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function clearCanvas(){
  ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawImageOnCanvas(src, initX, initY, width, height){
  ctx.drawImage(src, initX , initY, width, height)
}

function drawBilleteOnCanvas(){
  drawImageOnCanvas(billete, 0, 0, canvas.width, canvas.height);
}

function drawCustomBillete(image){
  const ratio = (image.height/canvas.height);
  let scaleValue = parseInt(rangeScale.value)/100; 
  let xOffset = parseInt(xAxis.value)
  let yOffset = parseInt(yAxis.value)

  const scaledWidth = (image.width * scaleValue)/ratio;
  const scaledHeight = (image.height * scaleValue)/ratio;
  
  const imageXPosition = (canvas.width - scaledWidth)/2 + xOffset;
  const imageYPosition = (canvas.height - scaledHeight)/2 + yOffset;

  clearCanvas();

  drawImageOnCanvas(
    image,
    imageXPosition,
    imageYPosition,
    scaledWidth,
    scaledHeight
  )

  drawBilleteOnCanvas();
}

function setValueOnRange(HTMLRangeElement, initialValue){
  HTMLRangeElement.value = initialValue;
  
  const {value, min, max} = HTMLRangeElement;
  
  HTMLRangeElement.style.backgroundSize =  (value - min) * 100 / (max - min) + '% 100%';  
}

setValueOnRange(rangeScale, 100);
setValueOnRange(xAxis, 0);
setValueOnRange(yAxis, 0);

downloadButton.addEventListener('click', downloadImage)

billete.addEventListener('load', drawBilleteOnCanvas);

rangeScale.addEventListener('input',()=>{
  setValueOnRange(rangeScale, rangeScale.value);
  drawCustomBillete(photo);
})

xAxis.addEventListener('input',()=>{
  setValueOnRange(xAxis, xAxis.value);
  drawCustomBillete(photo);
})

yAxis.addEventListener('input',()=>{
  setValueOnRange(yAxis, yAxis.value);
  drawCustomBillete(photo);
})

inputPhoto.addEventListener('change', (e)=>{
  fr.readAsDataURL(e.currentTarget.files[0]);
  fileselected.innerText = e.currentTarget.files[0].name;
  if(!fileLoaded){
    downloadButton.removeAttribute('disabled');
    fileLoaded = !fileLoaded;
  }
})

fr.addEventListener('load', ({target})=>{
  photo.src = target.result;
})

photo.addEventListener('load', ({currentTarget})=>{
  drawCustomBillete(currentTarget);
});
