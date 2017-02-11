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
    .module('guh.containers')
    .controller('ThingDetailsCtrl', ThingDetailsCtrl);

  ThingDetailsCtrl.$inject = ['app', 'libs', '$log', '$scope', '$filter', '$state', '$stateParams', 'DSDevice', 'DSDeviceClass', 'DSParamType', 'DSState', 'DSRule', 'NavigationBar', 'ActionBar', 'ModalContainer'];

  /**
   * @ngdoc controller
   * @name guh.containers.controller:ThingDetailsCtrl
   * @description Container component for a single thing.
   *
   */
  function ThingDetailsCtrl(app, libs, $log, $scope, $filter, $state, $stateParams, DSDevice, DSDeviceClass, DSParamType, DSState, DSRule, NavigationBar, ActionBar, ModalContainer) {
    
    var vm = this;
    var device;

    vm.showActions = true;
    vm.showStates = false;
    vm.showSettings = false;
    vm.logEntries = {};

    vm.$onInit = $onInit;
    vm.back = back;
    vm.show = show;
    vm.remove = remove;
    vm.isCritical = isCritical;

    vm.updateLogEntries = updateLogEntries;

    vm.eCarCosts = null;
    vm.eCarEnergy = null;
    vm.gridCosts = null;
    vm.gridEnergy = null;
    vm.pvCosts = null;
    vm.pvEnergy = null;
    vm.savings = null;
    vm.time = null;
    vm.totalCosts = null;
    vm.totalEnergy = null;

    vm.modeAction = null;
    vm.modeState = null;
    vm.tradingAction = null;
    vm.tradingState = null;


    const E_CAR_COSTS_STATE_ID = '{d7379979-58f2-4318-8c2c-5cf0b7ec8aa7}';
    const E_CAR_ENERGY_STATE_ID = '{32ebbcc7-ec3d-4e7d-bc38-d29bd75a4bac}';
    const GRID_CONSTS_STATE_ID = '{1f1e6d91-5969-45e3-ae5c-cabc2cbc4e55}';
    const GRID_ENERGY_STATE_ID = '{5bdd5dca-e475-4e5a-a7b4-6ee9310eb52a}';
    const PV_COSTS_STATE_ID = '{d0d0f97c-36d9-4704-aa5c-c8268a22ef92}';
    const PV_ENERGY_STATE_ID = '{eef0526d-4901-4197-bde1-f2e5829fc8c3}';
    const SAVINGS_STATE_ID = '{d17ca984-5d03-4999-b823-da68144f0db8}';
    const TIME_STATE_ID = '{f7822921-8179-48af-9d99-c9a084b06316}';
    const TOTAL_COSTS_STATE_ID = '{6feff3d2-b7d2-404f-8fb0-d06a57ae50c6}';
    const TOTAL_ENERGY_STATE_ID = '{d5e0f05f-119f-4f43-971e-f6f3cc800686}';

    const MODE_ACTION_ID = '{a4c2d533-477d-4e1c-b3d0-049042c03f3c}';
    const TRADING_ACTION_ID = '{a4c9b941-a979-4804-97e2-354ad3af8858}';

    function updateLogEntries() {
      $log.log("updateLogEntries", vm.states);

      if(!vm.states) {
        return;
      }

      var timeState = vm.states.filter(function(state) {
        return [TIME_STATE_ID].indexOf(state.stateTypeId) > -1;
      });

      var time = timeState[0].value;

      if(!vm.logEntries.hasOwnProperty(time)) {
        vm.logEntries[time] = {};
        vm.logEntries[time].time = time;
      }

      angular.forEach(vm.states, function(state, index) {
        switch(state.stateTypeId) {
          case E_CAR_COSTS_STATE_ID:
            vm.eCarCosts = state;
            break;
          case E_CAR_ENERGY_STATE_ID:
            vm.logEntries[time]['ecar_energy'] = state.value;
            vm.eCarEnergy = state;
            break;
          case GRID_CONSTS_STATE_ID:
            vm.gridCosts = state;
            break;
          case GRID_ENERGY_STATE_ID:
            vm.logEntries[time]['grid_energy'] = state.value;
            vm.gridEnergy = state;
            break;
          case PV_COSTS_STATE_ID:
            vm.pvCosts = state;
            break;
          case PV_ENERGY_STATE_ID:
            vm.logEntries[time]['pv_energy'] = state.value;
            vm.pvEnergy = state;
            break;
          case SAVINGS_STATE_ID:
            vm.savings = state;
            break;
          case TIME_STATE_ID:
            vm.time = state;
            break;
          case TOTAL_COSTS_STATE_ID:
            vm.totalCosts = state;
            break;
          case TOTAL_ENERGY_STATE_ID:
            vm.logEntries[time]['total_energy'] = state.value;
            vm.totalEnergy = state;
            break;
        }
      });
      $log.log('trigger log Entries change ', vm.logEntries);
      vm.logEntries = angular.copy(vm.logEntries);
    }

    function $onInit() {
      if(!app.dataLoaded) {
        $state.go('guh.intro', {
          previousState: {
            name: $state.current.name,
            params: {
              deviceId: $stateParams.deviceId
            }
          }
        });
      } else {
        _initNavigation();
        _initActions();

        if(libs._.has($stateParams, 'deviceId') && $stateParams.deviceId) {
          device = DSDevice.get($stateParams.deviceId);
          _initThing(device);
        }
      }
    }

    function _initNavigation() {
      NavigationBar.changeItems([]);
    }

    function _initActions() {
      ActionBar.changeItems([
        {
          position: 1,
          iconUrl: './assets/svg/ui/ui.symbol.svg#chevron-left',
          label: 'Back to things',
          callback: back
        },
        {
          position: 2,
          iconUrl: './assets/svg/ui/ui.symbol.svg#trash-a',
          label: 'Remove',
          callback: remove
        }
      ]);
    }

    function _initThing(device) {
      $log.log('guh.controller.ThingDetailsCtrl initThing: ', device);
      vm.device = device;
      vm.setupComplete = device.setupComplete;
      vm.actions = [];
      vm.actionsObject = {};
      vm.deviceClass = device.deviceClass;
      vm.deviceClassId = device.deviceClassId;
      vm.id = device.id;
      vm.name = (device.name === 'Name') ? device.deviceClass.name : device.name;
      vm.params = device.params;
      vm.paramsObject = {};
      vm.enhancedParams = [];
      vm.states = device.states;
      vm.statesObject = {};

      vm.getDescription = device.getDescription;

      // Filter values of type "Double" to show only two digits after decimal point
      angular.forEach(vm.params, function(param, index) {
        // Find paramType to param
        var paramType = DSParamType.get(param.paramTypeId);

        if(angular.isDefined(paramType) && paramType.type === app.basicTypes.double) {
          vm.params[index].value = $filter('number')(vm.params[index].value, '2');
        }
      });

      angular.forEach(vm.states, function(state, index) {
        if(state.stateType.type === app.basicTypes.double) {
          vm.states[index].value = $filter('number')(vm.states[index].value, '2');
        }

        vm.statesObject[$filter('camelCase')(state.stateType.name)] = vm.states[index];
      });

      // Wait for templateUrl check
      device.deviceClass.templateUrl
        .then(function(fileExists) {
          if(device.deviceClassId == '{6a1d6ea5-3974-4f20-9c66-e95456e5ba90}') {
            vm.templateUrl = 'app/containers/thing-details/device-class-templates/template-household.html';
          } else {
            vm.templateUrl = fileExists;
          }
        })
        .catch(function(error) {
          $log.error('guh.controller.ThingDetailsCtrl', error);
        })
        .finally(function() {
          vm.templateReady = true;
        });

      // Actions
      var actionTypes = DSDeviceClass.getAllActionTypes(device.deviceClassId);
      var stateTypes = DSDeviceClass.getAllStateTypes(device.deviceClassId);

      angular.forEach(actionTypes, function(actionType) {
        var action = {};
        action.actionType = actionType;

        if(actionType.hasState) {
          var stateType = libs._.find(stateTypes, function(stateType) {
            return stateType.id === actionType.id;
          });
          var state = vm.statesObject[$filter('camelCase')(stateType.name)];

          // Add state to action
          action.state = state;
          action.stateType = stateType;

          // Remove state from steates array
          vm.states = vm.states.filter(function(state) {
            return state.stateType.id !== actionType.id;
          });

          switch(actionType.id) {
            case MODE_ACTION_ID:
              vm.modeAction = action;
              vm.modeState = state;
              break;
            case TRADING_ACTION_ID:
              vm.tradingAction = action;
              vm.tradingState = state;
              break;
          }
        }

        vm.actions.push(action);
        vm.actionsObject[$filter('camelCase')(actionType.name)] = action;
      });

      // Params
      angular.forEach(vm.params, function(param) {
        vm.paramsObject[param.paramTypeId] = param;
      });

      // Enhanced Params
      angular.forEach(vm.params, function(param) {
        vm.enhancedParams.push({
          param: param,
          paramType: DSParamType.get(param.paramTypeId)
        });
      });

      // States
      angular.forEach(vm.states, function(state) {
        vm.statesObject[$filter('camelCase')(state.stateType.name)] = state;
      });
    }

    function _getErrorData(error) {
      // var errorCode = error.data ? (error.data.error ? error.data.error : (error.data.deviceError) ? error.data.deviceError : null) : null;
      var errorCode = error.deviceError ? error.deviceError : null;
      var errorData = {};

      if(errorCode) {
        switch(errorCode) {
          case 'DeviceErrorDeviceIsChild':
            errorData.devices = _getDevices();
            break;
          case 'DeviceErrorDeviceInRule':
            var ruleIds = error.ruleIds ? error.ruleIds : [];
            errorData.rules = _getRules(ruleIds);
            break;
          default:
            $log.error(error);
        }
      } else {
        $log.error(error);
      }

      return errorData;
    }

    function _getDevices() {
      var deviceToDelete = device;
      var devices = {
        parentDevice: {},
        childDevices: []
      };

      if(DSDevice.is(deviceToDelete)) {
        var parentDevice;
        var childDevices;

        while(angular.isDefined(deviceToDelete.parentId)) {
          // Parent
          parentDevice = DSDevice.get(deviceToDelete.parentId);
          childDevices = [];
          
          // Children
          if(DSDevice.is(parentDevice)) {
            var currentChildDevices = DSDevice.getAll().filter(function(deviceToDelete) {
              return deviceToDelete.parentId === parentDevice.id;
            });

            childDevices = childDevices.concat(currentChildDevices);
          }

          // Override deviceToDelete with it's parent to traverse up
          deviceToDelete = parentDevice;
        }

        devices.parentDevice = parentDevice;

        // Filter deviceToDelete from childDevices
        devices.childDevices = childDevices.filter(function(childDevice) {
          return childDevice.id !== deviceToDelete.id;
        });
      }

      return devices;
    }

    function _getRules(ruleIds) {
      return DSRule.getAll(ruleIds);
    }


    function back() {
      $state.go('guh.things');
    }

    function show(type) {
      switch(type) {
        case 'actions':
          vm.showActions = true;
          vm.showStates = false;
          vm.showSettings = false;
          break;
        case 'states':
          vm.showActions = false;
          vm.showStates = true;
          vm.showSettings = false;
          break;
        case 'settings':
          vm.showActions = false;
          vm.showStates = false;
          vm.showSettings = true;
          break;
        default:
          vm.showActions = true;
          vm.showStates = false;
          vm.showSettings = false;
          break;
      }
    }

    function remove() {
      device
        .remove()
        .then(function() {
          // $state.go('guh.things');
        })
        .catch(function(error) {
          $log.error('error', error);
          var errorData = _getErrorData(error);
          $log.error('errorData', errorData);

          ModalContainer
            .add({
              controller: ['modalInstance', function(modalInstance) {
                this.modalInstance = modalInstance;
                this.thing = device;
                this.errorData = errorData;
              }],
              controllerAs: 'modal',
              data: null,
              template: '<guh-remove-thing thing="modal.thing" error-data="modal.errorData" modal-instance="modal.modalInstance"></guh-remove-thing>'
            })
            .then(function(modal) {
              modal.open();
            })
            .catch(function(error) {
              $log.error('error', error);
            });
        });
    }

    function isCritical() {
      if(angular.isDefined(vm.deviceClass) && angular.isDefined(vm.deviceClass.criticalStateTypeId)) {
        var criticalStateTypes = vm.deviceClass.stateTypes.filter(function(stateType) {
          return stateType.id === vm.deviceClass.criticalStateTypeId;
        });

        // Should be exactly one criticalStateType
        if(angular.isDefined(criticalStateTypes[0])) {
          var criticalStates = vm.device.states.filter(function(state) {
            return state.stateType.id === criticalStateTypes[0].id;
          });

          // Should be exactly one state
          return !criticalStates[0].value;
        }
      }

      return false;
    }

    DSState.on('DS.change', function(DSState, newState) {

      // States
      angular.forEach(vm.states, function(state, index) {
        if(state.stateType.type === app.basicTypes.double && state.stateType.id === newState.stateType.id) {
          vm.states[index].value = $filter('number')(newState.value, '2');
        }
      });

      if(MODE_ACTION_ID == newState.stateTypeId) {
        vm.modeState = newState;
      }
      if(TRADING_ACTION_ID == newState.stateTypeId) {
        vm.tradingState = newState;
      }
      // do not update the whole diagram for every new state value
      if(newState.stateTypeId === TIME_STATE_ID) {
        vm.updateLogEntries();
      }
    });

  }

}());
