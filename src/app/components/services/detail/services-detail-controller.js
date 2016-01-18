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


/**
 * @ngdoc interface
 * @name guh.services.controller:ServicesDetailCtrl
 *
 * @description
 * Load and show details of certain service.
 *
 */

(function(){
  'use strict';

  angular
    .module('guh.services')
    .controller('ServicesDetailCtrl', ServicesDetailCtrl);

  ServicesDetailCtrl.$inject = ['$log', '$scope', '$filter', '$state', '$stateParams', 'app', 'libs', 'DSHttpAdapter', 'DSDevice', 'DSState', 'DSDeviceClass'];

  function ServicesDetailCtrl($log, $scope, $filter, $state, $stateParams, app, libs, DSHttpAdapter, DSDevice, DSState, DSDeviceClass) {

    // Don't show debugging information
    DSDevice.debug = false;

    var vm = this;
    var service = {};

    // Public methods


    /**
     * @ngdoc interface
     * @name _init
     * @methodOf guh.services.controller:ServicesDetailCtrl
     *
     * @description
     * Set data for view.
     *
     */

    function _init() {
      var serviceId = $stateParams.serviceId;

      // Return to service list if deviceId is unknown (e.g. on browser reload services/detail)
      if(!serviceId) {
        $state.go('guh.services.master');
        return;
      }

      service = DSDevice.get(serviceId);

      if(angular.isUndefined(service)) {
        $state.go('guh.intro', {
          previousState: {
            name: $state.current.name,
            params: $stateParams
          }
        });
      } else {
        // Set view variables
        vm.setupComplete = service.setupComplete;
        vm.actions = [];
        vm.actionsObject = {};
        vm.deviceClass = service.deviceClass;
        vm.deviceClassId = service.deviceClassId;
        vm.id = service.id;
        vm.name = (service.name === 'Name') ? service.deviceClass.name : service.name;
        vm.params = service.params;
        vm.paramsObject = {};
        vm.states = service.states;
        vm.statesObject = {};

        // Filter values of type "Double" to show only two digits after decimal point
        angular.forEach(vm.params, function(param) {
          // Find paramType to param
          var paramType = libs._.find(service.deviceClass.paramTypes, function(paramType) {
            return paramType.name === param.name;
          });

          if(paramType.type === app.basicTypes.double) {
            vm.params[index].value = $filter('number')(vm.params[index].value, '2');
          }
        });

        angular.forEach(vm.states, function(state, index) {
          if(state.stateType.type === app.basicTypes.double) {
            vm.states[index].value = $filter('number')(vm.states[index].value, '2');
          }
        });

        // Wait for templateUrl check
        service.deviceClass.templateUrl
          .then(function(fileExists) {
            vm.templateUrl = fileExists.replace('devices', 'services');
          })
          .catch(function(error) {
            $log.error('guh.controller.ServicesDetailCtrl', error);
          })
          .finally(function() {
            vm.templateReady = true;
          });

        // Actions
        var actionTypes = DSDeviceClass.getAllActionTypes(service.deviceClassId);
        var stateTypes = DSDeviceClass.getAllStateTypes(service.deviceClassId);

        angular.forEach(actionTypes, function(actionType) {
          var action = {};
          action.actionType = actionType;

          if(actionType.hasState) {  
            var state = libs._.find(vm.deviceClass.stateTypes, function(stateType) {
              return stateType.id === actionType.id;
            });

            // Add state to action
            action.state = state;

            // Remove state from sates array
            vm.states = libs._.without(vm.states, state);
          }

          vm.actions.push(action);
          vm.actionsObject[$filter('camelCase')(actionType.name)] = action;
        });

        // Params
        angular.forEach(vm.params, function(param) {
          vm.paramsObject[$filter('camelCase')(param.name)] = param;
        });

        // States
        angular.forEach(vm.states, function(state) {
          vm.statesObject[$filter('camelCase')(state.stateType.name)] = state;
        });
      }
    }
    
    _init();

  }

}());
