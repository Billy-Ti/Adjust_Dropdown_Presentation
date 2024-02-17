// 抽象成一個可重複使用的函數，以便於呼叫，此函數接受三個參數 
function setupDropdown(selectId, formId, displayAreaClass) {
  const form = document.querySelector(formId);
  const originalSelect = document.querySelector(selectId);
  const dropdown = document.querySelector('#dropdown');
  const menu = dropdown.querySelector('.dropdown-menu');
  const toggleButton = dropdown.querySelector('.dropdown-toggle');

  function updateButtonText() {
    const selectedOptions = Array.from(originalSelect.options).filter(option => option.selected);

    // 判斷是否有選中的選項，並更新顯示文字和箭頭
    if (selectedOptions.length > 0) {
      toggleButton.innerHTML = selectedOptions.map(option => option.text).join(', ');
    } else {
      toggleButton.innerHTML = '請選擇狀態<span class="arrow-icon">&#9662;</span>';
    }
  }

  // 當表單提交時，將選中的選項值設置為表單的值，要測試時請將 event.preventDefault() 註解
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    form.querySelectorAll('input[type="hidden"]').forEach(input => input.remove());

    const selectedOptions = Array.from(originalSelect.options).filter(option => option.selected);

    selectedOptions.forEach(option => {
      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'status[]';
      hiddenInput.value = option.value;
      form.appendChild(hiddenInput);
    });

     // 取得選中項目的值陣列方便後續處理
    const selectedValues = selectedOptions.map(option => option.value);
    console.log('所選的狀態為:', selectedValues);

    const selectedTexts = selectedOptions.map(option => option.text).join(', ');
    const displayArea = document.querySelector(displayAreaClass);
    if (!displayArea) {
      console.error('顯示區域元素不存在');
      return;
    }
    displayArea.textContent = '所選的狀態為: ' + selectedTexts;

    // 清除所有選中的 checkbox
    document.querySelectorAll('.dropdown-item input[type=checkbox]').forEach(checkbox => {
      checkbox.checked = false;
    });
  
    // 清除所有選中的選項狀態
    Array.from(originalSelect.options).forEach(option => {
      option.selected = false;
    });

    updateButtonText();
  });

  // 建立下拉選單的選項 checkbox 和 label 元素 
  Array.from(originalSelect.options).forEach((option, index) => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'customOption' + index;
    checkbox.value = option.value;
    checkbox.checked = option.selected;

    const label = document.createElement('label');
    label.className = 'form-check-label';
    label.htmlFor = checkbox.id;
    label.appendChild(document.createTextNode(option.text));

    const menuItem = document.createElement('div');
    menuItem.classList.add('dropdown-item');
    menuItem.appendChild(checkbox);
    menuItem.appendChild(label);
    menu.appendChild(menuItem);

    menuItem.addEventListener('click', (event) => {
      event.stopPropagation();
      checkbox.checked = !checkbox.checked;
      option.selected = checkbox.checked;
      menuItem.classList.toggle('selected', checkbox.checked);
      updateButtonText();
    });

    checkbox.onchange = updateButtonText;
  });

  toggleButton.onclick = () => {
    menu.classList.toggle('show');
  };

  updateButtonText();
}

// 在每個頁面中的 select 標籤上呼叫函數，並傳遞相應的參數
document.addEventListener('DOMContentLoaded', () => {
  setupDropdown('#originalSelect', '#form', '.display-area');
});


// 將普通下拉框轉換為多選框
function convertToMultiSelect(selectElement) {
  selectElement.multiple = true;
}

// 在頁面加載完成後執行轉換
document.addEventListener('DOMContentLoaded', () => {
  const selectElements = document.querySelectorAll('select');
  
  // 對每個下拉框應用轉換
  selectElements.forEach(selectElement => {
    convertToMultiSelect(selectElement);
  });

  // 監聽表單的提交事件
  const form = document.querySelector('form');
  form.addEventListener('submit', event => {
    const selectedOptions = Array.from(form.querySelectorAll('option:checked'));
    const selectedValues = selectedOptions.map(option => option.value);
    // 將選中的選項值放入一個隱藏的 input 中，以便提交到後端
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'selectedOptions';
    hiddenInput.value = selectedValues.join(',');
    form.appendChild(hiddenInput);
  });
});
