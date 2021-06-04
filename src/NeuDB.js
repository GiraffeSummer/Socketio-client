const fs = require('fs');
const DefaultPath = __dirname + "/settings.json"

export class NeuDB {
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
    get data() { return this.saveData }
    set data(data) {
        this.saveData = data;

        if (this.autoSave)
            this.save();
    }
    set filename(filename) {
        this.path = __dirname + "/" + filename;
    }
    set(path, value) {
        this.saveData[path] = value;

        if (this.autoSave)
            this.save();
    }
    get(path) { return this.saveData[path] }
    push(path, value, force = false) {
        if (Array.isArray(this.saveData[path])) {
            if (!this.saveData[path].includes(value) || force) {
                this.saveData[path].push(value);

                if (this.autoSave)
                    this.save();
            }
        }
        else {
            console.log("push", path, this.saveData[path])
            throw new Error("not an array")
        }
    }
    save() {
        SaveJson(this.saveData, this.path);
    }
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