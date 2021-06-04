const fs = require('fs');
const DefaultPath = __dirname + "/settings.json"

export class NeuDB {
    /**
     *Creates an instance of NeuDB.
     * @param {*} [data={}] default data, even old save files will be updated automatically
     * @param {boolean} [autoSave=true] should it automatically save on push/set
     * @param {*} [path=DefaultPath] path the savefile is in default = "__dirname/settings.json"
     * @memberof NeuDB
     */
    constructor(data = {}, autoSave = true, path = DefaultPath) {
        this.path = path;
        this.autoSave = autoSave;
        if (!fs.existsSync(this.path)) {
            this.saveData = data
            this.save();
        } else {
            this.load();
            //fix potential missing fields
            this.saveData = MakeValid(this.saveData, data);
            this.save();
        }
        console.log(this.path)
    }
    /**
     *
     *Change filename of save file to: "__dirname/${filename}" don't forget to put .json
     * @memberof NeuDB
     */
    set filename(filename) {
        this.path = __dirname + "/" + filename;
    }
    /**
     *
     * sets value of property
     * @param {*} property property you want to set (ex. "name", or "user.name")
     * @param {*} value value you want to set it to
     * @memberof NeuDB
     */
    set(property, value) {
        if (property.trim() == "") return new Error("Invalid path");
        this.saveData[property] = value;

        if (this.autoSave)
            this.save();
    }
    /**
     *
     * Get value of property
     * @param {*} property property you want to get (ex. "name", or "user.name")
     * @returns value of property
     * @memberof NeuDB
     */
    get(property) {
        if (property == undefined || property == "")
            return this.saveData;
        else if (this.saveData[property])
            return this.saveData[property]
        else
            return new Error("Invalid path")
    }
    /**
     *
     * push item to array property (no duplicates)
     * @param {*} property property you want to push to (ex. "name", or "user.name")
     * @param {*} value value to add to list
     * @param {boolean} [force=false] if true always add, even if it already exists
     * @memberof NeuDB
     */
    push(property, value, force = false) {
        if (Array.isArray(this.saveData[property])) {
            if (!this.saveData[property].includes(value) || force) {
                this.saveData[property].push(value);

                if (this.autoSave)
                    this.save();
            }
        }
        else {
            console.log("push", property, this.saveData[property])
            throw new Error("not an array")
        }
    }
    /**
     * Save data to database
     *
     * @memberof NeuDB
     */
    save() {
        SaveJson(this.saveData, this.path);
    }
    /**
     * Load data from database
     * called Locally
     * @memberof NeuDB
     */
    load() {
        this.saveData = LoadJson(this.path);
    }
}

function MakeValid(ob, compare) {
    let newob = {};
    for (let prop in compare) newob[prop] = (!(ob[prop] == null || ob[prop] == undefined)) ? ob[prop] : compare[prop];
    return newob;
}

function SaveJson(json, location) {
    let data = JSON.stringify(json, null, 4);
    fs.writeFileSync(location, data);
}

function LoadJson(location) {
    let raw = fs.readFileSync(location);
    return JSON.parse(raw);
}