function alignBlocks() {
    const checkboxes = document.querySelectorAll('.alignment-checkbox');
    const blocks = [3, 4, 5].map(num => document.querySelector(`.block${num}`)); 

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            blocks[index].style.textAlign = 'left'; 
            localStorage.setItem(`block${index + 3}AlignLeft`, true); 
        } else {
            blocks[index].style.textAlign = 'center'; 
            localStorage.removeItem(`block${index + 3}AlignLeft`);
        }

        if (index === 0) { 
            const menuContainer = blocks[0].querySelector('.menu-container');
            const resultParagraph = blocks[0].querySelector('p');
            
            if (menuContainer) {
                menuContainer.style.textAlign = blocks[0].style.textAlign;
            }

            if (resultParagraph) {
                resultParagraph.style.textAlign = blocks[0].style.textAlign;
            }
        }

        if (index === 1 || index === 2) {
            const children = blocks[index].querySelectorAll('*');
            children.forEach(child => {
                child.style.textAlign = blocks[index].style.textAlign;
            });
        }
    });
}

function restoreAlignment() {
    [3, 4, 5].forEach(num => {
        const block = document.querySelector(`.block${num}`);
        if (localStorage.getItem(`block${num}AlignLeft`)) {
            block.style.textAlign = 'left';
        } else {
            block.style.textAlign = 'center';
        }

        if (num === 3) {
            const menuContainer = block.querySelector('.menu-container');
            const resultParagraph = block.querySelector('p');
            
            if (menuContainer) {
                menuContainer.style.textAlign = block.style.textAlign;
            }

            if (resultParagraph) {
                resultParagraph.style.textAlign = block.style.textAlign;
            }
        }

        if (num === 4 || num === 5) {
            const children = block.querySelectorAll('*');
            children.forEach(child => {
                child.style.textAlign = block.style.textAlign;
            });
        }
    });
}

restoreAlignment();

document.addEventListener('dblclick', function () {
    alignBlocks(); 
});

function swapBlocksContent() {
    const block4 = document.querySelector('.block4');
    const block5 = document.querySelector('.block5');
    
    const block4Content = block4.innerHTML;
    const block5Content = block5.innerHTML;

    block4.innerHTML = block5Content;
    block5.innerHTML = block4Content;

    localStorage.setItem('block4Content', block5Content);
    localStorage.setItem('block5Content', block4Content);
}

swapBlocksContent();

function calculateOvalArea() {
    const a = 10; 
    const b = 5;  
    const area = Math.PI * a * b;
    const block3 = document.querySelector('.block3');

    const resultParagraph = document.createElement('p');
    resultParagraph.textContent = `Площа овалу: ${area.toFixed(2)}`;
    block3.appendChild(resultParagraph);
}
calculateOvalArea();

function countWords() {
    const text = prompt('Введіть текст для підрахунку слів:');
    if (text) {
        const wordCount = text.split(/\s+/).filter(word => word).length;
        alert(`Кількість слів: ${wordCount}`);
        document.cookie = `wordCount=${wordCount}; path=/;`;
    }
}

function handleCookies() {
    const cookies = document.cookie.split('; ').find(row => row.startsWith('wordCount='));
    if (cookies) {
        const wordCount = cookies.split('=')[1];
        if (confirm(`Збережено кількість слів: ${wordCount}. Видалити?`)) {
            document.cookie = 'wordCount=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            location.reload();
        } else {
            alert('Cookies залишено. Перезавантажте сторінку, якщо хочете почати заново.');
        }
    } else {
        countWords();
    }
}
handleCookies();

function addEditFunctionality() {
    const block3 = document.querySelector('.block3');

    let menuContainer = document.querySelector('.menu-container');
    if (!menuContainer) {
        menuContainer = document.createElement('div');
        menuContainer.classList.add('menu-container');

        const selectList = document.createElement('select');
        selectList.innerHTML = `
            <option value="" disabled selected>Оберіть блок</option>
            <option value="1">Блок 1</option>
            <option value="2">Блок 2</option>
            <option value="3">Блок 3</option>
            <option value="4">Блок 4</option>
            <option value="5">Блок 5</option>
            <option value="6">Блок 6</option>
            <option value="7">Блок 7</option>
        `;
        menuContainer.appendChild(selectList);
    }

    block3.appendChild(menuContainer);

    const selectList = menuContainer.querySelector('select');
    selectList.addEventListener('change', function () {
        const blockNumber = this.value;
        const block = document.querySelector(`.block${blockNumber}`);
        if (!block) {
            alert(`Блок ${blockNumber} не знайдено!`);
            return;
        }

        if (!localStorage.getItem(`block${blockNumber}-originalContent`)) {
            localStorage.setItem(`block${blockNumber}-originalContent`, block.innerHTML);
            localStorage.setItem(`block${blockNumber}-originalStyle`, block.getAttribute('style') || '');
        }

        const textarea = document.createElement('textarea');
        textarea.value = block.innerHTML;

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Зберегти';

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Скинути зміни';

        block.innerHTML = '';
        block.appendChild(textarea);
        block.appendChild(saveButton);
        block.appendChild(resetButton);

        saveButton.addEventListener('click', function () {
            const newContent = textarea.value;
            block.innerHTML = newContent;
            localStorage.setItem(`block${blockNumber}-content`, newContent);
            block.style.fontStyle = 'italic'; 
            selectList.value = ''; 
        });

        resetButton.addEventListener('click', function () {
            const originalContent = localStorage.getItem(`block${blockNumber}-originalContent`);
            const originalStyle = localStorage.getItem(`block${blockNumber}-originalStyle`);
            block.innerHTML = originalContent; 
            block.setAttribute('style', originalStyle); 
            localStorage.removeItem(`block${blockNumber}-content`); 
            block.style.fontStyle = ''; 
            selectList.value = ''; 
        });
    });

    document.querySelectorAll('.block').forEach((block, index) => {
        const savedContent = localStorage.getItem(`block${index + 1}-content`);
        if (savedContent) {
            block.innerHTML = savedContent;
            block.style.fontStyle = 'italic';
        }
    });
}

addEditFunctionality();
