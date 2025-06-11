/* Helper function: will try to find required 
document and throw error if not found */ 
export async function findByIdRequired(model, id) {
    const doc = await model.findById(id)

    if(!doc) {
        throw "Could not find requested table"
    }

    return doc
}

export function getInitAndFinalThreshes(calcId, thresholds) {
    thresholds.filter(thresh => 
        thresh.calc === calcId && 
        (thresh.isFinal || thresh.isInitial))
}

export function getAll() {
    return this.find().sort({ date_created: -1 })
}

export function createTable(data) {
    const newTable = new this({
        ...data
    })

    return newTable.save()
}

export async function editTable(tableId, data) {
    const table = await this.findById(tableId)

    const {
        name,
        tableUrl,
        year
    } = data

    table.name = name
    table.url = tableUrl
    table.year = year

    return table.save()
}

export async function toggleEnabled(tableId) {
    const table = await findByIdRequired(this, tableId)

    /* If we are about to enable table (i.e.: currently disabled),
        find an already enabled table and disable it */
    if(!table.enabled) {
        const tableToDisable = await this.findOne({ $and: 
            [{enabled: true}, {_id: {$ne: tableId}}] })
        
        // First disable formerly enabled table
        if(tableToDisable) {
            tableToDisable.enabled = false
            await tableToDisable.save()
        }

        // Then enable the requested table
        table.enabled = true 
    }
    // If table is enabled, disable it
    else {
        table.enabled = false
    }

    return table.save()
}

export async function addThreshold(tableId, threshData) {
    const {
        fieldId,
    } = threshData

    const table = await findByIdRequired(this, tableId)

    const newThreshold = {
        ...threshData,
        field: fieldId
    }

    const thresholds = table.thresholds
    thresholds.push(newThreshold)

    return table.save()
}

export async function editThreshold(tableId, threshId, threshData) {
    const {
        date,
        isFinal,
        value
    } = threshData

    const table = await findByIdRequired(this, tableId)

    const threshold = table.thresholds.id(threshId)

    threshold.set({
        ...threshold,
        date,
        isFinal,
        value
    })

    await table.save()
    return threshold
}

export async function removeThreshold(tableId, threshId) {
    const table = await findByIdRequired(this, tableId)
    const threshold = table.thresholds.id(threshId)
    await threshold.remove()
    return table.save()
}

export async function deleteTable(id) {
    return this.findOneAndRemove({ _id: id })
}