// Copyright (c) 2016 Amanda Murphy 
// This code is available under the "MIT License".
// Please see the file COPYING in this distribution
// for license terms.


import angular from 'angular';
import Ssn from './ssn.directive';

let SsnModule = angular.module('Ssn', [])
    .directive('ssn', Ssn);

export default SsnModule;
