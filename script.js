// Selecciona elementos del DOM y almacena en variables
const sidebarStep = document.querySelectorAll('.indecater__num');
const formStep = document.querySelectorAll('.step');
const form = document.getElementById('form');
const planCards = document.querySelectorAll('.plan__card');
const addsonCards = document.querySelectorAll('.addon__card');
const changePlanBtn = document.getElementById('change-plan');

let selectedPlan = {};
// Función para obtener los add-ons seleccionados
const selectedAddsOn = () => {

  let addOnArr = [];

  addsonCards.forEach((card) => {
 
    let price = card.querySelector('.sbscription__price').textContent;
    let name = card.querySelector('.card__name').textContent;
    let planDur = card.querySelector('.sbscription__duration').textContent;
   
    if (card.classList.contains('selected')) {
      addOnArr.push({
        price,
        name,
        planDur,
      });
    }
  });
  return addOnArr;
};
// Precios y duración de planes y add-ons
const monthlyPlanPrices = [9, 12, 15];
const yearlyPlanPrices = [90, 120, 150];
const monthlyAdsOnPrice = [1, 2, 2];
const yearlyAdsOnPrice = [10, 20, 20];

// Función para establecer los precios y la duración de planes y add-ons
const setplan = (card, price, duration) => {
  card.forEach((card, i) => {
    card.querySelector('.sbscription__price').textContent = `${price[i]}`;
    card.querySelector('.sbscription__duration').textContent = `${duration}`;
  });
};
setplan(planCards, monthlyPlanPrices, 'mo');
setplan(addsonCards, monthlyAdsOnPrice, 'mo');

// Manejo de botones de navegación
const nextBtn = document.getElementById('next-button');
const prevBtn = document.getElementById('prev-button');

let stepNum = 0;
// Función para mostrar errores de selección de plan
const selectPlanError = (text) => {
  document.getElementById('select-plan-error').textContent = text;
};
// Manejo de eventos para botones de navegación
nextBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (stepNum === 0) {
    if (!formValidation()) return;
    stepNum++;
    showStep(stepNum);
  } else if (stepNum === 1) {
    if (Object.entries(selectedPlan).length === 0) {
      return selectPlanError('Please select a plan');
    }
    stepNum++;
    showStep(stepNum);
  } else if (stepNum === 2) {
    renderTotal();
    stepNum++;
    showStep(stepNum);
  } else if (stepNum === 3) {
    stepNum++;
    showStep(stepNum);
  } else return;
});

prevBtn.addEventListener('click', (e) => {
  e.preventDefault();
  stepNum--;
  return showStep(stepNum);
});
// Función para mostrar el paso actual
const showStep = (x) => {
  selectPlanError('');

  if (x < sidebarStep.length) {
    for (let i = 0; i < sidebarStep.length; i++) {
      sidebarStep[i].classList.remove('active');
    }
    sidebarStep[x].classList.add('active');
  }

  if (x < formStep.length) {
    if (x === 0) {
      prevBtn.classList.add('hidden');
      prevBtn.setAttribute('disabled', '');
    } else if (x === 4) {
      nextBtn.parentElement.classList.add('hidden');
    } else {
      prevBtn.classList.remove('hidden');
      prevBtn.removeAttribute('disabled');
    }
    x === 3
      ? (nextBtn.textContent = 'Confirm')
      : (nextBtn.textContent = 'Next step');

    for (let i = 0; i < formStep.length; i++) {
      formStep[i].classList.remove('active');
    }
    formStep[x].classList.add('active');
  }
};
showStep(stepNum);

// Funciones para mostrar y ocultar errores de entrada de formulario
const showError = (input, warningText) => {
  input.classList.add('error');
  input.parentElement.querySelector('.warning').textContent = warningText;
};

const hideError = (input) => {
  input.classList.remove('error');
  input.parentElement.querySelector('.warning').textContent = '';
};

