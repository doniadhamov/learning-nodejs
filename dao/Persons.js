const dao = require('./base');

class Person {
    constructor({id, name, date_of_birth, address, country, email}) {
        this.id = id;
        this.name = name;
        this.date_of_birth = date_of_birth;
        this.address = address;
        this.country = country;
        this.email = email;
    }

    printPerson() {
        console.log('Name : ', this.name);
        console.log('Country : ', this.country);
    }
}

class PersonDao {
    /**
     * Create person
     * @param name
     * @param date_of_birth
     * @param address
     * @param country
     * @param email
     * @return {Promise<*>}
     */
    static async create({name, date_of_birth, address, country, email}) {
        return await dao.knex
            .insert({name, date_of_birth, address, country, email})
            .from('persons')
    }

    /**
     * Get list
     * @return {Promise<*>}
     */
    static async getList() {
        const personList = await dao.knex
            .select()
            .from('persons');
        return personList.map(person => new Person(person));
    }

    /**
     * Get person by id
     * @param id
     * @return {Promise<*>}
     */
    static async getById(id) {
        const data = await dao.knex
            .select()
            .from('persons')
            .where({id})
            .first();
        return new Person(data);
    }

    /**
     * Update person by id
     * @param id
     * @param name
     * @param date_of_birth
     * @param address
     * @param country
     * @param email
     * @return {Promise<*>}
     */
    static async update(id, {name, date_of_birth, address, country, email}) {
        return dao.knex
            .update({name, date_of_birth, address, country, email})
            .from('persons')
            .where({id})
    }

    /**
     * Delete person by id
     * @param id
     * @return {Promise<*>}
     */
    static async delete(id) {
        return dao.knex
            .from('persons')
            .where({id})
            .del();
    }

    /**
     * Batch insert
     * @param persons {Array}
     * @return {Promise<boolean>}
     */
    static async batch(persons) {
        // persons.forEach(async ({name, date_of_birth, address, country, email}) => {
        //   await dao.knex
        //     .insert({ name, date_of_birth, address, country, email })
        //     .from('persons')
        // });
        await dao.knex.batchInsert('persons', persons, persons.length);
        return true;
    }

    /**
     * Get persons by country
     * @param country
     * @return {Promise<*>}
     */
    static async getByCountry(country) {
        return dao.knex
            .from('persons')
            .where({country})
    }

    /**
     * Det by min age
     * @param age {Number}
     * @return {Promise<*>}
     */
    static async getByMinAge(age) {
        return dao.knex
            .select('id', 'name', dao.knex.raw(`date_part('year', age(date_of_birth)) as age`))
            .from('persons')
            .whereRaw(`date_part('year', age(date_of_birth)) >= ${age}`)
    }

}

module.exports = PersonDao;