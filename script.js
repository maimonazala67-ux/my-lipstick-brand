const shades = [
  { name: 'Rosewood', code: 'LL 01', color: '#9b4f59', tone: 'soft berry' },
  { name: 'After Hours', code: 'LL 07', color: '#6b2737', tone: 'deep wine' },
  { name: 'Barely There', code: 'LL 12', color: '#c88776', tone: 'warm nude' },
  { name: 'Mauve Muse', code: 'LL 18', color: '#a96b7e', tone: 'dusty pink' },
]

const shadeName = document.querySelector('[data-shade-name]')
const shadeTone = document.querySelector('[data-shade-tone]')
const shadeSwatch = document.querySelector('[data-shade-swatch]')
const heroShade = document.querySelector('[data-hero-shade]')
const heroIndex = document.querySelector('[data-hero-index]')
const cartPage = document.querySelector('[data-cart-page]')
const cartItems = document.querySelector('[data-cart-items]')
const cartCount = document.querySelector('[data-cart-count]')
const cartTotal = document.querySelector('[data-cart-total]')
const toast = document.querySelector('[data-toast]')
const checkoutPage = document.querySelector('[data-checkout-page]')
const products = {
  Rosewood: { image: '/assets/rosewood-lipstick.webp', description: 'A soft berry satin with a second-skin finish and buildable pigment.' },
  'After Hours': { image: '/assets/after-hours-lipstick.webp', description: 'A deep wine velvet matte made for late nights and lasting color.' },
  'Barely There': { image: '/assets/barely-there-lipstick.webp', description: 'A warm nude satin that gives lips a polished, effortless wash of color.' },
}
let cart = []
let activeShadeIndex = 0
let moodIndex = 0

function setShade(index) {
  activeShadeIndex = index % shades.length
  const shade = shades[activeShadeIndex]
  shadeName.textContent = shade.name
  shadeTone.textContent = shade.tone
  shadeSwatch.style.backgroundColor = shade.color
  heroShade.textContent = shade.name
  heroIndex.textContent = String(activeShadeIndex + 1).padStart(2, '0')
  document.documentElement.style.setProperty('--active-shade', shade.color)
}

document.querySelector('[data-next-shade]').addEventListener('click', () => setShade(activeShadeIndex + 1))
document.querySelector('[data-menu]').addEventListener('click', (event) => {
  const nav = document.querySelector('[data-nav]')
  nav.classList.toggle('is-open')
  const isOpen = nav.classList.contains('is-open')
  document.body.classList.toggle('menu-is-open', isOpen)
  event.currentTarget.setAttribute('aria-expanded', isOpen)
})

document.querySelectorAll('[data-nav] a').forEach((link) => link.addEventListener('click', () => {
  document.querySelector('[data-nav]').classList.remove('is-open')
  document.body.classList.remove('menu-is-open')
}))

document.querySelectorAll('[data-wishlist]').forEach((button) => button.addEventListener('click', () => {
  button.classList.toggle('is-saved')
  button.setAttribute('aria-pressed', button.classList.contains('is-saved'))
}))

function showToast(message) {
  toast.textContent = message
  toast.classList.add('is-visible')
  window.setTimeout(() => toast.classList.remove('is-visible'), 2600)
}

function renderCart() {
  const count = cart.reduce((total, item) => total + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  cartCount.textContent = count
  cartTotal.textContent = `$${total}`
  cartItems.innerHTML = cart.length ? cart.map((item) => `<div class="cart-item"><span class="cart-product-art" style="--cart-shade:${item.color}"><i></i><b></b></span><div><strong>${item.name} lipstick</strong><small>$${item.price} · ${item.tone || 'Couture color'}</small></div><div class="quantity-control"><button data-quantity="-1" data-name="${item.name}" aria-label="Decrease ${item.name} quantity">−</button><span>${item.quantity}</span><button data-quantity="1" data-name="${item.name}" aria-label="Increase ${item.name} quantity">+</button></div><strong>$${item.price * item.quantity}</strong><button data-remove="${item.name}" aria-label="Remove ${item.name}">×</button></div>`).join('') : '<p class="empty-cart">Your bag is waiting for a little color.</p>'
  cartItems.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => {
    cart = cart.filter((item) => item.name !== button.dataset.remove)
    renderCart()
  }))
  cartItems.querySelectorAll('[data-quantity]').forEach((button) => button.addEventListener('click', () => {
    const item = cart.find((entry) => entry.name === button.dataset.name)
    item.quantity += Number(button.dataset.quantity)
    if (item.quantity < 1) cart = cart.filter((entry) => entry.name !== item.name)
    renderCart()
  }))
}

function openCart() { cartPage.classList.add('is-open'); document.body.classList.add('cart-is-open'); renderCart() }
function closeCart() { cartPage.classList.remove('is-open'); document.body.classList.remove('cart-is-open') }

