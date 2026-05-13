// importa as funções da API
import {
    getContatos,
    criarContato,
    atualizarContato,
    deletarContato
} from "./contatos.js"

// pega elementos do HTML
const lista = document.getElementById('lista-contatos')
const form = document.getElementById('form-contato')

// pega inputs do formulário
const nome = document.getElementById('nome')
const celular = document.getElementById('celular')
const foto = document.getElementById('foto')
const email = document.getElementById('email')
const endereco = document.getElementById('endereco')
const cidade = document.getElementById('cidade')

// variável para guardar id do contato editado
let id = null

// função para carregar contatos da API
async function carregarContatos(){

    // limpa lista antes de carregar novamente
    lista.replaceChildren()

    // busca contatos na API
    const contatos = await getContatos()

    // percorre contatos criando cards
    contatos.forEach(criarCard)
}

// função para criar card do contato
function criarCard(contato){

    // cria div do card
    const card = document.createElement('div')

    // adiciona classe CSS
    card.classList.add('card')

    // verifica se existe foto
    if(!contato.foto){

        const img = document.createElement('img')
        img.src = "https://img.freepik.com/psd-gratuitas/ilustracao-3d-de-avatar-ou-perfil-humano_23-2150671122.jpg"
        card.appendChild(img)
    } else{
        const img = document.createElement('img')
        img.src = contato.foto
        card.appendChild(img)
    }


    const listNome = document.createElement('h2')
    listNome.textContent = contato.nome
    const listEmail = document.createElement('p')
    listEmail.textContent = contato.email
    const listCelular = document.createElement('p')
    listCelular.textContent = contato.celular
    const listCidade = document.createElement('p')
    listCidade.textContent = contato.cidade
    const editar = document.createElement('button')
    editar.textContent = 'Editar'
    const excluir = document.createElement('button')
    excluir.textContent = 'Excluir'

    // evento editar
    editar.onclick = () => {

        // guarda id do contato
        id = contato.id

        // coloca dados no formulário
        nome.value = contato.nome
        celular.value = contato.celular
        foto.value = contato.foto
        email.value = contato.email
        endereco.value = contato.endereco
        cidade.value = contato.cidade
    }

    excluir.onclick = async () => {

        await deletarContato(contato.id)
        card.remove()
    }

    // adiciona elementos dentro do card
    card.append(
        listNome,
        listEmail,
        listCelular,
        listCidade,
        editar,
        excluir
    )

    // adiciona card na tela
    lista.appendChild(card)
}

// evento de envio do formulário
form.onsubmit = async (event) => {
    event.preventDefault()
    const contato = {

        nome: nome.value,
        celular: celular.value,
        foto: foto.value,
        email: email.value,
        endereco: endereco.value,
        cidade: cidade.value
    }

    // verifica se está editando
    if(id){
        await atualizarContato(id, contato)

        id = null
        carregarContatos()

    } else {

        const novoContato = await criarContato(contato)
        criarCard(novoContato)
    }
    form.reset()
}

// inicia aplicação carregando contatos
carregarContatos()