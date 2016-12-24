# ssn-mask

Copyright (c) 2016 Amanda Murphy This code is available under the "MIT License". Please see the file COPYING in this distribution for license terms.

AngularJS directive that masks social security number. An ssn like 123456789 will appear as ***-**-6789. 

Using the directive:
ng-model is required, the variable there will be the value of the displayed social security number and will be masked. The variable passed into the directive will be the actual value (ssn in the example below). 

<input type="text" id="ssn" ng-model="displayedSsn" ssn="ssn" required />

