// Variável para armazenar todos os livros carregados
let allBooks = [];
let currentFontSize = 16; // Tamanho padrão da fonte

// Função principal para carregar os livros
function loadBooks() {
    fetch('./books.json')
        .then(response => response.json())
        .then(data => {
            allBooks = data;
            renderBooks(data.slice(0, 4)); // Carregar os primeiros 4 livros
            populateDatalist(data); // Preencher o datalist com sugestões
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
}

// Função para preencher o datalist com as sugestões (limitado a 5 itens)
function populateDatalist(books) {
    const datalist = document.getElementById('book-suggestions');
    datalist.innerHTML = ''; // Limpar sugestões anteriores

    // Limitar o número de livros a 5
    const limitedBooks = books.slice(0, 5);

    limitedBooks.forEach(book => {
        const option = document.createElement('option');
        option.value = book.title; // Apenas o título como valor
        datalist.appendChild(option);
    });
}

// Função para renderizar a lista de livros
function renderBooks(books) {
    const bookList = document.querySelector('.book-list');
    bookList.innerHTML = ''; // Limpa o conteúdo anterior

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');

        bookItem.innerHTML = `
            <div class="book-image">
                <img src="${book.image}" alt="Capa do livro ${book.title}">
            </div>
            <div class="book-details">
                <h3>Título: ${book.title}</h3>
                <p><strong>Autor:</strong> ${book.author}</p>
                <p><strong>Ano:</strong> ${book.year}</p>
                <p><strong>Descrição:</strong> ${book.description}</p>
                <button class="download-btn" aria-label="Abrir ${book.title}" onclick="openBook('${book.url}')">
                    <img src="./assets/icons/download.svg" alt="Ícone de download" class="download-icon">
                    Abrir
                </button>
            </div>
        `;

        bookList.appendChild(bookItem);
    });
}

// Função para abrir o link do livro
function openBook(url) {
    window.open(url, '_blank'); // Abre o link em uma nova aba
}

// Função para exibir a mensagem "Livro não encontrado"
function renderNoResults() {
    const bookList = document.querySelector('.book-list');
    bookList.innerHTML = '<p>Livro não encontrado</p>'; // Exibe a mensagem
}

// Função para filtrar e renderizar livros com base na busca
function filterBooks(query) {
    const filteredBooks = allBooks.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredBooks.length === 0) {
        renderNoResults(); // Exibe a mensagem se não encontrar nenhum livro
    } else {
        populateDatalist(filteredBooks.slice(0, 5)); // Limitar a 5 sugestões no datalist
        renderBooks(filteredBooks.slice(0, 4)); // Mostrar até 4 livros filtrados
    }
}

// Função para alternar o modo escuro e mudar o ícone
function toggleDarkMode() {
    const body = document.body;
    const icon = document.querySelector('.dark-mode-icon');

    body.classList.toggle('dark-mode');

    // Verifica se o modo escuro está ativo e troca o ícone
    if (body.classList.contains('dark-mode')) {
        icon.src = './assets/icons/sun.svg'; // Caminho para o ícone de sol
        icon.alt = 'Ativar modo claro'; // Alt adequado para acessibilidade
    } else {
        icon.src = './assets/icons/moon.svg'; // Caminho para o ícone de lua
        icon.alt = 'Ativar modo escuro'; // Alt adequado para acessibilidade
    }
}

// Função para aumentar o tamanho da fonte
function increaseFontSize() {
    currentFontSize += 2; 
    document.body.style.fontSize = `${currentFontSize}px`;
}

// Função para diminuir o tamanho da fonte
function decreaseFontSize() {
    currentFontSize -= 2;
    document.body.style.fontSize = `${currentFontSize}px`;
}

// Função para restaurar o tamanho original da fonte
function resetFontSize() {
    currentFontSize = 16;
    document.body.style.fontSize = `${currentFontSize}px`;
}

// Adiciona os eventos aos botões de acessibilidade
function addAccessibilityListeners() {
    document.querySelector('.dark-mode-control').addEventListener('click', toggleDarkMode);
    document.querySelector('.font-size-control[aria-label="Aumentar tamanho da fonte"]').addEventListener('click', increaseFontSize);
    document.querySelector('.font-size-control[aria-label="Diminuir tamanho da fonte"]').addEventListener('click', decreaseFontSize);
    document.querySelector('.font-size-control[aria-label="Tamanho original"]').addEventListener('click', resetFontSize);
}

// Adiciona evento de digitação ao campo de busca
function addSearchListener() {
    const searchBar = document.getElementById('search-input');
    searchBar.addEventListener('input', (e) => {
        filterBooks(e.target.value);
    });
}

// Chama as funções ao iniciar a página
window.onload = function() {
    loadBooks();
    addAccessibilityListeners();
    addSearchListener();
};