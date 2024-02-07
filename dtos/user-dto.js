module.exports = class UserDto {
    email;
    id;
    name;
    username;
    steam;
    tradeLink;

    constructor(model) {
        this.name = model.name
        this.username = model.username
        this.email = model.email
        this.steam = model.steam
        this.tradeLink = model.tradeLink
        this.id = model._id
    }
}