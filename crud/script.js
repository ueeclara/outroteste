const form = document.getElementById('produtoForm');
const categoriaSelect = document.getElementById('categoriaSelect');
const nomeInput = document.getElementById('nomeInput');
const precoInput = document.getElementById('precoInput');
const descricaoInput = document.getElementById('descricaoInput');
const produtosBody = document.getElementById('produtosBody');
const apiUrl = 'https://649a1d4a79fbe9bcf8404b5a.mockapi.io/users/20201214010022/products';

function criarProduto(event) {
  event.preventDefault();

  const produto = {
    categoria: categoriaSelect.value,
    nome: nomeInput.value,
    preco: precoInput.value,
    descricao: descricaoInput.value
  };

  
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(produto)
  })
    .then(response => response.json())
    .then(data => {
      
      adicionarProdutoTabela(data);

      
      categoriaSelect.value = '';
      nomeInput.value = '';
      precoInput.value = '';
      descricaoInput.value = '';
    })
    .catch(error => {
      console.log('Erro ao criar o produto:', error);
    });
}

// adicionar 
function adicionarProdutoTabela(produto) {
  const row = document.createElement('tr');
  row.setAttribute('data-id', produto.id);
  row.innerHTML = `
    <td>${produto.categoria}</td>
    <td>${produto.nome}</td>
    <td>R$ ${produto.preco}</td>
    <td>${produto.descricao}</td>
    <td class="actions">
      <button onclick="editarProduto('${produto.id}')"><i class='bx bx-edit' ></i></button>
      <button onclick="excluirProduto('${produto.id}')"><i class='bx bx-trash'></i></button>
    </td>
  `;
  produtosBody.appendChild(row);
}

// carregar
function carregarProdutos() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      data.forEach(produto => {
        adicionarProdutoTabela(produto);
      });
    })
    .catch(error => {
      console.log('Erro ao carregar os produtos:', error);
    });
}

// excluir 
function excluirProduto(id) {
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        const row = document.querySelector(`#produtosBody tr[data-id="${id}"]`);
        if (row) {
          row.remove();
        }
      } else {
        console.log('Erro ao excluir o produto:', response.status);
      }
    })
    .catch(error => {
      console.log('Erro ao excluir o produto:', error);
    });
}

//editar
function editarProduto(id) {
  const categoria = prompt('Nova categoria:');
  const nome = prompt('Novo nome:');
  const preco = prompt('Novo preço:');
  const descricao = prompt('Nova descrição:');

  const produto = {
    categoria,
    nome,
    preco,
    descricao
  };

  fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(produto)
  })
    .then(response => response.json())
    .then(data => {
      const row = document.querySelector(`#produtosBody tr[data-id="${id}"]`);
      if (row) {
        
        row.innerHTML = `
          <td>${data.categoria}</td>
          <td>${data.nome}</td>
          <td>${data.preco}</td>
          <td>${data.descricao}</td>
          <td class="actions">
            <button onclick="editarProduto('${data.id}')">Editar</button>
            <button onclick="excluirProduto('${data.id}')">Excluir</button>
          </td>
        `;
      }
    })
    .catch(error => {
      console.log('Erro ao editar o produto:', error);
    });
}

carregarProdutos();

form.addEventListener('submit', criarProduto);
