var StorageSystem = function() {
    this.status = false;
    this.base64 = new Base64();
    this.gameTag = "heroCrash@heroofhires.com";
    this.recordNum;
    if (typeof(Storage) != "undefined") {
        this.status = true;
    }
    this.saveProgress = function(obj) {
        var recordName = this.gameTag + this.recordNum;
        localStorage.setItem(recordName, this.base64.encode(JSON.stringify(obj)));
    }
    this.readRecord = function() {
        var recordList = [];
        var recordName1 = this.gameTag + 1;
        var recordName2 = this.gameTag + 2;
        var record1 = localStorage.getItem(recordName1);
        var record2 = localStorage.getItem(recordName2);
        if (record1) {
            record1 = this.base64.decode(localStorage.getItem(recordName1));
        };
        if (record2) {

            record2 = this.base64.decode(localStorage.getItem(recordName2));
        };
        recordList[0] = JSON.parse(record1);
        recordList[1] = JSON.parse(record2);
        return recordList;
    }
    this.setRecord = function(recordNum) {
        this.recordNum = recordNum;
    }
}