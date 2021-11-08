
const { Menu, MenuItem, Restaurant } = require('../sequelize-connect');
function stringContainsNumber(input) {
    return /\d/.test(input);
}

function switchParams(params) {
    if (params.match(/^\/api\/restaurants?(\/[0-9]+)?$/)) {
        params = Restaurant
    }
    else if (params.match(/^\/api\/restaurants\/[0-9]+\/menus?(\/[0-9]+)?$/)) {
        params = Menu;
    }
    else if (params.match(/^\/api\/menus?(\/[0-9]+)?$/)) {
        params = Menu
    }
    else if (params.match(/^\/api\/menus\/[0-9]+\/menuItems?(\/[0-9]+)?$/)) {
        params = MenuItem;
    }
    else if (params.match(/^\/api\/menuItems?(\/[0-9]+)?$/)) {
        params = MenuItem
    } 
    else{
        throw new Error ('Use a valid URL')
    }
    return params;

}

const dbRead = async (reqPath, reqParamsId) => {
    const dbTable = switchParams(reqPath)
    let toReturn;
    let whereParams;
    if (reqPath.endsWith("s") && !stringContainsNumber(reqPath)) {
        // find all rows in the database matching (all in this case)
        toReturn = await dbTable.findAll()

    }
    else if (reqPath.endsWith("s") && stringContainsNumber(reqPath)) {
        // find all rows in the database matching, where foreignKey ID matches
        if (dbTable == Menu) {
            whereParams = {
                where: {
                RestaurantId: reqParamsId
            }}            
        }
        else if (dbTable == MenuItem) {
            whereParams = {
                where: {
                MenuId: reqParamsId
            }}
        }
        toReturn = await dbTable.findAll(whereParams)
    }
    else {
        // find the row that matches the ID
        // let lastIndex = reqPath.lastIndexOf('/') + 1;
        // toReturn = await dbTable.findByPk(parseInt(reqPath.substring(lastIndex)))
        toReturn = await dbTable.findAll({where:{id:reqParamsId}})
        // if(toReturn == null){
        //     throw new Error ('Use a valid URL')
        // }
    }
    if (toReturn == null) {
        throw new Error(`There's no ${dbTable.name} with an id of ${reqParamsId}`)
    }

    return toReturn;
}

const dbCreate = async (reqPath, reqBody, reqParamsId) => {
    const dbTable = switchParams(reqPath)
    let toReturn;

    if (reqPath.endsWith("s") && !stringContainsNumber(reqPath)) {
        // create a row in the database using sequelize create method
        toReturn = await dbTable.create(reqBody)
    }
    else if (reqPath.endsWith("s") && stringContainsNumber(reqPath)) {
        if (dbTable == Menu) {
            reqBody.RestaurantId = reqParamsId
        }
        else if (dbTable == MenuItem) {
            reqBody.MenuId = reqParamsId
        }
        toReturn = await dbTable.create(reqBody)
    }
    else {
        throw new Error("Use a valid url to create your entry")
    }


    return toReturn;

}

const dbDelete = async (reqPath, reqParamsId) => {
    const dbTable = switchParams(reqPath)
    // find the row in the db matching the ID
    const toReturn = await dbTable.findByPk(reqParamsId)
    // Delete that row
    await toReturn.destroy()
    return toReturn;
}

const dbUpdate = async (reqPath, reqParamsId, reqBody) => {
    const dbTable = switchParams(reqPath)
    // find the row in the db matching the ID
    const toReturn = await dbTable.findByPk(reqParamsId)
    // update that row, need to pass the params by their key
    await toReturn.update(reqBody)
    return toReturn;
}

module.exports = { dbRead, dbCreate, dbDelete, dbUpdate }

