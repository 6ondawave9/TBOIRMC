console.log('TBOI:R MOD CONSTRUCTOR')

let files = []
let items = []

let addItemWindow = document.querySelector('#add-item-window-wrapper')

let modName = document.querySelector('#mod-name')
let addItemName = document.querySelector('#add-item-name')
let addItemSprite = document.querySelector('#add-item-sprite')
let addItemQuality = document.querySelector('#add-item-quality')
let addItemDescription = document.querySelector('#add-item-description')
let addItemKeys = document.querySelector('#add-item-keys')
let addItemBombs = document.querySelector('#add-item-bombs')
let addItemCoins = document.querySelector('#add-item-coins')
let addItemEmptyHearts = document.querySelector('#add-item-empty-hearts')
let addItemHearts = document.querySelector('#add-item-hearts')
let addItemSoulHearts = document.querySelector('#add-item-soulherats')
let addItemBlackHearts = document.querySelector('#add-item-blackhearts')

let addStatBtn = document.querySelector('#add-item-add-stat')
let addPoolBtn = document.querySelector('#add-item-add-pool')

addStatBtn.addEventListener('click', appendAddItemStatBlock)
addPoolBtn.addEventListener('click', appendAddItemPoolBlock)
document.querySelector('#build-item-btn').addEventListener('click', addItem)
document.querySelector('#build-mod-btn').addEventListener('click', buildMod)
document.querySelector('#alert button').addEventListener('click', ()=>{
    document.querySelector('#alert-wrapper').style.display = 'none'
})

document.querySelector('#add-btn').addEventListener('click', showAddItemWindow)
document.querySelector('input[type=file]').addEventListener('input', ()=> {
    document.querySelector('#add-item-img').src = document.querySelector('input[type=file]').files[0].path
})
addItemWindow.addEventListener('click', (e)=> {
    if (e.target.id == 'add-item-window-wrapper') {
        addItemWindow.style.display = 'none'
    }
})
function showAddItemWindow() {
    addItemWindow.style.display = 'flex'
    addItemName.value = ''
    addItemSprite.value = ''
    addItemQuality.value = '0'
    addItemDescription.value = ''
    addItemKeys.value = ''
    addItemBombs.value = ''
    addItemCoins.value = ''
    addItemEmptyHearts.value = ''
    addItemHearts.value = ''
    addItemSoulHearts.value = ''
    addItemBlackHearts.value = ''

    document.querySelector('input[type=file]').value = ''
    document.querySelector('#add-item-img').src = 'resources/img.png'

    document.querySelector('#add-item-pools-wrapper').innerHTML = ''
    document.querySelector('#add-item-stats-wrapper').innerHTML = ''
}

function appendAddItemStatBlock() {
    let wrapper = document.querySelector('#add-item-stats-wrapper')

    let block = document.createElement('div')
    block.classList.add('add-item-stat-block')

    let type = document.createElement('select')
    type.classList.add('add-item-stat-type')

    let types = ['firedelay', 'damage', 'speed', 'range', 'shotspeed', 'luck']
    types.forEach(el=>{
        let option = document.createElement('option')
        option.innerText = el
        type.append(option)
    })

    block.append(type)

    let amount = document.createElement('input')
    amount.setAttribute('type', 'text')
    amount.setAttribute('placeholder', '1')
    amount.classList.add('add-item-stat-amount')
    block.append(amount)

    wrapper.append(block)
}

function appendAddItemPoolBlock() {
    let wrapper = document.querySelector('#add-item-pools-wrapper')

    let block = document.createElement('div')
    block.classList.add('add-item-pool-block')

    let type = document.createElement('select')
    type.classList.add('add-item-pool-type')

    let types = ['treasure', 'shop', 'boss', 'secret', 'library', 'curse', 'devil', 'angel', 'goldenChest', 'redChest', 'beggar', 'demonBeggar', 'keyMaster', 'bombBum', 'greedTreasure', 'greedBoss', 'greedShop', 'greedCurse', 'greedDevil', 'greedAngel', 'greedLibrary', 'greedSecret', 'greedGoldenChest']
    types.forEach(el=>{
        let option = document.createElement('option')
        option.innerText = el
        type.append(option)
    })

    block.append(type)

    let attributes = ['weight', 'decreaseBy', 'removeOn']
    attributes.forEach(el=>{
        let input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.setAttribute('placeholder', el)
        input.classList.add(`add-item-pool-input-${el}`)
        block.append(input)
    })

    wrapper.append(block)
}

