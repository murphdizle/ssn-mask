// Copyright (c) 2016 Amanda Murphy 
// This code is available under the "MIT License".
// Please see the file COPYING in this distribution
// for license terms.

import angular from 'angular';
import 'angular-mocks';
import SsnModule from './ssn';
import SsnController from './ssn.contoller';

describe('SsnController', () => {
    'use strict';

    let scope,
        $rootScope,
        element,
        ngModel,
        testSsn,
        $compile,
        controller,
        event,
        $document;

    beforeEach(angular.mock.module(SsnModule.name, ($provide) => {

    }));

    beforeEach(angular.mock.inject(
        (_$rootScope_, _$compile_, _$document_) => {
            $rootScope = _$rootScope_;
            $compile =_$compile_;
            $document = _$document_;
    }));
    describe('isFocused', () => {
        beforeEach(() => {
            element = angular.element('<input type="text" ng-model="model" ssn="testSsn" />');
            controller = new SsnController($rootScope);
            controller.document = $document;
            scope = $rootScope;
            $compile(element)(scope);
            $rootScope.$digest();

            ngModel = element.controller('ngModel');
            scope.$apply();
        });
        it('should return true', () => {
            $document.activeElement = $document.find('body');
            $document.hasFocus = true;

            var result = controller.isFocused(element[0]);
            expect(result).toBeFalsy();
        });
    });
    describe('setCaretPosition()', () => {
        beforeEach(() => {
            controller = new SsnController($rootScope);
            element = angular.element('<input type="text" ng-model="model" ssn="testSsn" />');
            scope = $rootScope;
            $compile(element)(scope);
            $rootScope.$digest();

            ngModel = element.controller('ngModel');
            scope.$apply();
        });
        var result;
        it('should return undefined because it hit the second if', () => {
            element[0].value = '12345678';
            spyOn(element[0], 'focus');
            result = controller.setCaretPosition(element[0], 4);
            expect(result).toBe(undefined);
        });
        it('should hit the first if statement and return 0', () => {
            var input;
            result = controller.setCaretPosition(input, 1);
            expect(result).toBe(0);
        });
    });
    describe('setCaretPosition()', () => {
        beforeEach(() => {
            controller = new SsnController($rootScope);
            element = angular.element('<input type="text" ng-model="model" ssn="testSsn" />');
            scope = $rootScope;
            $compile(element)(scope);
            $rootScope.$digest();
            $document.find('body').eq(0).append(element);

            ngModel = element.controller('ngModel');
            scope.$apply();
        });
        it('should not go into any of the ifs', () => {
            element[0].value = '123456789';
            spyOn(controller, 'isFocused').and.returnValue(false);
            spyOn(element[0], 'setSelectionRange');
            controller.setCaretPosition(element[0], 4);
            expect(element[0].setSelectionRange).toHaveBeenCalledTimes(0);
        });
        it('should go into the third if statement', () => {
            element[0].value = '123456789';
            element[0].setSelectionRange = true;
            spyOn(controller, 'isFocused').and.returnValue(true);
            spyOn(element[0], 'setSelectionRange');
            controller.setCaretPosition(element[0], 4);
            expect(element[0].setSelectionRange).toHaveBeenCalledTimes(1);
        });
    });
    describe('getCaretPosition()', () => {
        beforeEach(() => {
            controller = new SsnController($rootScope);
            element = angular.element('<input type="text" ng-model="model" ssn="testSsn" />');
            scope = $rootScope;
            $compile(element)(scope);
            $rootScope.$digest();

            $document.find('body').eq(0).append(element);
            ngModel = element.controller('ngModel');
            scope.$apply();
        });
        it('should hit the else', () => {
            var result = controller.getCaretPosition($document);
            expect(result).toBe(0);
            expect($document)
        });
    });

    describe('getCaretPosition()', () => {
        beforeEach(() => {
            controller = new SsnController($rootScope);
            element = angular.element('<input type="text" ng-model="model" ssn="testSsn" />');
            scope = $rootScope;
            $compile(element)(scope);
            $rootScope.$digest();

            ngModel = element.controller('ngModel');
            scope.$apply();
            element[0].value = '123456';
            element[0].selectionStart = 3;
        });
        var input,
            result;
        it('it should find the correct position', () => {
            result = controller.getCaretPosition(element[0]);
            expect(result).toBe(6);
        });
        it('should return 0 on null', () => {
            var input;
            result = controller.getCaretPosition(input);
            expect(result).toBe(0);
        });
        it('should see that the curser is in the wrong place and restore the displayed value', () => {
            element[0].value = '**-**-123';
            element[0].selectionStart = 1;
            spyOn(controller, 'getCaretPosition').and.returnValue(1);
            var storedSsn = '12345123';
            result = controller.maskSsn(element, storedSsn);
            expect(result).toBe('12345123');
            expect(element[0].value).toBe('***-**-123');
        });
    });
    describe('repeat()', () => {
        beforeEach(() => {
            controller = new SsnController($rootScope);
            element = angular.element('<input type="text" ng-model="model" ssn="testSsn" />');
            scope = $rootScope;
            $compile(element)(scope);
            $rootScope.$digest();

            ngModel = element.controller('ngModel');
            scope.$apply();
        });
        var randNum = Math.floor(Math.random() * 100),
            someString = 'a',
            result,
            regex,
            regexString;
        it('it should repeat the string the correct number of times', () => {
            result = controller.repeat(someString, randNum);
            regexString = new RegExp(someString + '{' + parseInt(randNum) + '}', "g");
            regex = regexString.exec(result);
            expect(regex).toBeTruthy();
        });
    });
    describe('isDisplayedSsnBiggerThanSsn', () => {
        beforeEach(() => {
            controller = new SsnController($rootScope);
            element = angular.element('<input type="text" ng-model="model" ssn="testSsn" />');
            scope = $rootScope;
            $compile(element)(scope);
            $rootScope.$digest();

            ngModel = element.controller('ngModel');
            scope.$apply();
        });
        var displayedSsnLength,
            ssnLength,
            result;
        it('it should return true', () => {
            displayedSsnLength = 4;
            ssnLength = 2;
            result = controller.isDisplayedSsnBiggerThanSsn(displayedSsnLength, ssnLength);
            expect(result).toBeTruthy();
        });
        it('it should return true, in the second if', () => () => {
            displayedSsnLength = 6;
            ssnLength = 4;
            result = controller.isDisplayedSsnBiggerThanSsn(displayedSsnLength, ssnLength);
            expect(result).toBeTruthy();
        });
        it('it should return false, in the third if', () => {
            displayedSsnLength = 7;
            ssnLength = 5;
            result = controller.isDisplayedSsnBiggerThanSsn(displayedSsnLength, ssnLength);
            expect(result).toBeFalsy();
        });
        it('it should return true when the first digit is entered', () => {
            displayedSsnLength = 1;
            ssnLength = null;
            result = controller.isDisplayedSsnBiggerThanSsn(displayedSsnLength, ssnLength);
            expect(result).toBeTruthy();
        })
    });
    describe('parseSsn()', () => {
        beforeEach(() => {
            controller = new SsnController($rootScope);
            element = angular.element('<input type="text" ng-model="model" ssn="testSsn" />');
            scope = $rootScope;
            $compile(element)(scope);
            $rootScope.$digest();

            ngModel = element.controller('ngModel');
            scope.$apply();
        });
        var parsedValue,
            displayedValue;

        it('it should parse the 4', () => {
            parsedValue = '1';
            displayedValue = '*4';
            parsedValue += controller.parseSsn(displayedValue, parsedValue);
            expect(parsedValue).toBe('14');
        });
        it('it should parse the last digit', () => {
            parsedValue = '9876543';
            displayedValue = '***-**-**2';
            parsedValue += controller.parseSsn(displayedValue, parsedValue);
            expect(parsedValue).toBe('98765432');
        });
    });

    describe('generateMaskedSsn()', () => {
        beforeEach(() => {
            controller = new SsnController($rootScope);
            element = angular.element('<input type="text" ng-model="model" ssn="testSsn" />');
            scope = $rootScope;
            $compile(element)(scope);
            $rootScope.$digest();

            ngModel = element.controller('ngModel');
            scope.$apply();
        });
        var length,
            result;
        it('it should mask a single digit with one star, and it should be in the second if', () => {
            length = 1;
            result = controller.generateMaskedSsn(length, '', '');
            expect(result).toBe('*');
        });
        it('it should mask the 3 digit ssn and add the dash, this should happen in the third if', () => {
            length = 3;
            result = controller.generateMaskedSsn(length, '', '');
            expect(result).toBe('***-');
        });
        it('it should mask the 4 digits and it should go into the the forth if', () => {
            length = 5;
            result = controller.generateMaskedSsn(length, '', '');
            expect(result).toBe('***-*');
        });
        it('it should mask the 5 digit ssn and add two dashes, this should happen in the last if', () => {
            length = 6;
            result = controller.generateMaskedSsn(length, '', '');
            expect(result).toBe('***-**-');
        });
        it('it should just return the displayed value', () => {
            length = 11;
            result = controller.generateMaskedSsn(length, '***-**-1234', '');
            expect(result).toBe('***-**-1234');
        });
        it('if an ssn is passed in it should generate the mask', () => {
            length = 0;
            result = controller.generateMaskedSsn(length, '', '123456789');
            expect(result).toBe('***-**-6789');
        });
    });

    describe('deleteKeyPressedSsn()', () => {
        beforeEach(() => {
            element = angular.element('<input type="text" ng-model="model" ssn="testSsn" />');
            scope = $rootScope;
            $compile(element)(scope);
            scope.$digest();
            controller = new SsnController(scope);
        });
        var ssn = String(Math.floor(Math.random() * 10000000)),
            length,
            result,
            expected;
        it('it should remove the correct number of characters, this should hit the first if', () => {
            length = 2;
            result = controller.deleteKeyPressedSsn(ssn, length);
            expected = ssn.slice(0, 2);
            expect(result).toBe(expected);
        });
        it('it should remove the correct number of characters, this should go into the second if', () => {
            length = 4;
            result = controller.deleteKeyPressedSsn(ssn, length);
            expected = ssn.slice(0, 3);
            expect(result).toBe(expected);
        });
        it('it should remove the correct number of characters, this should hit the final return statement', () => {
            length = 7;
            result = controller.deleteKeyPressedSsn(ssn, length);
            expected = ssn.slice(0, 5);
            expect(result).toBe(expected);
        });
    });

    describe('maskSsn()', () => {
        beforeEach(() => {
            controller = new SsnController($rootScope);
            element = angular.element('<input type="text" ng-model="model" ssn="testSsn" />');
            scope = $rootScope;
            $compile(element)(scope);
            $rootScope.$digest();

            ngModel = element.controller('ngModel');
            scope.$apply();
        });
        var storedSsn,
            result;

        it('it should realized the curser is in the wrong pos and reset the display', () => {
            storedSsn = '123456789';
            element[0].value = '**-**-6789';
            element[0].selectionStart = 2;
            element[0].setSelectionRange(2, 2);
            spyOn(controller, 'getCaretPosition').and.returnValue(2);
            result = controller.maskSsn(element, storedSsn);
            expect(result).toBe('123456789');
            expect(element[0].value).toBe('***-**-6789');
        });

    });
    describe('maskSsn()', () => {
        beforeEach(() => {
            controller = new SsnController($rootScope);
            element = angular.element('<input type="text" ng-model="model" ssn="testSsn" />');
            scope = $rootScope;
            $compile(element)(scope);
            $rootScope.$digest();

            ngModel = element.controller('ngModel');
            scope.$apply();
        });
       var  storedSsn,
           result;

        it('it should mask the new digit and add it to the result', () => {
            element[0].value = '5';
            result = controller.maskSsn(element, storedSsn);
            expect(result).toBe('5');
            expect(element[0].value).toBe('*');
        });

        it('it should see that the delete key was pressed and remove a star from displayed ssn and an int from storedSsn', () => {
            element[0].value = '***';
            storedSsn = '123';
            result = controller.maskSsn(element, storedSsn);
            expect(result).toBe('12');
            expect(element[0].value).toBe('**');
        });

        it('it should see that the delete key was pressed and remove a star from displayed ssn and an int from storedSsn', () => {
            element[0].value = '***-**';
            storedSsn = '12345';
            result = controller.maskSsn(element, storedSsn);
            expect(result).toBe('1234');
            expect(element[0].value).toBe('***-*');
        });

        it('it should see that the delete key was pressed and remove a star from displayed ssn and an int from storedSsn', () => {
            element[0].value = '';
            storedSsn = '1';
            result = controller.maskSsn(element, storedSsn);
            expect(result).toBe('');
            expect(element[0].value).toBe('');
        });

        it('it should mask the new digit and add it to the result', () => {
            element[0].value = '***-4';
            storedSsn = '123';
            result = controller.maskSsn(element, storedSsn);
            expect(result).toBe('1234');
            expect(element[0].value).toBe('***-*');
        });

    });

    describe('keyup', () => {
        beforeEach(() => {
            element = angular.element('<input type="text" ng-model="model" ssn="testSsn" />');
            scope = $rootScope;
            $compile(element)(scope);
            $rootScope.$digest();

            ngModel = element.controller('ngModel');
            scope.$apply();

            event = document.createEvent("Events");
            event.initEvent('keyup', true, false);
        });
        it('it should bind to the testSsn and mask the value', () => {
            element[0].value = '3';
            event.keyCode = 51;
            element.triggerHandler(event);
            expect(element[0].value).toBe('*');
        });
        it('it should see that the string is too long and remove the extra digit', () => {
            element[0].value = '***-**-12345';
            event.keyCode = 53;
            element.triggerHandler(event);
            expect(element[0].value).toBe('***-**-1234');
        });
        it('it should remove the illegal character and leave an empty string', () => {
            element[0].value = 'c';
            event.keyCode = 67;
            element.triggerHandler(event);
            expect(element[0].value).toBe('');
        });

    });
    describe('directive', () => {
        beforeEach(() => {
            element = angular.element('<input type="text" ng-model="model" ssn="testSsn" />');
            scope = $rootScope;
            scope.testSsn = '987654321';
            $compile(element)(scope);
            scope.$digest();
        });
        it('it should bind to the testSsn and mask the value', () => {
            expect(element[0].value).toBe('***-**-4321');
        });
    });
});