const formInput = form.querySelectorAll('input');
// Función de validación de formulario
const formValidation = () => {
  formInput.forEach((input) => {
    if (input.name === 'userName') {
      return input.value.length === 0
        ? showError(input, 'Enter your name')
        : hideError(input);
    }
    if (input.name === 'email') {
      const emailRegExp = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
      return input.value.length === 0
        ? showError(input, 'Enter email')
        : !emailRegExp.test(input.value)
        ? showError(input, 'Enter valid email')
        : hideError(input);
    }
    if (input.name === 'phone') {
      return input.value.length === 0
        ? showError(input, 'Enter your mobile number')
        : hideError(input);
    }
  });
  return form.checkValidity();
};

// Manejo de eventos para cambiar entre planes mensuales y anuales
const toggle = document.getElementById('toggle');
const yearlyBenefit = document.querySelectorAll('.yearly__benefit');
const month = document.getElementById('monthly');
const year = document.getElementById('yearly');

toggle.addEventListener('click', (e) => {
  selectPlanError('');
  const toggle = e.target.parentElement;
  // Manejo de eventos para seleccionar un plan
  planCards.forEach((card) => card.classList.remove('selected'));
  selectedPlan = {};

  toggle.classList.toggle('active');

  if (toggle.classList.contains('active')) {
    yearlyBenefit.forEach((item) => item.classList.add('show'));
    setplan(planCards, yearlyPlanPrices, 'yr');
    setplan(addsonCards, yearlyAdsOnPrice, 'yr');
    year.classList.add('selected__plan');
    month.classList.remove('selected__plan');
  } else {
    setplan(planCards, monthlyPlanPrices, 'mo');
    setplan(addsonCards, monthlyAdsOnPrice, 'mo');
    yearlyBenefit.forEach((item) => item.classList.remove('show'));
    month.classList.add('selected__plan');
    year.classList.remove('selected__plan');
  }
});

planCards.forEach((card) => {
  card.addEventListener('click', (e) => {
    selectPlanError('');
    let target = e.currentTarget;
    planCards.forEach((card) => card.classList.remove('selected'));
    target.classList.add('selected');

    let planName = target.querySelector('.card__name').textContent;
    let planPrice = target.querySelector('.sbscription__price').textContent;
    let planDur = target.querySelector('.sbscription__duration').textContent;

    return (selectedPlan = { planName, planPrice, planDur });
  });
});

// STEP3 
addsonCards.forEach((card) => {
  card.addEventListener('click', (e) => {
    let target = e.currentTarget;
    let checkbox = target.querySelector('.checkbox');
    target.classList.toggle('selected');

    if (target.classList.contains('selected')) {
      return (checkbox.checked = true);
    } else {
      return (checkbox.checked = false);
    }
  });
});

// STEP-4 

const renderTotal = () => {
  let totalAmount = 0;
  const planDuration = selectedPlan.planDur === 'mo' ? 'Monthly' : 'Yearly';
  const plan = document.getElementById('selected-plan');
  const addsOnList = document.getElementById('selected-addon');
  const total = document.getElementById('total');

  total.innerHTML = '';
  addsOnList.innerHTML = '';
  plan.innerHTML = '';

  let planName = document.createElement('p');
  planName.textContent = selectedPlan.planName;

  let dur = document.createElement('p');
  dur.textContent = `(${planDuration})`;

  let planPrice = document.createElement('p');
  planPrice.textContent = `$${selectedPlan.planPrice}/${selectedPlan.planDur}`;
  plan.appendChild(planName);
  plan.appendChild(dur);
  plan.appendChild(planPrice);

  totalAmount += parseInt(selectedPlan.planPrice);

  selectedAddsOn().forEach((item) => {
    let listItem = document.createElement('li');
    let addOnName = document.createElement('p');
    addOnName.textContent = item.name;
    let addOnprice = document.createElement('p');
    addOnprice.textContent = `+$${item.price}/${item.planDur}`;

    listItem.appendChild(addOnName);
    listItem.appendChild(addOnprice);
    addsOnList.appendChild(listItem);

    totalAmount += parseInt(item.price);
  });
  total.innerHTML = `<span>Total(
    per ${planDuration.slice(0, -2).toLocaleLowerCase()}) </span> 
      <span> $${totalAmount}/${selectedPlan.planDur}</span>`;
};

changePlanBtn.addEventListener('click', () => {
  stepNum = 0;
  showStep(stepNum);
});