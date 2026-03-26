const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const originInput = document.getElementById("origin");
const destinationInput = document.getElementById("destination");
const obsInput = document.getElementById("obs");
const statusBadge = document.getElementById("status-badge");
const statusText = document.getElementById("status-text");

let cart = [];

// Abrir Modal do Carrinho
cartBtn.addEventListener("click", () => {
    renderCart();
    cartModal.classList.remove("hidden");
});

// Fechar Modal ao clicar fora ou no botão voltar
cartModal.addEventListener("click", (e) => {
    if(e.target === cartModal || e.target === closeModalBtn) {
        cartModal.classList.add("hidden");
    }
});

// Adicionar Item via Delegação de Eventos (captura o clique nos botões de mais)
menu.addEventListener("click", (e) => {
    let parentBtn = e.target.closest(".add-to-cart-btn");
    if(parentBtn) {
        const name = parentBtn.getAttribute("data-name");
        const price = parseFloat(parentBtn.getAttribute("data-price"));
        addToCart(name, price);
    }
});

// Função para Adicionar Item à Lista
function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if(existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCount();
    Toastify({
        text: "Serviço adicionado!",
        duration: 2000,
        gravity: "top",
        position: "right",
        style: { background: "#0e1e35" }, // rick-navy
    }).showToast();
}

// Atualizar o contador do botão inferior
function updateCount() {
    cartCount.innerText = cart.reduce((total, item) => total + item.qty, 0);
}

// Renderizar os itens dentro do modal
function renderCart() {
    cartItemsContainer.innerHTML = "";
    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "flex justify-between items-center bg-gray-50 p-3 rounded-lg border-l-4 border-rick-cyan shadow-sm";
        div.innerHTML = `
            <div>
                <p class="font-bold uppercase text-sm">${item.name}</p>
                <p class="text-xs text-gray-500">Quantidade: ${item.qty}</p>
                <p class="text-xs font-bold text-green-700">${item.price > 0 ? `R$ ${item.price.toFixed(2)}` : "Valor sob consulta"}</p>
            </div>
            <button class="remove-btn text-red-500 text-sm font-bold hover:underline" data-name="${item.name}">Remover</button>
        `;
        cartItemsContainer.appendChild(div);
    });
}

// Remover Item da Lista (captura o clique no botão remover dentro do modal)
cartItemsContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains("remove-btn")) {
        const name = e.target.getAttribute("data-name");
        cart = cart.filter(item => item.name !== name);
        renderCart();
        updateCount();
    }
});

// Finalizar Orçamento e Enviar para o WhatsApp
checkoutBtn.addEventListener("click", () => {
    if(cart.length === 0) {
        alert("Selecione pelo menos um serviço antes de prosseguir.");
        return;
    }

    if(originInput.value === "" || destinationInput.value === "") {
        Toastify({
            text: "Por favor, preencha Origem e Destino!",
            style: { background: "#ef4444" }, // Vermelho
        }).showToast();
        return;
    }

    // Formatar a lista de itens
    const cartMsg = cart.map(i => `• ${i.name} (x${i.qty})`).join("\n");
    const phoneNumber = "5511963692499"; // O número da logo
    
    // Formatar a mensagem do WhatsApp (cuidando com espaços e acentos)
    const message = encodeURIComponent(
        `🚛 *NOVA SOLICITAÇÃO DE ORÇAMENTO - RICK TRANSPORTES*\n\n` +
        `📦 *Serviços Selecionados:*\n${cartMsg}\n\n` +
        `📍 *RETIRADA:* ${originInput.value}\n` +
        `🏁 *ENTREGA:* ${destinationInput.value}\n` +
        `📝 *DESCRIÇÃO:* ${obsInput.value || "Não informada"}\n\n` +
        `_Enviado via sistema Rick Transp._`
    );

    // Abrir o WhatsApp Business
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
});

// Verificação de Horário Comercial para o status badge
function updateStatus() {
    const data = new Date();
    const hour = data.getHours();
    const day = data.getDay(); // 0 = Domingo, 6 = Sábado

    // Aberto das 8h às 18h (Seg-Sex)
    const isOpen = (day >= 1 && day <= 5 && hour >= 8 && hour < 18);

    if(isOpen) {
        statusBadge.classList.add("bg-green-600");
        statusText.innerText = "🟢 Disponível Agora";
    } else {
        statusBadge.classList.add("bg-red-600");
        statusText.innerText = "🔴 Fora do Horário (Deixe seu Orçamento)";
    }
}

updateStatus();
