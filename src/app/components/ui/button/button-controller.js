/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                     *
 * Copyright (C) 2015 Lukas Mayerhofer <lukas.mayerhofer@guh.guru>                     *
 *                                                                                     *
 * Permission is hereby granted, free of charge, to any person obtaining a copy        *
 * of this software and associated documentation files (the "Software"), to deal       *
 * in the Software without restriction, including without limitation the rights        *
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell           *
 * copies of the Software, and to permit persons to whom the Software is               *
 * furnished to do so, subject to the following conditions:                            *
 *                                                                                     *
 * The above copyright notice and this permission notice shall be included in all      *
 * copies or substantial portions of the Software.                                     *
 *                                                                                     *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR          *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,            *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE         *
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER              *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,       *
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE       *
 * SOFTWARE.                                                                           *
 *                                                                                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
 
(function() {
  'use strict';

  angular
    .module('guh.ui')
    .controller('GuhButton', GuhButton);

  GuhButton.$inject = ['$log', '$timeout'];

  function GuhButton($log, $timeout) {
    
    var vm = this;

    vm.$onInit = $onInit;
    vm.$onChanges = $onChanges;
    
    vm.press = press;


    function _checkProps() {
      if(angular.isUndefined(vm.asyncStatus)) {
        vm.asyncStatus = false;
      }
    }


    function $onInit() {
      _checkProps();
    }

    function $onChanges(changesObj) {
      // Argument: changesObj => for each binding: { currentValue, previousValue, isFirstChange() }
      if(angular.isDefined(changesObj.asyncStatus) && angular.isDefined(changesObj.asyncStatus.currentValue)) {
        if((angular.isDefined(changesObj.asyncStatus.currentValue.success) && changesObj.asyncStatus.currentValue.success) || (angular.isDefined(changesObj.asyncStatus.currentValue.failure) && changesObj.asyncStatus.currentValue.failure)) {
          $timeout(function() {
            vm.asyncStatus.success = false;
            vm.asyncStatus.failure = false;
          }, 500);
        }
      }
    }


    function press() {
      vm.onPress();
    }

  }

}());