function addItem() {
    let item = buildItem()
    if (!item) {return}
    items.push(item)

    let itemsWrapper = document.querySelector('#items-wrapper')
    let itemBlock = document.createElement('div')
    itemBlock.classList.add('main-item')
    itemBlock.id = item.name.replaceAll(' ', '_')

    let itemName = document.createElement('div')
    itemName.innerText = item.name
    itemBlock.append(itemName)

    let itemImg = document.createElement('img')
    itemImg.src = (files.find(el=>el.name == item.img)).path
    itemBlock.append(itemImg)

    let deleteBtn = document.createElement('span')
    deleteBtn.innerText = '❌'
    deleteBtn.addEventListener('click', ()=>{
        items.splice(items.indexOf(items.find(el=>el.name == item.name)), 1)
        files.splice(files.indexOf(files.find(el=>el.name == item.img)), 1)
        document.querySelector(`#${item.name.replaceAll(' ', '_')}`).remove()
    })
    itemBlock.append(deleteBtn)
    
    itemsWrapper.append(itemBlock)
    addItemWindow.style.display = 'none'
}

function buildItem() {
    let itemToAdd = {}
    
    if (!nameValidation(addItemName.value)) {return false}
    itemToAdd.name = addItemName.value


    if (!document.querySelector('input[type=file]').files.length) {
        showAlert('No image!')
        return false
    }
    itemToAdd.img = document.querySelector('input[type=file]').files[0].name
    files.push({
        path: document.querySelector('input[type=file]').files[0].path,
        name: document.querySelector('input[type=file]').files[0].name
    })
    
    itemToAdd.quality = addItemQuality.value
    itemToAdd.description = addItemDescription.value

    itemToAdd.bombs = addItemBombs.value ? addItemBombs.value : 0 
    itemToAdd.keys = addItemKeys.value ? addItemKeys.value : 0 
    itemToAdd.coins = addItemCoins.value ? addItemCoins.value : 0 

    itemToAdd.maxhearts = addItemEmptyHearts.value ? addItemEmptyHearts.value : 0 
    itemToAdd.hearts = addItemHearts.value ? addItemHearts.value : 0 

    itemToAdd.soulhearts = addItemSoulHearts.value ? addItemSoulHearts.value : 0 
    itemToAdd.blackhearts = addItemBlackHearts.value ? addItemBlackHearts.value : 0

    let stats = document.querySelectorAll('.add-item-stat-type')
    let statsAmounts = document.querySelectorAll('.add-item-stat-amount')
    if (stats) {
        itemToAdd.stats = []
        stats.forEach((el, i)=>{
            itemToAdd.stats.push({
                type: el.value,
                amount: statsAmounts[i].value
            })
        })
    }

    let pools = document.querySelectorAll('.add-item-pool-type')
    let weights = document.querySelectorAll('.add-item-pool-input-weight')
    let decreaseBys = document.querySelectorAll('.add-item-pool-input-decreaseBy')
    let removeOns = document.querySelectorAll('.add-item-pool-input-removeOn')
    itemToAdd.pools = []
    pools.forEach((el, i)=>{
        itemToAdd.pools.push({
            type: el.value,
            weight: weights[i].value,
            decreaseBy: decreaseBys[i].value,
            removeOn: removeOns[i].value
        })
    })

    return itemToAdd
}

function buildMod() {
    if (!nameValidation(modName.value)) {
        return false
    }

    let mod = {
        name: modName.value,
        items,
        files
    }

    window.electronAPI.buildMod(mod)
}

function nameValidation(value) {
    if (!value) {
        showAlert('No name!')
        return false
    }
    if (value != value.replace(/[^a-zа-яё0-9\s]/gi, '') || value[0] != value[0].replace(/[^a-zа-яё]/gi, '')) {
        showAlert('Name is not valid!')
        return false
    }

    return true
}

function showAlert(mes) {
    document.querySelector('#alert-wrapper').style.display = 'flex'
    document.querySelector('#alert h2').innerText = mes
}