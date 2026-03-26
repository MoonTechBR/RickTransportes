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

// Abrir Modal
cartBtn.addEventListener("click", () => {
    renderCart();
    cartModal.classList.remove("hidden");
});

// Fechar Modal
cartModal.addEventListener("click", (e) => {
    if(e.target === cartModal || e.target === closeModalBtn) {
        cartModal.classList.add("hidden");
    }
});

// Adicionar Item
menu.addEventListener("click", (e) => {
    let parentBtn = e.target.closest(".add-to-cart-btn");
    if(parentBtn) {
        const name = parentBtn.getAttribute("data-name");
        const price = parseFloat(parentBtn.getAttribute("data-price"));
        addToCart(name, price);
    }
});

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if(existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCount();
    Toastify({
        text: "Serviço adicionado à lista!",
        duration: 2000,
        gravity: "top",
        position: "right",
        style: { background: "#003366" },
    }).showToast();
}

function updateCount() {
    cartCount.innerText = cart.reduce((total, item) => total + item.qty, 0);
}

function renderCart() {
    cartItemsContainer.innerHTML = "";
    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "flex justify-between items-center bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500";
        div.innerHTML = `
            <div>
                <p class="font-bold uppercase text-sm">${item.name}</p>
                <p class="text-xs text-gray-500">Quantidade: ${item.qty}</p>
            </div>
            <button class="remove-btn text-red-500 text-sm font-bold" data-name="${item.name}">Remover</button>
        `;
        cartItemsContainer.appendChild(div);
    });
}

// Remover Item
cartItemsContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains("remove-btn")) {
        const name = e.target.getAttribute("data-name");
        cart = cart.filter(item => item.name !== name);
        renderCart();
        updateCount();
    }
});

// Finalizar Orçamento via WhatsApp
checkoutBtn.addEventListener("click", () => {
    if(cart.length === 0) return;

    if(originInput.value === "" || destinationInput.value === "") {
        Toastify({
            text: "Por favor, preencha Origem e Destino!",
            style: { background: "#ef4444" },
        }).showToast();
        return;
    }

    const cartMsg = cart.map(i => `• ${i.name} (x${i.qty})`).join("\n");
    const phoneNumber = "5511963692499"; // O número da sua logo
    
    const message = encodeURIComponent(
        `🚛 *NOVA SOLICITAÇÃO DE FRETE*\n\n` +
        `📦 *Serviços:*\n${cartMsg}\n\n` +
        `📍 *RETIRADA:* ${originInput.value}\n` +
        `🏁 *ENTREGA:* ${destinationInput.value}\n` +
        `📝 *DESCRIÇÃO:* ${obsInput.value || "Não informada"}\n\n` +
        `_Enviado via Orçamento Online Rick Transportes_`
    );

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
});

// Verificação de Horário Comercial
function updateStatus() {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const isOpen = (day >= 1 && day <= 5 && hour >= 8 && hour < 18) || (day === 6 && hour >= 8 && hour < 13);

    if(isOpen) {
        statusBadge.classList.add("bg-green-600");
        statusText.innerText = "🟢 Disponível Agora";
    } else {
        statusBadge.classList.add("bg-red-600");
        statusText.innerText = "🔴 Resposta em Breve (Fora do Horário Comercial)";
    }
}

updateStatus();
