module.exports = class UserDto {
    email;
    id;
    isActivated;
    last_name;
    first_name;

    constructor(model) {
        this.first_name = model.first_name
        this.last_name = model.last_name
        this.email = model.email
        this.id = model._id
        this.isActivated = model.isActivated
    }
}