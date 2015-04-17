/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                     *
 * Copyright (c) 2015 guh                                                              *
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

(function(){
  "use strict";

  angular
    .module('guh.components.models')
    .factory('DSActionType', DSActionTypeFactory)
    .run(function(DSActionType) {});

  DSActionTypeFactory.$inject = ['$log', 'DS', 'ModelsHelper'];

  function DSActionTypeFactory($log, DS, ModelsHelper) {

    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSActionType = DS.defineResource({

      // API configuration
      endpoint: 'action_types',
      suffix: '.json',

      // Model configuration
      idAttribute: 'id',
      name: 'actionType',
      relations: {
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId',
            parent: true
          }
        }
      },
      
      // Computed properties
      computed: {
        inputData: ['name', 'paramTypes', _getInputData],
      },

      // Instance methods
      methods: {
        getParams: getParams,
        getRuleActionParams: getRuleActionParams
      },

      // Lifecycle Hooks
      afterInject: _afterInject

    });

    return DSActionType;


    /*
     * Private method: _getActionPhrase(name, paramTypes)
     */
    function _getActionPhrase(name, paramTypes) {
      var phrase = 'Execute ' + name;

      if(paramTypes.length === 0) {
        phrase = phrase + '.';
      } else {
        phrase = phrase + ' with params...';
      }
      return phrase;
    }

    /*
     * Private method: _getInputData(name, paramTypes)
     */
    function _getInputData(name, paramTypes) {
      var inputData = {};
      
      inputData.actionPhrase = _getActionPhrase(name, paramTypes);

      return inputData;
    }

    /*
     * Private method: _afterInject(resource, actionType)
     */
    function _afterInject(resource, actionType) {
      var paramTypes = actionType.paramTypes;

      // Enhance paramTypes with following attributes: operator, templateUrl, value
      angular.forEach(paramTypes, function(paramType) {
        var templateData = ModelsHelper.getTemplateData(paramType);

        paramType.inputData = {
          operator: 'ValueOperatorEquals',
          templateUrl: templateData.templateUrl,
          value: templateData.value
        };
      });
    }


    /*
     * Public method: getParams()
     */
    function getParams() {
      var self = this;
      var params = [];
      var paramTypes = self.paramTypes;

      angular.forEach(paramTypes, function(paramType) {
        params.push({
          name: paramType.name,
          value: paramType.inputData.value
        });
      });

      return params;
    }

    /*
     * Public method: getRuleActionParams()
     */
    function getRuleActionParams() {
      var self = this;
      var ruleActionParams = [];
      var paramTypes = self.paramTypes;

      angular.forEach(paramTypes, function(paramType) {
        ruleActionParams.push({
          name: paramType.name,
          value: paramType.inputData.value
        });
      });

      return ruleActionParams;
    }

  }

}());