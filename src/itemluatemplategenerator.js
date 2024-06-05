exports.ItemLuaTemplateGenerator = {
    flagsDict: {
        damage: {
            attribute: 'Damage',
            cacheFlag: 'CACHE_DAMAGE'
        },
        speed: {
            attribute: 'MoveSpeed',
            cacheFlag: 'CACHE_SPEED'
        },
        shotspeed: {
            attribute: 'ShotSpeed',
            cacheFlag: 'CACHE_SHOTSPEED'
        },
        luck: {
            attribute: 'Luck',
            cacheFlag: 'CACHE_LUCK'
        },
        firedelay: {
            attribute: 'MaxFireDelay',
            cacheFlag: 'CACHE_FIREDELAY'
        },
        range: {
            attribute: 'TearRange',
            cacheFlag: 'CACHE_RANGE'
        }
    },

    generateItemLuaTemplate(item) {
        let itemTemplateName = item.name.replaceAll(' ', '_').toLowerCase()
    
        let itemTemplateHeader = `\n
local item_${itemTemplateName} = Isaac.GetItemIdByName("${item.name}")
function mod:item_${itemTemplateName}Fn(player, cacheFlags)\n`

        let itemTemplateFooter = `\nend
mod:AddCallback(ModCallbacks.MC_EVALUATE_CACHE, mod.item_${itemTemplateName}Fn)`

        let itemTemplateBody = ''

        item.stats.forEach(el=>{
            let itemTemplateCalculateStats = ''
            let elCacheFlag = this.flagsDict[el.type].cacheFlag
            let elCacheAttribute = this.flagsDict[el.type].attribute

            if (el.type == 'firedelay') {
                itemTemplateCalculateStats += `BaseFireRate = 30 / (player.MaxFireDelay + 1)
            BaseFireRate = BaseFireRate + (player:GetCollectibleNum(item_${itemTemplateName}) * ${el.amount})
            NewFireDelay = (30 - BaseFireRate) / BaseFireRate
            DifferenceFireDelay = player.MaxFireDelay - NewFireDelay
            player.MaxFireDelay = player.MaxFireDelay - DifferenceFireDelay` 
            } else {
                itemTemplateCalculateStats += `player.${elCacheAttribute} = player.${elCacheAttribute} + (player:GetCollectibleNum(item_${itemTemplateName}) * ${el.type == 'range' ? el.amount * 40 : el.amount})`
            }

            itemTemplateBody += `\n    if cacheFlags & CacheFlag.${elCacheFlag} == CacheFlag.${elCacheFlag} then
        if player:HasCollectible(item_${itemTemplateName}) then
            ${itemTemplateCalculateStats}
        end
    end\n`
        })

        return itemTemplateHeader + itemTemplateBody + itemTemplateFooter
    }
}