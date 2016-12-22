
class SsnController {
    constructor($scope) {
        'ngInject';
        this.$scope = $scope;
        SsnController.storedSsn = $scope.storedSsn;
        this.firstDash = 1;
        this.secondDash = 2;
        this.noDashesYet = 3;
        this.hasOneDash = 6;
        this.maxMaskedSsnLength = 11;
    }

    isFocused(elem) {
        return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
    }
    getCaretPosition(input) {
        if (!input) {
            return 0;
        }
        if (input.selectionStart != undefined) {
            return input.selectionStart;
        }
        return 0;
    }
    setCaretPosition(input, pos) {
        if (!input)
            return 0;
        if (input.offsetWidth === 0 || input.offsetHeight === 0) {
            return;
        }
        if (input.setSelectionRange && this.isFocused(input)) {
                input.focus();
                input.setSelectionRange(pos, pos);
        }
    }

    repeat(str, times) {
        return (new Array(times + 1)).join(str);
    }

    isDisplayedSsnBiggerThanSsn(displayedSsnLength, ssnLength) { //we need to consider the dashes when testing sizes
        if(ssnLength == null && displayedSsnLength != null) {
            return true;
        }
        if(displayedSsnLength <= this.noDashesYet) {
            return (displayedSsnLength > ssnLength)
        }
        else if(displayedSsnLength <= this.hasOneDash) {
            return ((displayedSsnLength - this.firstDash) > ssnLength)
        }
        else {
            return ((displayedSsnLength - this.secondDash) > ssnLength)
        }
    }

    parseSsn(displayedSsn, Ssn) {
        if(displayedSsn.length <= this.noDashesYet) {
            return displayedSsn.slice(Ssn.length, displayedSsn.length);
        }
        else if (displayedSsn.length <= this.hasOneDash) {
            return displayedSsn.slice((Ssn.length + this.firstDash), displayedSsn.length);
        }
        else {
            return displayedSsn.slice((Ssn.length + this.secondDash), displayedSsn.length);
        }
    }

    generateMaskedSsn(length, displayedSsn, storedSsn) {
        if(length == 0) { //this is only for when an ssn is passed in when the page is loaded
            return ('***-**-' + storedSsn.slice(5, storedSsn.length));
        }
        if(length < this.noDashesYet) {
            return this.repeat('*', length);
        }
        if(length == this.noDashesYet) {
            return ('***-');
        }
        if(length < this.hasOneDash) {
            return ('***-' + this.repeat('*', (length - 4)));
        }
        if (length == this.hasOneDash) {
            return ('***-**-');
        }
        return displayedSsn;
    }

    deleteKeyPressedSsn(ssn, length) {
        if(length < this.noDashesYet) {
            return ssn.slice(0, length);
        }
        if(length < this.hasOneDash) {
            return ssn.slice(0, (length - this.firstDash));
        }
        return ssn.slice(0, (length - this.secondDash));
    }

    maskSsn(elem, storedSsn) {

        var len = elem[0].value.length;
        var displayed = elem[0].value;
        if(storedSsn == null) { 
            storedSsn = ""; 
        } //if the actual ssn is null initialize it
        var storedValue = storedSsn;

        if(len > this.maxMaskedSsnLength) { //do not allow more than 11 characters
            elem[0].value = elem[0].value.slice(0, this.maxMaskedSsnLength);
            return storedSsn;
        }

        var notIllegalCharRegex = /\d|\*|-/i.exec(elem[0].value.slice(len-1, len));
        if(notIllegalCharRegex == null && len != 0) { //if an illegal character is entered delete it and leave.
            elem[0].value = elem[0].value.slice(0, len-this.firstDash);
            return storedSsn;
        }

        //if the move the curser somewhere in the middle move it back and restore the input
        var caretPos = this.getCaretPosition(elem[0]) || 0;
        if(caretPos != len) {
            this.setCaretPosition(elem[0], len);
            elem[0].value = this.generateMaskedSsn(0, '', storedValue);
            return storedSsn;
        }

        if(this.isDisplayedSsnBiggerThanSsn(len, storedValue.length)) {
            storedSsn += this.parseSsn(displayed, storedValue);
            elem[0].value = this.generateMaskedSsn(len, displayed, storedValue);
        }
        else {  //the delete key was pressed
            if(len == this.noDashesYet || len == this.hasOneDash) { //if they deleted a dash removed last digit as well
                elem[0].value = displayed.slice(0, (len - this.firstDash));
            }
            storedSsn = this.deleteKeyPressedSsn(storedValue, len);
        }
        return storedSsn;
    }
}
export default SsnController;
