/*
* Chmod Calculator for Filemin
*/

function pad(num, size) {
    return ('0000' + num).substr(-size);
}

function calc (sender, number) {
    var curval = parseInt(sender.form.permissions.value, 8);
    var num = parseInt(number, 8);
    if (sender.checked) {
        curval |= num;
    } else {
        curval ^= num;
    }
    sender.form.permissions.value = pad((curval).toString(8), 4);
}

function octalchange(sender) {
    form = sender.form;
    curval = sender.value;
    var extra = curval.charAt(0);
    var owner = curval.charAt(1);
    var group = curval.charAt(2);
    var other = curval.charAt(3);

    form.extra4.checked = extra & 4;
    form.extra2.checked = extra & 2;
    form.extra1.checked = extra & 1;
    form.owner4.checked = owner & 4;
    form.owner2.checked = owner & 2;
    form.owner1.checked = owner & 1;
    form.group4.checked = group & 4; 
    form.group2.checked = group & 2;
    form.group1.checked = group & 1;
    form.other4.checked = other & 4; 
    form.other2.checked = other & 2;
    form.other1.checked = other & 1;
}
