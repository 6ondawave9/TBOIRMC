const fs = require('fs')
const xml = require('xmlbuilder2')
const child_process = require('child_process')
const { ItemLuaTemplateGenerator } = require('./itemluatemplategenerator')
const sharp = require('sharp')
sharp.cache(false)

exports.ModBuilder = {
    modName: 'Sample mod',
    appPath: '/',

    createMod(mod, appPath) {
        this.modName = mod.name
        this.appPath = appPath
        if (fs.existsSync(`${this.appPath}/mod_output/${this.modName}`)) {
            console.log('Updating mod')
            fs.rmSync(`${this.appPath}/mod_output/${this.modName}`, { recursive: true, force: true });
        } else {
            console.log('Creating mod')
        }
        this.init(this.appPath)
        mod.items.forEach((el, i)=>{
            this.addItem(el, i, this.appPath)
        })
        this.saveImgs(mod.files, this.appPath)
        console.log('Mod builing complete')
        
        child_process.exec(`start "" "${this.appPath}/mod_output"`)
    },

    init: function() {
        if (!fs.existsSync(`${this.appPath}/mod_output`)) {
            fs.mkdirSync(`${this.appPath}/mod_output`)
        }
        fs.mkdirSync(`${this.appPath}/mod_output/${this.modName}`)
        fs.mkdirSync(`${this.appPath}/mod_output/${this.modName}/resources`)
        fs.mkdirSync(`${this.appPath}/mod_output/${this.modName}/resources/gfx`)
        fs.mkdirSync(`${this.appPath}/mod_output/${this.modName}/resources/gfx/items`)
        fs.mkdirSync(`${this.appPath}/mod_output/${this.modName}/resources/gfx/items/collectibles`)
        
        fs.mkdirSync(`${this.appPath}/mod_output/${this.modName}/content`)
        let items = xml.create()
        .ele('items')
        .att('gfxroot', 'gfx/items/')
        .att('version', '1')
        items.end()
        fs.writeFileSync(`${this.appPath}/mod_output/${this.modName}/content/items.xml`, items.toString({prettyPrint: true}))

        let itempools = xml.create()
        .ele('ItemPools')
        itempools.end()
        fs.writeFileSync(`${this.appPath}/mod_output/${this.modName}/content/itempools.xml`, itempools.toString({prettyPrint: true}))

        let dataToWrite = `local mod = RegisterMod("${this.modName}", 1)`
        fs.writeFileSync(`${this.appPath}/mod_output/${this.modName}/main.lua`, dataToWrite)
    },

    addItem(item, index) {
        this.addToItemsXml(item, index, this.appPath)
        this.addToPoolsXml(item, this.appPath)
        if (item.stats) {
            this.addToLua(item, this.appPath)
        }
    },

    addToItemsXml(item, index) {
        let items = fs.readFileSync(`${this.appPath}/mod_output/${this.modName}/content/items.xml`, {encoding: 'utf-8'})
        items = xml.convert(items, {format: 'object'})

        if (!items.items.passive) {
            items.items.passive = []
        } else if (!Array.isArray(items.items.passive)) {
            items.items.passive = [items.items.passive]
        }

        let statsString = ''
        if (item.stats) {
            item.stats.forEach(el=>{statsString += `${el.type} `})
        }

        items.items.passive.push({
            '@id': index + 1,
            '@name': item.name,
            '@gfx': item.img,
            '@description': item.description,
            '@quality': item.quality,
            '@cache': statsString,
            '@bombs': item.bombs ?? '0',
            '@keys': item.keys ?? '0',
            '@coins': item.coins ?? '0',
            '@blackhearts': item.blackhearts ?? '0',
            '@soulhearts': item.soulhearts ?? '0',
            '@maxhearts': item.maxhearts ?? '0',
            '@hearts': item.hearts ?? '0',
        })

        let updatedItems = xml.create(items)
        fs.writeFileSync(`${this.appPath}/mod_output/${this.modName}/content/items.xml`, updatedItems.toString({prettyPrint: true}))
    },

    addToPoolsXml(item) {
        let itempools = fs.readFileSync(`${this.appPath}/mod_output/${this.modName}/content/itempools.xml`, {encoding: 'utf-8'})
        itempools = (xml.convert(itempools, {format: 'object'}))
        item.pools.forEach(el=>{
            if (!itempools.ItemPools.Pool) {itempools.ItemPools.Pool = []}
            if (!Array.isArray(itempools.ItemPools.Pool)) {itempools.ItemPools.Pool = [itempools.ItemPools.Pool]}
            let pool = itempools.ItemPools.Pool.find(elp=>elp['@Name'] == el.type)
            if (!pool) {
                itempools.ItemPools.Pool.push({
                    '@Name': el.type,
                    Item: [{
                        '@Name': item.name,
                        '@Weight': el.weight,
                        '@DecreaseBy': el.decreaseBy,
                        '@RemoveOn': el.removeOn,
                    }]
                })
            } else {
                pool = pool.Item
                if (!Array.isArray(pool)) {
                    itempools.ItemPools.Pool.find(elp=>elp['@Name'] == el.type).Item = [pool]
                    pool = itempools.ItemPools.Pool.find(elp=>elp['@Name'] == el.type).Item
                }
                pool.push({
                    '@Name': item.name,
                    '@Weight': el.weight,
                    '@DecreaseBy': el.decreaseBy,
                    '@RemoveOn': el.removeOn,
                })
            }
        })
        let updatedPools = xml.create(itempools)
        fs.writeFileSync(`${this.appPath}/mod_output/${this.modName}/content/itempools.xml`, updatedPools.toString({prettyPrint: true}))
    },

    addToLua(item) {
        let dataToWrite = ItemLuaTemplateGenerator.generateItemLuaTemplate(item)
        fs.appendFileSync(`${this.appPath}/mod_output/${this.modName}/main.lua`, dataToWrite)
    },

    saveImgs(files) {
        files.forEach(async el=>{
            let path = `${this.appPath}\\mod_output\\${this.modName}\\resources\\gfx\\items\\collectibles\\`
            fs.copyFileSync(el.path, `${path}${el.name}`)
            let buffer = await sharp(`${path}${el.name}`)
            .resize(32, 32, {fit: 'fill'})
            .toBuffer()
            fs.rmSync(`${path}${el.name}`)
            sharp(buffer).toFile(`${path}${el.name}`)
        })
    }
}