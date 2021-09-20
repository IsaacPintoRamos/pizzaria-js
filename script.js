//  VÃO SER USADOS PARA DIMINUIR O TAMANHO DO CODIGO AO USAR DOCUMENT.QUERYSELECTOR E DOCUMENTO.QUERYSELECTORALL
const c = (el) => {
    return document.querySelector(el);
}
const cs = (el) => {
    return document.querySelectorAll(el);
}
// VARIAVEL MODAL QUANTIDADE
let modalQt = 1;
// VARIAVEL DO CARRINHO
let cart = [];
let modalKey = 0;

// LISTAGEM DAS PIZZAS
pizzaJson.map((item, index)=>{ // ITEM ESTA RECEBENDO AS PIZZAS, E O INDEX ESTA RECEBENDO A POSIÇÃO DO ITEM
    let pizzaItem = c('.models .pizza-item').cloneNode(true); // CLONENODE ESTA SENDO USANDO PARA CLONAR A DIV MODELS E PIZZA-ITEM, E O TRUE VAI PEGAR TUDO QUE ESTA DENTRO DO ITEM
    // CHAVE DAS PIZZAS
    pizzaItem.setAttribute('data-key', index); // DATA SIGNIFICA ALGUMA INFORMAÇÃO ESPECIFICA SOBRE DETERMINADO ITEM
    // IMAGEM PIZZA
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    // PREÇO PIZZA
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    // NOME PIZZA
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    // DESC PIZZA
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //LINK
    // EVITAR DE CLICAR NA PIZZA E RECARREGAR A PAGINA
    pizzaItem.querySelector('a').addEventListener('click', (e)=> {
        e.preventDefault(); // PREVINA A AÇÃO PADRÃO, QUE NO CASO É O CLICK
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;
        // CLOSESTS = ACHE O ELEMENTO MAIS PRÓXIMO QUE TENHA PIZZA ITEM
        // GETATTRIBUTE VAI PEGA O DATA-KEY
        // console.log(`A PIZZA CLICADA FOI ${key}`);
        // console.log(pizzaJson[key]);
        c('.pizzaBig img').src = pizzaJson[key].img; // IMAGEM PIZZA NO MODAL

        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name; // NOME PIZZA NO MODAL
        c('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description; // DESCRIÇÃO PIZZA NO MODAL
        c('.pizzaInfo--size.selected').classList.remove('selected'); // REMOVENDO A SELEÇÃO PADRÃO DE TAMANHO NO MODAL
        // ADICIONANDO SELEÇÃO PADRÃO DE TAMANHO NO MODAL
        cs('.pizzaInfo--size').forEach((sizeItem, sizeIndex)=>{
            if(sizeIndex == 2) {
                sizeItem.classList.add('selected')
            };
            sizeItem.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]; // TAMANHO PIZZA NO MODAL
        });
        c('.pizzaInfo--qt').innerHTML = modalQt;
        

        c('.pizzaInfo--pricearea .pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`; // PREÇO PIZZA NO MODAL

        // ABRIR O MODAL COM TRANSIÇÃO
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'Flex'; //MOSTRA O MODAL
        setTimeout(function(){
            c('.pizzaWindowArea').style.opacity = 1;
        },100);
        
    });
    c('.pizza-area').append(pizzaItem); // PEGA O CONTEUDO DE PIZZA-AREA E ADICIONA MAIS UM CONTEUDO
});

// EVENTOS DO MODAL
function closeModal() { // FECHANDO O MODAL
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }),100;
};
// ESTA FAZENDO A FUNÇÃO DO ONCLICK
cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
}); 
// DIMINUINDO A QUANTIDADE DE PIZZAS SELECIONADAS
c('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    };
});
// AUMENTANDO A QUANTIDADE DE PIZZAS SELECIONADAS
c('.pizzaInfo--qtmais').addEventListener('click', ()=> {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt; 
});
// SELECIONANDO O TAMANHO DA PIZZA
cs('.pizzaInfo--size').forEach((sizeItem, sizeIndex)=>{
    sizeItem.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected'); // DESMARCANDO O TAMANHO
        // MARCANDO O TAMANHO
        sizeItem.classList.add('selected');
    })
});
// ADICIONAR AO CARRINHO
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    // INFORMAÇÕES NECESSÁRIAS PARA ADICIONAR O ITEM NO CARRINHO: QUAL A PIZZA, TAMANHO, QUANTIDADE

    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=> {
        return item.identifier == identifier;
    });

    if(key > -1) { // SE ACHOU O ITEM
        cart[key].qtd += modalQt; // AUMENTAR A QUANTIDADE

    } else { // SE NÃO, ADICIONAR
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qtd: modalQt
    });
}
    updateCart(); // ATUALIZA O CARRINHO
    closeModal(); // AO ADICIONAR A PIZZA AO CARRINHO, FECHAR O MODAL
});
// ABRINDO O CARRINHO NO CELULAR
c('.menu-openner').addEventListener('click', ()=> {
    if(cart.length > 0) {
        c('aside').style.left = 0;
    }
})
// FECHANDO O CARRINHO NO CELULAR
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
})

function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) { // SE TIVER ITENS NO CARRINHO
        c('aside').classList.add('show'); // ADICIONAR A CLASS SHOW AO ASIDE
        c('.cart').innerHTML = ''; // VAI ZERAR E APARECER APENAS UMA PIZZA DE CADA NO CARRINHO

        let subTotal = 0;
        let desconto = 0;
        let total = 0;


        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>{
                return item.id == cart[i].id; // VAI BUSCAR O ID DO ITEM EM PIZZAJSON  
            });

            // MOSTRANDO O TAMANHO DA PIZZA NO CARRINHO
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                     break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            };
            // ESTA RECENDO O PIZZASIZENAME
            let pizzaName = `${pizzaItem.name} ${pizzaSizeName}`;

            subTotal += pizzaItem.price * cart[i].qtd;

            
            // CLONANDO A DIV CART--ITEM
            let cartItem = c('.cart--item').cloneNode(true)
            c('.cart').append(cartItem);

            cartItem.querySelector('img').src = pizzaItem.img; // IMAGEM PIZZA CARRINHO
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName; // NOME PIZZA CARINHO
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd; // QUANTIDADE PIZZA CARRINHO

            // REMOVENDO ITENS DA QUANTIDADE DO CARRINHO
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=> {
                if(cart[i].qtd > 1) {
                    cart[i].qtd --;
                    updateCart();
                } else {
                    cart.splice(i, 1); // VAI REMOVER O ITEM DO CARRINHO
                    updateCart();
                }
            });
            // ADICIONANDO MAIS UM ITEM A QUANTIDADE DO CARRINHO
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
                cart[i].qtd ++; // VAI ADICIONAR MAIS UM ITEM A QUANTIDADE
                updateCart(); // VAI ATUALIZAR O CARRINHO TODA VEZ QUE FOR CLICADO NO MAIS
            });
            desconto = subTotal * 0.1;
            total = subTotal - desconto; 

            // SUBTOTAL
            c('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
            // DESCONTO
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            // TOTAL
            c('.total.big').innerHTML = `R$ ${total.toFixed(2)}`;


            
        }
    } else {
        c('aside').classList.remove('show'); // SE NÃO, REMOVER A CLASS SHOW DO ASIDE
        c('aside').style.left = '100vw'; // FECHANDO NO CELULAR
    }
};