document.querySelectorAll('[data-add-cart]').forEach((button) => button.addEventListener('click', () => {
  const existing = cart.find((item) => item.name === button.dataset.name)
  if (existing) existing.quantity += 1
  else cart.push({ name: button.dataset.name, price: Number(button.dataset.price), color: button.dataset.color, quantity: 1, tone: button.closest('.product-card').querySelector('.product-info p').textContent })
  renderCart()
  showToast(`${button.dataset.name} added to your bag`)
}))
document.querySelector('[data-cart-open]').addEventListener('click', openCart)
document.querySelectorAll('[data-cart-close]').forEach((button) => button.addEventListener('click', closeCart))
document.querySelector('[data-checkout]').addEventListener('click', () => showToast(cart.length ? 'Checkout is ready for your order.' : 'Add a shade before checking out.'))
document.querySelector('[data-checkout]').addEventListener('click', () => {
  if (!cart.length) return
  document.querySelector('[data-checkout-items]').innerHTML = cart.map((item) => `<p><span>${item.name} lipstick × ${item.quantity}</span><strong>$${item.price * item.quantity}</strong></p>`).join('')
  document.querySelector('[data-checkout-total]').textContent = `$${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}`
  checkoutPage.classList.add('is-open')
})
document.querySelector('[data-checkout-close]').addEventListener('click', () => checkoutPage.classList.remove('is-open'))
document.querySelector('[data-checkout-form]').addEventListener('submit', (event) => {
  event.preventDefault()
  checkoutPage.querySelector('h2').innerHTML = 'Order<br><em>received.</em>'
  checkoutPage.querySelector('form').innerHTML = '<p class="eyebrow">Thank you</p><h3>Your color story is on its way.</h3><p class="checkout-success">We have reserved your shades. A confirmation email will arrive shortly.</p><button class="button button-dark" type="button" data-checkout-done>Back to shopping →</button>'
  checkoutPage.querySelector('[data-checkout-done]').addEventListener('click', () => { checkoutPage.classList.remove('is-open'); cart = []; renderCart() })
})
document.querySelector('[data-search]').addEventListener('click', () => {
  const query = window.prompt('Search LuxeLips shades')
  if (query) showToast(`Searching for “${query}”`)
})
document.querySelector('[data-wishlist-filter]').addEventListener('click', () => showToast('Your wishlist is ready for your favorites.'))
document.querySelector('[data-account]').addEventListener('click', () => showToast('Account sign-in is coming soon.'))
document.querySelector('[data-mood]').addEventListener('click', (event) => {
  const moods = ['Quietly iconic', 'Make an entrance', 'After dark', 'Soft focus']
  moodIndex = (moodIndex + 1) % moods.length
  event.currentTarget.firstChild.textContent = moods[moodIndex] + ' '
  setShade(moodIndex)
})

function filterProducts(filter) {
  document.querySelectorAll('[data-product]').forEach((product) => {
    product.hidden = filter !== 'all' && product.dataset.category !== filter
  })
}
document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('is-active'))
  button.classList.add('is-active')
  filterProducts(button.dataset.filter)
}))
document.querySelector('[data-sort]').addEventListener('change', (event) => {
  const grid = document.querySelector('#product-grid')
  const cards = [...grid.querySelectorAll('[data-product]')]
  cards.sort((a, b) => event.target.value === 'price-high' ? Number(b.dataset.priceValue) - Number(a.dataset.priceValue) : event.target.value === 'name' ? a.dataset.nameValue.localeCompare(b.dataset.nameValue) : 0)
  cards.forEach((card) => grid.appendChild(card))
})
document.querySelectorAll('[data-category-link]').forEach((link) => link.addEventListener('click', () => {
  const filter = link.dataset.categoryLink === 'nude' ? 'all' : link.dataset.categoryLink === 'red' ? 'best' : 'best'
  document.querySelector(`[data-filter="${filter}"]`).click()
}))

const productModal = document.querySelector('[data-product-modal]')
document.querySelectorAll('[data-quick-view]').forEach((button) => button.addEventListener('click', () => {
  const product = products[button.dataset.quickView]
  productModal.querySelector('[data-modal-title]').textContent = button.dataset.quickView
  productModal.querySelector('[data-modal-description]').textContent = product.description
  productModal.querySelector('[data-modal-image]').src = product.image
  productModal.querySelector('[data-modal-image]').alt = `${button.dataset.quickView} lipstick`
  productModal.querySelector('[data-modal-add]').dataset.name = button.dataset.quickView
  productModal.querySelector('[data-modal-add]').dataset.price = '32'
  productModal.querySelector('[data-modal-add]').dataset.color = document.querySelector(`[data-add-cart][data-name="${button.dataset.quickView}"]`).dataset.color
  productModal.classList.add('is-open')
  document.querySelector('.modal-overlay').classList.add('is-open')
}))
function closeModal() { productModal.classList.remove('is-open'); document.querySelector('.modal-overlay').classList.remove('is-open') }
document.querySelectorAll('[data-modal-close]').forEach((button) => button.addEventListener('click', closeModal))
document.querySelector('[data-modal-add]').addEventListener('click', (event) => {
  const product = document.querySelector(`[data-add-cart][data-name="${event.currentTarget.dataset.name}"]`)
  product.click()
  closeModal()
})
document.querySelector('[data-newsletter]').addEventListener('submit', (event) => {
  event.preventDefault()
  event.currentTarget.reset()
  document.querySelector('[data-form-message]').textContent = 'You are on the list. Welcome to Maimona Zala’s world of color.'
})

document.querySelector('[data-try-on]').addEventListener('click', () => {
  document.querySelector('[data-try-message]').textContent = 'Camera preview ready for your shade.'
})

setShade(1)
window.setInterval(() => setShade(activeShadeIndex + 1), 4200)