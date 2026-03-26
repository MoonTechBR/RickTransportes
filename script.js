const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const leadModal = document.getElementById("lead-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");
const phoneNumber = "5511963692499";

let cart = [];

// Iniciar Autocomplete do Google (Se a API for carregada)
if(typeof google !== 'undefined') {
    new google.maps.places.Autocomplete(document.getElementById('origin'));
    new google.maps.places.Autocomplete(document.getElementById('destination'));
}

// Abrir Modal Completo
cartBtn.addEventListener("click", () => {
    renderCart();
    cartModal.classList.remove("hidden");
});

// Botão de Orçamento Rápido (Captura de Lead)
document.getElementById('quick-lead-btn').addEventListener('click', () => {
    leadModal.classList.remove("hidden");
});

// Adicionar Item (Delegação de evento)
document.addEventListener("click", (e) => {
    let addBtn = e.target.closest(".add-to-cart-btn");
    if(addBtn) {
        const name = addBtn.dataset.name;
        const price = parseFloat(addBtn.dataset.price);
        addToCart(name, price);
    }
});

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if(existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCount();
    Toastify({ text: "Adicionado à lista!", gravity: "top", position: "right", style: { background: "#0e1e35" } }).showToast();
}

function updateCount() {
    cartCount.innerText = cart.reduce((total, item) => total + item.qty, 0);
}

function renderCart() {
    cartItemsContainer.innerHTML = "";
    cart.forEach(item => {
        const div = document.createElement("div");
        div.className = "flex justify-between items-center bg-gray-50 p-2 rounded-lg border-l-4 border-rick-cyan";
        div.innerHTML = `
            <div>
                <p class="font-bold text-xs uppercase">${item.name}</p>
                <p class="text-xs">Qtd: ${item.qty}</p>
            </div>
            <button onclick="removeItem('${item.name}')" class="text-red-500 text-xs font-bold">Remover</button>
        `;
        cartItemsContainer.appendChild(div);
    });
}

window.removeItem = (name) => {
    cart = cart.filter(item => item.name !== name);
    renderCart();
    updateCount();
}

// Envio Completo
checkoutBtn.addEventListener("click", () => {
    const origin = document.getElementById('origin').value;
    const dest = document.getElementById('destination').value;
    if(cart.length === 0 || !origin || !dest) return alert("Selecione o serviço e endereços!");

    const itemsStr = cart.map(i => `• ${i.name} (x${i.qty})`).join("\n");
    const msg = encodeURIComponent(
        `🚛 *RICK TRANSPORTES - SOLICITAÇÃO*\n\n` +
        `📦 *ITENS:*\n${itemsStr}\n\n` +
        `📍 *RETIRADA:* ${origin}\n` +
        `🏁 *ENTREGA:* ${dest}\n` +
        `📝 *OBS:* ${document.getElementById('obs').value}\n\n` +
        `_Enviado pelo site Rick Transp._`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${msg}`);
});

// Envio de Lead Rápido
document.getElementById('send-lead-btn').addEventListener('click', () => {
    const phone = document.getElementById('lead-phone').value;
    if(!phone) return alert("Informe seu telefone!");
    
    const msg = encodeURIComponent(`⚡ *ORÇAMENTO RÁPIDO*\nOlá Rick, me ligue para um orçamento no número: ${phone}`);
    window.open(`https://wa.me/${phoneNumber}?text=${msg}`);
    leadModal.classList.add("hidden");
});

// Fechar Modais
document.getElementById('close-modal-btn').addEventListener('click', () => cartModal.classList.add("hidden"));

// Lógica de Status
function updateStatus() {
    const h = new Date().getHours();
    const badge = document.getElementById('status-badge');
    const text = document.getElementById('status-text');
    if(h >= 8 && h < 18) {
        badge.classList.replace('bg-gray-700', 'bg-green-600');
        text.innerText = "🟢 Disponível Agora";
    } else {
        text.innerText = "🔴 Orçamentos em Fila";
    }
}
updateStatus();
