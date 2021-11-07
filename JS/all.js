var height = document.querySelector('.height');
var weight = document.querySelector('.weight');
var calculate = document.querySelector('.calculate');
var records = document.querySelector('.records');
var deleteAll = document.querySelector('.deleteAll');
var assessResult = document.querySelector('.assessResult');

var data = JSON.parse(localStorage.getItem('bodyIndex'))||[];

calculate.addEventListener('click',calculateBMI);
updateRecords(data);
records.addEventListener('click',deleteRecords);
deleteAll.addEventListener('click',deleteAllRecords);

function calculateBMI(){
  let heightAlert = document.querySelector('.heightAlert');
  let weightAlert = document.querySelector('.weightAlert');
  
  heightAlert.textContent = '';
  weightAlert.textContent = '';
  switch(true){
      case height.value<0:
        heightAlert.textContent='身高不可為負數'
        return;

      case weight.value<0:
        weightAlert.textContent='體重不可為負數'
        return;

      case height.value=='' && weight.value !== '':
        heightAlert.textContent='請輸入身高(cm)';
        return;

      case weight.value=='' && height.value !== '':
        weightAlert.textContent='請輸入體重(kg)';
        return;
        
      case height.value=='' && weight.value=='':
        heightAlert.textContent='請輸入身高(cm)';
        weightAlert.textContent='請輸入體重(kg)';
        return;
  }

  let cm = parseFloat(height.value).toFixed(1);
  let m = parseFloat((cm/100).toFixed(2));
  let kg = parseFloat(weight.value);
  let BMI = (kg/(m*m)).toFixed(1);
  let assessment = '';
  let color = '';
  let time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth()+1;
  let date = time.getDate();
  let today = month+'-'+date+'-'+year;

  switch(true){
    case BMI<18.5:
      assessment = '過輕';
      color = '#31BAF9';
      break;
    case BMI>=18.5 && BMI<24:
      assessment = '理想';
      color = '#86D73F';
      break;
    case BMI>=24 && BMI<27:
      assessment = '過重';
      color = '#FF982D';
      break;
    case BMI>=27 && BMI<30:
      assessment = '輕度肥胖';
      color = '#FF6C03';
      break;
    case BMI>=30 && BMI<35:
      assessment = '中度肥胖';
      color = '#ff5f03';
      break;
    case BMI>=35:
      assessment = '重度肥胖';
      color = '#FF1200';
      break;
  }
  console.log(assessment);
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
  updateRecords(data);
  changeButton(BMIobject);
  calculate.style.display='none';

  localStorage.setItem('bodyIndex',JSON.stringify(data));
}

function updateRecords(data){
  var str = '';
  var len = data.length;

  if (len>1){
      deleteAll.style.display= 'block';
  } else {
      deleteAll.style.display='none';
  }

  for (let i=0; i<len; i++){
    str += '<li data-number="'+i+'" style="border-left: 7px solid '+data[i].borderColor+';"><h3>'+data[i].assess+'</h3><div class="data"><p>BMI<span>'+data[i].bmi+'</span></p><p>weight<span>'+data[i].weight+'Kg</span></p><p>height<span>'+data[i].height+'cm</span></p><p>'+data[i].currentDate+'</p></div><a href="#" data-number="'+i+'" style="padding:5px;"><img src="https://i.ibb.co/NCrvGsM/toppng-com-it-is-worthless-discarded-material-or-objects-trash-bin-icon-1335x1577.png" alt="recyleBinIcon" style="width:16px;height:18px;pointer-events:none;"></a></li>';
  }
  records.innerHTML = str;
}

var reCalculate = document.querySelector('.reCalculate');
reCalculate.addEventListener('click',deleteButton)
function changeButton(BMIobject){
    reCalculate.innerHTML = '<button class="reCalculateBt" style="border: 6px solid '+BMIobject.borderColor+'"><p class="bmiResult" style="color:'+BMIobject.borderColor+'">'+BMIobject.bmi+'<span style="color:'+BMIobject.borderColor+'">BMI</span><div class="smallCircle" style="background-color:'+BMIobject.borderColor+';"></div></button>'
}

function deleteButton(){
    reCalculate.innerHTML = '';
    height.value='';
    weight.value='';
    assessResult.textContent='';
    calculate.style.display='unset'
}

function deleteRecords(e){
    e.preventDefault();
    console.log(e.target.nodeName);
    if (e.target.nodeName !=='A'){
        return;
    }
    let number = e.target.dataset.number;
    data.splice(number,1);
    localStorage.setItem('bodyIndex',JSON.stringify(data));
    updateRecords(data);
}

function deleteAllRecords(){
    data=[];
    localStorage.setItem('bodyIndex',JSON.stringify(data));
    updateRecords(data);
}