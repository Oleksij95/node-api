module.exports = class ProductDto {
    id;
    name;
    price;
    rang;
    type;
    tag;
    img
    
    constructor(model) {
        this.id = model.id
        this.name = model.name
        this.price = model.price
        this.rang = model.rang
        this.type = model.type
        this.tag = model.tag
        this.img = model.img
    }
}