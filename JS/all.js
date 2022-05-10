// 宣告變數
let height = document.querySelector('.height');
let weight = document.querySelector('.weight');
let calculate = document.querySelector('.calculate');
let records = document.querySelector('.records');
let deleteAll = document.querySelector('.deleteAll');
let assessResult = document.querySelector('.assessResult');
const contentLen = 5;
let data = JSON.parse(localStorage.getItem('bodyIndex'))||[];
let totalPages = Math.ceil(data.length/contentLen);
let page = document.querySelector('.page');

// 添加監聽器
calculate.addEventListener('click',calculateBMI);
records.addEventListener('click',deleteRecords);
deleteAll.addEventListener('click',deleteAllRecords);
page.addEventListener('click',switchPage);
// 網頁載入後預先執行第一頁內容
updateRecords(data,1);
pageColor(1);

// 點擊計算按鈕觸發
function calculateBMI(){
  let heightAlert = document.querySelector('.heightAlert');
  let weightAlert = document.querySelector('.weightAlert');
  
// 先判斷內容是否為空或負數
  heightAlert.textContent = '';
  weightAlert.textContent = '';
  switch(true){
      case height.value<0:
        heightAlert.textContent='The height can not be negative number';
        return;

      case weight.value<0:
        weightAlert.textContent='The weight can not be negative number';
        return;

      case height.value==='' && weight.value !== '':
        heightAlert.textContent='Please enter your height(cm)';
        return;

      case weight.value==='' && height.value !== '':
        weightAlert.textContent='Please enter your weight(kg)';
        return;
        
      case height.value==='' && weight.value=='':
        heightAlert.textContent='Please enter your height(cm)';
        weightAlert.textContent='Please enter your weight(kg)';
        return;
  }

  let cm = parseFloat(height.value).toFixed(1);
  let m = parseFloat((cm/100).toFixed(2));
  let kg = parseFloat(weight.value);
  let BMI = parseFloat((kg/(m*m)).toFixed(1));
  let assessment = '';
  let color = '';
  let time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth()+1;
  let date = time.getDate();
  let today = month+'-'+date+'-'+year;
//   判斷BMI以及對應顏色
  switch(true){
    case BMI<18.5:
      assessment = 'Underweight';
      color = '#31BAF9';
      break;
    case BMI>=18.5 && BMI<24:
      assessment = 'Normal';
      color = '#86D73F';
      break;
    case BMI>=24 && BMI<27:
      assessment = 'Overweight';
      color = '#FF982D';
      break;
    case BMI>=27 && BMI<30:
      assessment = 'Obese';
      color = '#FF6C03';
      break;
    case BMI>=30 && BMI<35:
      assessment = 'Medium Obese';
      color = '#ff5f03';
      break;
    case BMI>=35:
      assessment = 'Extremely Obese';
      color = '#FF1200';
      break;
  }
  
//   將資料寫入新的陣列並將推入Data物件中
  let BMIobject = {
    borderColor: color,
    assess: assessment,
    bmi: BMI,
    weight: kg,
    height: cm,
    currentDate: today
  };
  assessResult.textContent = BMIobject.assess;
  assessResult.style.color = BMIobject.borderColor;
  data.push(BMIobject);
  
// 帶入總頁數是希望不管用戶目前在第幾頁，只要新增新的資料就會跳至最後一頁方便看新的紀錄
  totalPages = Math.ceil(data.length/contentLen);
  updateRecords(data,totalPages);
  pageColor(totalPages);
  changeButton(BMIobject);
// 隱藏計算按鈕
  calculate.style.display='none';
// 更新LocalStorage的資料
  localStorage.setItem('bodyIndex',JSON.stringify(data));
}

