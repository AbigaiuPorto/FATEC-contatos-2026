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

// variável da imagem
let imagem = ""

// preview da imagem
function preview ({target}) {

    // mostra imagem
    document.getElementById('preview-image')
            .src = URL.createObjectURL(target.files[0])

    // salva imagem
    const leitor = new FileReader()

    leitor.onload = () => imagem = leitor.result

    leitor.readAsDataURL(target.files[0])
}

// evento da imagem
document.getElementById('foto')
        .addEventListener('change', preview)

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
        img.src = "./img/upload-icon.svg"
        card.appendChild(img)

    } else {

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
        email.value = contato.email
        endereco.value = contato.endereco
        cidade.value = contato.cidade

        // guarda imagem
        imagem = contato.foto

        // mostra preview
        document.getElementById('preview-image')
                .src = contato.foto
    }

    // evento excluir
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
        foto: imagem,
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

    // limpa formulário
    form.reset()

    // limpa preview
    document.getElementById('preview-image')
            .src = "./img/upload-icon.svg"

    // limpa imagem
    imagem = ""
}

// inicia aplicação carregando contatos
carregarContatos()