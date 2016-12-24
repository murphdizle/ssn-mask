// Copyright (c) 2016 Amanda Murphy 
// This code is available under the "MIT License".
// Please see the file COPYING in this distribution
// for license terms.

import SsnController from './ssn.contoller';

let Ssn =
    function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                storedSsn: '=ssn'
            },
            controller: SsnController,
            controllerAs: 'ssnController',
            link: function (scope, elem, attrs, ngModel) {
                scope.ssnController = new SsnController(scope);

                scope.loadSsn = function () { //if a value was passed in mask it
                    if(scope.storedSsn == null) {
                        scope.storedSsn = "";
                        return;
                    }  //if the actual ssn is null initialize it
                    var maskedVal = scope.ssnController.generateMaskedSsn(elem[0].value.length, elem[0].value, scope.storedSsn);
                    ngModel.$setViewValue(maskedVal);
                    ngModel.$render();

                };
                scope.loadSsn();
                elem.bind('keyup', function(e) {
                    scope.storedSsn = scope.ssnController.maskSsn(elem, scope.storedSsn);
                });
            }
        }
    };

export default Ssn;