// 將資料選染在內容上
function updateRecords(data,num1){
// 若是最大頁數為0，沒有資料 則清空物件以及內容。以防止剩最後一筆資料時按刪除按鈕產生的錯誤
  if (num1==0){
    data=[];
    localStorage.setItem('bodyIndex',JSON.stringify(data));
    updateRecords(data);
    return;
  }

// 當有兩筆資料以上時，才會顯示出刪除全部紀錄的選項
  let str = '';
  let len = data.length;
  let content = document.querySelector('.content');
  if (len>1){
      deleteAll.style.display= 'block';
      content.style.paddingBottom="unset";
  } else {
      deleteAll.style.display='none';
      content.style.paddingBottom="30px";
  }

// 分頁邏輯，num2為抓取起始點，num3為結束點
let num2 = (num1-1)*contentLen;
let num3 = num1*contentLen;
// num3不可超過資料總數
if (num3>data.length){
  num3 = data.length;
}

// 資料渲染
  for (let i=num2; i<num3; i++){
    str += 
    `<li data-number="${i}" style="border-left: 7px solid ${data[i].borderColor};">
      <h3>${data[i].assess}</h3>
      <div class="data">
        <p>BMI<span>${data[i].bmi}</span></p>
        <p>weight<span>${data[i].weight}Kg</span></p>
        <p>height<span>${data[i].height}cm</span></p>
        <p>${data[i].currentDate}</p>
      </div>
      <a href="#" data-number="${i}" style="padding:5px;">
        <img src="https://i.imgur.com/LR5GNCd.png" alt="recyleBinIcon" style="width:16px;height:18px;pointer-events:none;"></a>
    </li>`;
  }
  records.innerHTML = str;
  pagination();

}
// 點擊計算後新增新的按鈕
function changeButton(BMIobject){
    reCalculate.innerHTML = 
    `<button class="reCalculateBt" style="border: 6px solid ${BMIobject.borderColor}">
      <p class="bmiResult" style="color:${BMIobject.borderColor}">${BMIobject.bmi}<span style="color:${BMIobject.borderColor}">BMI</span>
      <div class="smallCircle" style="background-color:${BMIobject.borderColor};"></div>
    </button>`;
}
// 點擊重新計算刪除當前按鈕，並重新顯示原本的按鈕
let reCalculate = document.querySelector('.reCalculate');
reCalculate.addEventListener('click',deleteButton);

function deleteButton(){
    reCalculate.innerHTML = '';
    height.value='';
    weight.value='';
    assessResult.textContent='';
    calculate.style.display='unset'
}

// 點擊垃圾桶刪除所選資料
function deleteRecords(e){
    e.preventDefault();
    if (e.target.nodeName !=='A'){
        return;
    }
    let number = e.target.dataset.number;
    data.splice(number,1);
    localStorage.setItem('bodyIndex',JSON.stringify(data));
    totalPages = Math.ceil(data.length/contentLen);
    let num = parseInt(e.target.dataset.number);
    if (num == data.length){
      num -= 1;
    }
    let currentPage = Math.ceil((num+1)/contentLen);
    updateRecords(data,currentPage);
    pageColor(currentPage);
}

// 刪除全部資料
function deleteAllRecords(e){
    data=[];
    localStorage.setItem('bodyIndex',JSON.stringify(data));
    updateRecords(data);
}

// 分頁渲染
function pagination(){
  totalPages = Math.ceil(data.length/contentLen);

  let str = '';
  page.innerHTML = '';

  for (let i=0; i<totalPages; i++){
    // 使用樣板字面值寫法，但是在li後面換行會造成程式碼錯誤? 讓JS 243行的backgroundColor無法執行?
    str += `<li><a href="#" class="pagination" data-number="${(i+1)}">${(i+1)}</a></li>`;
  }
  page.innerHTML = str;
}

// 切換頁數
let currentPage = '';
function switchPage(e){
  e.preventDefault();
  if (e.target.nodeName !== 'A'){
    return;
  }
  currentPage = e.target.dataset.number;
  updateRecords(data,currentPage);
  pageColor(currentPage);
}

// 當前頁數上的顏色渲染
function pageColor(e){
  if (data.length<1){
    return;
  }
  totalPages = Math.ceil(data.length/contentLen);
  page.childNodes[e-1].childNodes[0].style.backgroundColor = '#D1BBFF';
}
